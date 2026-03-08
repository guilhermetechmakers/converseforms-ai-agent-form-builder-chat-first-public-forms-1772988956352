import { Button } from '@/components/ui/button'
import { Printer, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PrintableToolbarProps {
  onPrint: () => void
  onDownloadPDF?: () => void
  isPrintableEnabled?: boolean
  className?: string
}

/**
 * Sticky toolbar with Print and optional Download PDF actions.
 * Print styles are applied via .print\:hidden and print stylesheet.
 */
export function PrintableToolbar({
  onPrint,
  onDownloadPDF,
  isPrintableEnabled = true,
  className,
}: PrintableToolbarProps) {
  if (!isPrintableEnabled) return null

  return (
    <div
      className={cn(
        'print:hidden sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        className
      )}
      role="toolbar"
      aria-label="Document actions"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPrint}
        aria-label="Print this page"
      >
        <Printer className="h-4 w-4" aria-hidden />
        Print
      </Button>
      {typeof onDownloadPDF === 'function' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDownloadPDF}
          aria-label="Download as PDF"
        >
          <FileDown className="h-4 w-4" aria-hidden />
          Download PDF
        </Button>
      )}
    </div>
  )
}
