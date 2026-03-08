import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAdminMetrics } from '@/hooks/useAdmin'
import { exportToCsv, exportToJson } from '@/lib/export-utils'
import { AnimatedPage } from '@/components/AnimatedPage'

export function AnalyticsAndReporting() {
  const [breakdown, setBreakdown] = useState<string>('org')
  const { data: metrics = [] } = useAdminMetrics({ breakdown: breakdown || undefined })
  const list = Array.isArray(metrics) ? metrics : []
  const chartData = list.map((m) => ({ name: m.name, value: m.value }))

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
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics & reporting</h1>
        <p className="text-muted-foreground">Usage metrics, session completion, and billing.</p>
      </div>
      <Card>
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
            <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
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
    </AnimatedPage>
  )
}
