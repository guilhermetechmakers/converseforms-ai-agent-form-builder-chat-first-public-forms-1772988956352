import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Download, Trash2 } from 'lucide-react'

export type RequestType = 'export' | 'deletion'

export interface RequestSectionProps {
  requestTypes?: RequestType[]
  /** When true, show the CTA buttons (e.g. for account owners). Default true for public visibility. */
  showActions?: boolean
  onExportRequest?: () => void
  onDeletionRequest?: () => void
  isExportLoading?: boolean
  isDeletionLoading?: boolean
  className?: string
}

const DEFAULT_REQUEST_TYPES: RequestType[] = ['export', 'deletion']

/**
 * Renders data export and deletion request actions.
 * Runtime safety: requestTypes default to ['export','deletion'] if null/undefined.
 */
export function RequestSection({
  requestTypes,
  showActions = true,
  onExportRequest,
  onDeletionRequest,
  isExportLoading = false,
  isDeletionLoading = false,
  className,
}: RequestSectionProps) {
  const types = Array.isArray(requestTypes) ? requestTypes : DEFAULT_REQUEST_TYPES
  const showExport = types.includes('export')
  const showDeletion = types.includes('deletion')

  return (
    <Card className={cn('rounded-[12px] border border-border bg-card shadow-card', className)}>
      <CardHeader>
        <h2 className="text-foreground text-xl font-semibold tracking-tight md:text-2xl">
          Your data requests
        </h2>
        <p className="text-muted-foreground mt-1 text-base font-normal">
          Request a copy of your data or request account and data deletion.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {showExport && showActions && (
          <Button
            type="button"
            variant="default"
            size="default"
            className="rounded-full px-5 py-2.5 text-sm font-semibold md:text-base"
            onClick={onExportRequest}
            disabled={isExportLoading}
            data-testid="privacy-export-button"
            aria-label="Request data export"
          >
            {isExportLoading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Request Data Export
          </Button>
        )}
        {showDeletion && showActions && (
          <Button
            type="button"
            variant="outline"
            size="default"
            className="rounded-full border-destructive/50 px-5 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 md:text-base"
            onClick={onDeletionRequest}
            disabled={isDeletionLoading}
            data-testid="privacy-deletion-button"
            aria-label="Request data deletion"
          >
            {isDeletionLoading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Request Data Deletion
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
