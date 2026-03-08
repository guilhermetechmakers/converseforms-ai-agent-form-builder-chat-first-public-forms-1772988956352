import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { KPICard } from '@/components/analytics'
import {
  Bot,
  MessageSquare,
  TrendingUp,
  Plus,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  CreditCard,
  Receipt,
  FileText,
  BarChart2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardSummary, useRecentSessions, useDashboardAlerts } from '@/hooks/useDashboard'
import { useAnalyticsMetrics, useTopValidationFailures } from '@/hooks/useAnalytics'
import { useOnboardingStatus } from '@/hooks/useOnboarding'
import { OnboardingStepper } from '@/components/onboarding'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: recentData, isLoading: recentLoading } = useRecentSessions({ limit: 10 })
  const { data: alertsData } = useDashboardAlerts()
  const { data: metricsSeries = [] } = useAnalyticsMetrics({ interval: 'day' })
  const { data: topFailures = [] } = useTopValidationFailures({ topN: 5 })
  const { data: onboarding } = useOnboardingStatus()
  const [onboardingDismissed, setOnboardingDismissed] = useState(false)
  const stepsCompleted = Array.isArray(onboarding?.stepsCompleted) ? onboarding.stepsCompleted : []
  const showOnboarding = !onboardingDismissed && stepsCompleted.length < 5

  const sessions = Array.isArray(recentData?.sessions) ? recentData.sessions : []
  const alerts = Array.isArray(alertsData?.alerts) ? alertsData.alerts : []

  const chartData = useMemo(() => {
    const list = Array.isArray(metricsSeries) ? metricsSeries : []
    if (list.length === 0) return []
    return list.slice(-14).map((p) => ({
      name: p.timestamp ? new Date(p.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
      sessions: p.value ?? 0,
    }))
  }, [metricsSeries])

  const safeSummary = summary ?? {
    totalAgents: 0,
    publishedAgents: 0,
    totalSessions: 0,
    sessionsThisMonth: 0,
    leadsCount: 0,
    completionRate: null as number | null,
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
                <p className="text-muted-foreground">Monitor your agents and sessions.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/templates">
                    <FileText className="mr-2 h-4 w-4" />
                    Templates
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/sessions">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View analytics
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/billing/history">
                    <Receipt className="mr-2 h-4 w-4" />
                    Invoices
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard/agents/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create agent
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8 max-w-[1200px] space-y-8">
            {/* Onboarding checklist */}
            {showOnboarding && (
              <OnboardingStepper
                onDismiss={() => setOnboardingDismissed(true)}
              />
            )}

            {/* Alerts */}
            {alerts.length > 0 && (
              <Card className="border-warning/50 bg-warning/5 animate-fade-in-up">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    System alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(alerts ?? []).slice(0, 3).map((a) => (
                      <li key={a.id} className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{a.title}</span>
                        {a.message && ` — ${a.message}`}
                        {a.actionUrl && (
                          <Link
                            to={a.actionUrl}
                            className="ml-2 text-accent hover:underline"
                          >
                            {a.actionLabel ?? 'View'}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* KPI row */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Metrics</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))
                ) : (
                  <>
                    <KPICard
                      title="Agents"
                      value={safeSummary.totalAgents}
                      subtitle={`${safeSummary.publishedAgents} published`}
                      icon={Bot}
                    />
                    <KPICard
                      title="Sessions"
                      value={safeSummary.sessionsThisMonth}
                      subtitle="This month"
                      icon={MessageSquare}
                    />
                    <KPICard
                      title="Leads"
                      value={safeSummary.leadsCount}
                      subtitle="Form submissions"
                      icon={TrendingUp}
                    />
                    <KPICard
                      title="Completion rate"
                      value={
                        safeSummary.completionRate != null
                          ? `${Math.round(safeSummary.completionRate * 100)}%`
                          : '—'
                      }
                      subtitle="Last 30 days"
                      icon={TrendingUp}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Sessions over time */}
              <Card className="lg:col-span-2 animate-fade-in-up">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sessions over time</CardTitle>
                    <CardDescription>Last 14 days</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/sessions">
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {chartData.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                      No session data yet
                    </div>
                  ) : (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="name" className="text-muted-foreground text-xs" />
                          <YAxis className="text-muted-foreground text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgb(var(--card))',
                              border: '1px solid rgb(var(--border))',
                              borderRadius: 'var(--radius)',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sessions"
                            stroke="rgb(var(--accent))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            name="Sessions"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top failing validations */}
              <Card className="animate-fade-in-up">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Top failing validations
                    </CardTitle>
                    <CardDescription>By count</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {(topFailures ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No validation failures recorded.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {(topFailures ?? []).slice(0, 5).map((f) => (
                        <li
                          key={f.id}
                          className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                        >
                          <span className="font-medium text-foreground truncate max-w-[140px]">
                            {f.fieldName}
                          </span>
                          <span className="text-muted-foreground">{f.count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent sessions */}
            <Card className="animate-fade-in-up">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent sessions</CardTitle>
                  <CardDescription>Latest activity</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/billing">
                      <CreditCard className="mr-1 h-4 w-4" />
                      Billing
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/sessions">View all</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No recent sessions. Share your agent link to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sessions.slice(0, 8).map((s) => (
                      <Link
                        key={s.id}
                        to={`/dashboard/sessions/${s.id}`}
                        className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {s.agentName ?? 'Agent'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.startedAt
                              ? formatDistanceToNow(new Date(s.startedAt), { addSuffix: true })
                              : '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded-full',
                              s.status === 'completed'
                                ? 'bg-success/10 text-success'
                                : s.status === 'active'
                                  ? 'bg-accent/10 text-accent'
                                  : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {s.status}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
