import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Bot, DollarSign, FileWarning } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAdminDashboardStats, useAdminMetrics } from '@/hooks/useAdmin'
import { AnimatedPage } from '@/components/AnimatedPage'

const statCards = [
  { key: 'totalUsers' as const, label: 'Total Users', icon: Users },
  { key: 'activeAgents' as const, label: 'Active Agents', icon: Bot },
  { key: 'llmUsageCosts' as const, label: 'LLM Usage Costs', icon: DollarSign, format: (v: number) => `$${v.toFixed(2)}` },
  { key: 'pendingInvoices' as const, label: 'Pending Invoices', icon: FileWarning },
]

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats()
  const { data: metrics = [] } = useAdminMetrics()

  const safeStats = stats ?? {
    totalUsers: 0,
    activeAgents: 0,
    llmUsageCosts: 0,
    pendingInvoices: 0,
  }

  const chartData = Array.isArray(metrics)
    ? metrics.slice(0, 12).map((m) => ({ name: m.name, value: m.value, timestamp: m.timestamp }))
    : []

  return (
    <AnimatedPage className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Platform metrics and quick stats.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, format }) => (
          <Card key={key} className="animate-fade-in-up transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {format ? format(safeStats[key]) : safeStats[key]}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Billing & usage trends</CardTitle>
          <p className="text-sm text-muted-foreground">Recent activity</p>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
              No trend data yet
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid rgb(var(--border))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(var(--primary))"
                    fill="rgb(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
