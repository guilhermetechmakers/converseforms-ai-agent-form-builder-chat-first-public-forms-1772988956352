import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { InvoiceList } from '@/components/billing'
import { PaymentMethodForm } from '@/components/billing'
import { useInvoices, useUpdatePaymentMethod } from '@/hooks/useBilling'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { billingApi } from '@/api/billing'
import type { Invoice } from '@/types/billing'

const LIMIT = 20
const STATUS_OPTIONS = ['', 'paid', 'open', 'draft', 'void', 'uncollectible'] as const

export default function BillingHistory() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null)

  const { data, isLoading } = useInvoices({
    page,
    limit: LIMIT,
    status: statusFilter || undefined,
    from: dateFrom || undefined,
    to: dateTo || undefined,
  })

  const updatePayment = useUpdatePaymentMethod()

  const invoices = Array.isArray(data?.data) ? data.data : []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / LIMIT) || 1

  const handleDownload = useCallback(async (invoice: Invoice) => {
    try {
      if (invoice.pdfUrl) {
        window.open(invoice.pdfUrl, '_blank', 'noopener,noreferrer')
        toast.success('Opening invoice')
        return
      }
      const res = await billingApi.getInvoiceDownloadUrl(invoice.id)
      if (res?.url) {
        window.open(res.url, '_blank', 'noopener,noreferrer')
        toast.success('Opening invoice')
      } else {
        toast.error('Download URL not available')
      }
    } catch {
      toast.error('Failed to get download link')
    }
  }, [])

  const handleView = useCallback((invoice: Invoice) => {
    setDetailInvoice(invoice)
  }, [])

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-6 md:px-8">
            <div className="max-w-[1200px] mx-auto">
              <Button variant="ghost" size="sm" asChild className="mb-2">
                <Link to="/dashboard/billing">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">Billing history</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Invoices, receipts, and payment method.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8">
            <PaymentMethodForm
              onSubmit={() => updatePayment.mutate(window.location.href)}
              isLoading={updatePayment.isPending}
              error={updatePayment.isError ? (updatePayment.error as Error)?.message : null}
              className="animate-fade-in-up"
            />

            <Card className="animate-fade-in-up">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoices
                  </CardTitle>
                  <CardDescription>
                    Filter by status and date range.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {STATUS_OPTIONS.filter(Boolean).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    placeholder="From"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[140px]"
                    aria-label="From date"
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[140px]"
                    aria-label="To date"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <InvoiceList
                  invoices={invoices}
                  onDownload={handleDownload}
                  onView={handleView}
                  isLoading={isLoading}
                  emptyMessage="No invoices yet. Your invoices will appear here after you subscribe."
                />
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>
                      Page {page} of {totalPages} ({totalCount} total)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={!!detailInvoice} onOpenChange={() => setDetailInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice details</DialogTitle>
          </DialogHeader>
          {detailInvoice && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Number:</span> {detailInvoice.number ?? detailInvoice.id}</p>
              <p><span className="text-muted-foreground">Date:</span> {detailInvoice.date}</p>
              <p><span className="text-muted-foreground">Amount:</span> {detailInvoice.currency} {(detailInvoice.amountDue ?? 0).toFixed(2)}</p>
              <p><span className="text-muted-foreground">Status:</span> {detailInvoice.status}</p>
              {detailInvoice.pdfUrl && (
                <Button size="sm" variant="outline" className="mt-2" onClick={() => handleDownload(detailInvoice)}>
                  Download PDF
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
