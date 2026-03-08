import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { AgentStatus } from '@/types/agent'

interface StatusBadgeProps {
  status: AgentStatus
  className?: string
}

/**
 * Pill badge for agent status: draft (neutral), published (success), archived (secondary).
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant =
    status === 'published'
      ? 'success'
      : status === 'archived'
        ? 'secondary'
        : 'outline'

  const label =
    status === 'published'
      ? 'Published'
      : status === 'archived'
        ? 'Archived'
        : 'Draft'

  return (
    <Badge
      variant={variant}
      className={cn('font-medium capitalize', className)}
      aria-label={`Status: ${label}`}
    >
      {label}
    </Badge>
  )
}
