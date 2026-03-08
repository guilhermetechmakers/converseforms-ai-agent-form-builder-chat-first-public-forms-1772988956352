import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

export interface SparklinePoint {
  name: string
  value: number
  timestamp?: string
}

interface SparklineChartProps {
  data: SparklinePoint[]
  className?: string
  height?: number
  showTooltip?: boolean
}

export function SparklineChart({
  data,
  className,
  height = 64,
  showTooltip = true,
}: SparklineChartProps) {
  const safeData = Array.isArray(data) ? data : []

  if (safeData.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground text-xs', className)}
        style={{ height }}
      >
        No data
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['auto', 'auto']} />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(var(--card))',
                border: '1px solid rgb(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Sessions']}
              labelFormatter={(label) => label}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--accent))"
            strokeWidth={1.5}
            fill="url(#sparklineGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
