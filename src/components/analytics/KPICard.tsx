import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: number; label: string }
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: KPICardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {(subtitle ?? trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend ? `${trend.label} ${trend.value >= 0 ? '↑' : '↓'} ${Math.abs(trend.value)}%` : subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
