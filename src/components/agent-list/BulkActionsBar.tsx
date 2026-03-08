import { Button } from '@/components/ui/button'
import { Upload, Archive, Download, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BulkActionsBarProps {
  selectedIds: string[]
  onPublishBulk: () => void
  onArchiveBulk: () => void
  onExportBulk: () => void
  onClearSelection: () => void
  isPending?: boolean
  className?: string
}

/**
 * Bar shown when agents are selected: bulk Publish, Archive, Export and clear selection.
 */
export function BulkActionsBar({
  selectedIds,
  onPublishBulk,
  onArchiveBulk,
  onExportBulk,
  onClearSelection,
  isPending = false,
  className,
}: BulkActionsBarProps) {
  const count = selectedIds?.length ?? 0
  if (count === 0) return null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3',
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <span className="text-sm font-medium text-foreground">
        {count} {count === 1 ? 'agent' : 'agents'} selected
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPublishBulk}
          disabled={isPending}
          aria-label="Publish selected agents"
        >
          <Upload className="mr-2 h-4 w-4" />
          Publish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onArchiveBulk}
          disabled={isPending}
          aria-label="Archive selected agents"
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportBulk}
          disabled={isPending}
          aria-label="Export selected agents"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isPending}
          aria-label="Clear selection"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
