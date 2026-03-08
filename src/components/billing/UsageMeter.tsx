import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface UsageMeterProps {
  label: string
  used: number
  quota: number
  unit?: string
  className?: string
  showOverage?: boolean
}

export function UsageMeter({
  label,
  used,
  quota,
  unit = '',
  className,
  showOverage = true,
}: UsageMeterProps) {
  const safeQuota = quota > 0 ? quota : 1
  const percent = Math.min(100, Math.round((used / safeQuota) * 100))
  const isOver = used > quota

  return (
    <div className={cn('space-y-2', className)} aria-label={`${label}: ${used} of ${quota} ${unit}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className={cn(
          'tabular-nums text-muted-foreground',
          isOver && showOverage && 'text-warning'
        )}>
          {used.toLocaleString()} / {quota.toLocaleString()} {unit}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
      {isOver && showOverage && (
        <p className="text-xs text-warning">Over quota. Usage may be limited or billed as overage.</p>
      )}
    </div>
  )
}
