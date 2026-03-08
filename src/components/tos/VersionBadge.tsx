import { cn } from '@/lib/utils'

export interface VersionBadgeProps {
  version?: string
  lastUpdated?: string
  className?: string
}

/**
 * Compact badge showing policy version and last updated date.
 * Falls back gracefully when version or lastUpdated are missing.
 */
export function VersionBadge({
  version,
  lastUpdated,
  className,
}: VersionBadgeProps) {
  const versionText = version ?? '—'
  const dateText =
    lastUpdated != null && lastUpdated !== ''
      ? new Date(lastUpdated).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—'

  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground',
        className
      )}
      aria-label={`Version ${versionText}, last updated ${dateText}`}
    >
      <span>Version {versionText}</span>
      <span aria-hidden className="text-border">
        ·
      </span>
      <time dateTime={lastUpdated ?? undefined}>{dateText}</time>
    </div>
  )
}
