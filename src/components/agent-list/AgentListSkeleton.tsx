import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface AgentListSkeletonProps {
  count?: number
  className?: string
}

/**
 * Skeleton placeholders for the agent card grid while loading.
 */
export function AgentListSkeleton({
  count = 6,
  className,
}: AgentListSkeletonProps) {
  const items = Array.from({ length: Math.min(count, 12) }, (_, i) => i)
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {items.map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="flex flex-row items-start gap-3 pb-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
