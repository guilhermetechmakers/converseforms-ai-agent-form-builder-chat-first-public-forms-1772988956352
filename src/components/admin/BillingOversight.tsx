import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, DollarSign, Gift, Tag } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  useAdminInvoices,
  useAdminMetrics,
  useAdminRefundInvoice,
  useAdminApplyCredit,
  useAdminCreatePromo,
} from '@/hooks/useAdmin'
import { AnimatedPage } from '@/components/AnimatedPage'
import { format } from 'date-fns'

export function BillingOversight() {
  const { data: invoices = [], isLoading } = useAdminInvoices()
  const { data: metrics = [] } = useAdminMetrics({ breakdown: 'billing' })
  const refund = useAdminRefundInvoice()
  const applyCredit = useAdminApplyCredit()
  const createPromo = useAdminCreatePromo()

  const [creditCustomerId, setCreditCustomerId] = useState('')
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscountPercent, setPromoDiscountPercent] = useState('')
  const [promoUsageLimit, setPromoUsageLimit] = useState('')

  const list = Array.isArray(invoices) ? invoices : []
  const chartData = Array.isArray(metrics) ? metrics.slice(0, 10).map((m) => ({ name: m.name, value: m.value })) : []

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Invoices, plans, and usage-based costs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Billing trends</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly spend</p>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
              No trend data yet
            </div>
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="rgb(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <p className="text-sm text-muted-foreground">Status, amount, due date, and actions.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground">
              <DollarSign className="h-10 w-10" />
              <p>No invoices yet.</p>
            </div>
          ) : (
            <div className="overflow-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-sm">{inv.id.slice(0, 8)}…</TableCell>
                      <TableCell>
                        {inv.currency} {inv.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>
                          {inv.status ?? '—'}
                        </Badge>
                      </TableCell>
                      <TableCell>{inv.dueDate ? format(new Date(inv.dueDate), 'PP') : '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {inv.periodStart && inv.periodEnd
                          ? `${format(new Date(inv.periodStart), 'MMM d')} – ${format(new Date(inv.periodEnd), 'MMM d')}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => refund.mutate(inv.id)}
                              disabled={refund.isPending || inv.status === 'refunded'}
                            >
                              Refund
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-4 w-4" />
              Apply credit
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Grant account credit to a customer. Creates an internal credit and updates balance.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credit-customer">Customer ID</Label>
              <Input
                id="credit-customer"
                placeholder="cus_… or user id"
                value={creditCustomerId}
                onChange={(e) => setCreditCustomerId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit-amount">Amount (cents)</Label>
              <Input
                id="credit-amount"
                type="number"
                min={1}
                placeholder="1000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit-reason">Reason</Label>
              <Input
                id="credit-reason"
                placeholder="Goodwill / compensation"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                const amount = parseInt(creditAmount, 10)
                if (!creditCustomerId.trim() || !amount || amount < 1 || !creditReason.trim()) return
                applyCredit.mutate({
                  customerId: creditCustomerId.trim(),
                  amount,
                  reason: creditReason.trim(),
                })
                setCreditCustomerId('')
                setCreditAmount('')
                setCreditReason('')
              }}
              disabled={
                applyCredit.isPending ||
                !creditCustomerId.trim() ||
                !creditAmount ||
                !creditReason.trim()
              }
            >
              {applyCredit.isPending ? 'Applying…' : 'Apply credit'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4" />
              Create promo code
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Create a new discount code for subscriptions or invoices.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Code</Label>
              <Input
                id="promo-code"
                placeholder="SAVE20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-percent">Discount % (optional)</Label>
              <Input
                id="promo-percent"
                type="number"
                min={0}
                max={100}
                placeholder="20"
                value={promoDiscountPercent}
                onChange={(e) => setPromoDiscountPercent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-limit">Usage limit (optional)</Label>
              <Input
                id="promo-limit"
                type="number"
                min={1}
                placeholder="100"
                value={promoUsageLimit}
                onChange={(e) => setPromoUsageLimit(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                if (!promoCode.trim()) return
                const discountPercent = promoDiscountPercent
                  ? parseInt(promoDiscountPercent, 10)
                  : undefined
                const usageLimit = promoUsageLimit ? parseInt(promoUsageLimit, 10) : undefined
                createPromo.mutate({
                  code: promoCode.trim(),
                  ...(discountPercent != null && !Number.isNaN(discountPercent)
                    ? { discountPercent }
                    : {}),
                  ...(usageLimit != null && !Number.isNaN(usageLimit) ? { usageLimit } : {}),
                })
                setPromoCode('')
                setPromoDiscountPercent('')
                setPromoUsageLimit('')
              }}
              disabled={createPromo.isPending || !promoCode.trim()}
            >
              {createPromo.isPending ? 'Creating…' : 'Create promo'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
