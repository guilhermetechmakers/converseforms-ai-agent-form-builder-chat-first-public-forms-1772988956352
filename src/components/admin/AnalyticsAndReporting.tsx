import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAdminMetrics } from '@/hooks/useAdmin'
import { useAnalyticsMetrics, useTopValidationFailures } from '@/hooks/useAnalytics'
import { exportToCsv, exportToJson } from '@/lib/export-utils'
import { AnimatedPage } from '@/components/AnimatedPage'

export function AnalyticsAndReporting() {
  const [breakdown, setBreakdown] = useState<string>('org')
  const { data: metrics = [] } = useAdminMetrics({ breakdown: breakdown || undefined })
  const { data: timeSeries = [] } = useAnalyticsMetrics({ interval: 'day' })
  const { data: topFailures = [] } = useTopValidationFailures({ topN: 10 })

  const list = Array.isArray(metrics) ? metrics : []
  const chartData = list.map((m) => ({ name: m.name, value: m.value }))

  const seriesChartData = useMemo(() => {
    const arr = Array.isArray(timeSeries) ? timeSeries : []
    return arr.slice(-14).map((p) => ({
      name: p.timestamp ? new Date(p.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
      value: p.value ?? 0,
    }))
  }, [timeSeries])

  const failuresList = Array.isArray(topFailures) ? topFailures : []

  const handleExportCsv = () => {
    const csv = exportToCsv(
      list.map((m) => ({ name: m.name, value: m.value, timestamp: m.timestamp })),
      [
        { key: 'name', label: 'Metric' },
        { key: 'value', label: 'Value' },
        { key: 'timestamp', label: 'Time' },
      ]
    )
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-metrics-${breakdown}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    const json = exportToJson(list)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-metrics-${breakdown}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatedPage className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics & reporting</h1>
        <p className="text-muted-foreground">Usage metrics, session completion, and billing.</p>
      </div>

      {/* Time-series (platform-wide) */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Sessions over time</CardTitle>
          <CardDescription>Platform-wide, last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          {seriesChartData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
              No time-series data yet
            </div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(var(--accent))"
                    strokeWidth={2}
                    name="Sessions"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Usage metrics by breakdown */}
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <CardTitle>Usage metrics</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={breakdown || 'org'} onValueChange={(v) => setBreakdown(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Breakdown" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="org">By org</SelectItem>
                  <SelectItem value="user">By user</SelectItem>
                  <SelectItem value="feature">By feature</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJson}>
                Export JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                No metrics for this breakdown.
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top validation failures */}
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Top failing validations</CardTitle>
            <CardDescription>By field and count across agents</CardDescription>
          </CardHeader>
          <CardContent>
            {failuresList.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                No validation failures recorded.
              </div>
            ) : (
              <div className="max-h-[320px] overflow-y-auto space-y-2">
                {failuresList.slice(0, 10).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{f.fieldName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.agentName ?? f.agentId} {f.message ? `— ${f.message}` : ''}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 ml-2">{f.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
