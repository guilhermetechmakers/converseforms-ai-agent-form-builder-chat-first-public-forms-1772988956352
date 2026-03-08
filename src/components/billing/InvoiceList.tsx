import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Download, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/types/billing'

function statusVariant(status: InvoiceStatus): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' {
  switch (status) {
    case 'paid':
      return 'success'
    case 'open':
      return 'warning'
    case 'void':
    case 'uncollectible':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export interface InvoiceListProps {
  invoices: Invoice[]
  onDownload?: (invoice: Invoice) => void
  onView?: (invoice: Invoice) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function InvoiceList({
  invoices,
  onDownload,
  onView,
  isLoading = false,
  emptyMessage = 'No invoices yet.',
  className,
}: InvoiceListProps) {
  const list = Array.isArray(invoices) ? invoices : []

  if (isLoading) {
    return (
      <div className={cn('space-y-3 animate-pulse', className)} aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-12 text-muted-foreground',
          className
        )}
      >
        <FileText className="h-10 w-10" aria-hidden />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('overflow-auto rounded-lg border border-border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((inv) => (
            <TableRow key={inv.id} className="transition-colors hover:bg-muted/50">
              <TableCell className="text-sm">
                {inv.date ? format(new Date(inv.date), 'PP') : '—'}
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {inv.number ?? inv.id.slice(0, 8)}
                {inv.id.length > 8 ? '…' : ''}
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  {inv.currency} {(inv.amountDue ?? 0).toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(inv.status)}>{inv.status ?? '—'}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Invoice actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(inv)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                    )}
                    {onDownload && (
                      <DropdownMenuItem onClick={() => onDownload(inv)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
