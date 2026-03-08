import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { SparklineChart, KPICard } from '@/components/analytics'
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  ShieldOff,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAgent } from '@/hooks/useAgents'
import { useAgentAnalyticsSummary, useAnalyticsMetrics } from '@/hooks/useAnalytics'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export default function AgentPublish() {
  const { id } = useParams<{ id: string }>()
  const { data: agent, isLoading: agentLoading } = useAgent(id ?? '')
  const { data: summary, isLoading: summaryLoading } = useAgentAnalyticsSummary(id ?? undefined)
  const { data: metricsSeries = [] } = useAnalyticsMetrics(
    id ? { agentId: id, interval: 'day' } : undefined
  )

  const publicSlug = agent?.publicSlug ?? id ?? 'demo'
  const publicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/chat/${publicSlug}`
      : ''

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && publicUrl) {
      navigator.clipboard.writeText(publicUrl)
      toast.success('Link copied to clipboard')
    }
  }

  const handleRegenerateUrl = () => {
    toast.info('Regenerate URL is available when the backend supports it.')
  }

  const handleRevokeAccess = () => {
    toast.info('Revoke access is available when the backend supports it.')
  }

  const chartData = useMemo(() => {
    const list = Array.isArray(metricsSeries) ? metricsSeries : []
    return list.slice(-14).map((p) => ({
      name: p.timestamp ? new Date(p.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
      value: p.value ?? 0,
      timestamp: p.timestamp,
    }))
  }, [metricsSeries])

  const publishStatus = agent?.status ?? 'draft'
  const statusLabel =
    publishStatus === 'published'
      ? 'Published'
      : publishStatus === 'archived'
        ? 'Unpublished'
        : publishStatus === 'draft'
          ? 'Draft'
          : 'Suspended'

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/agents/${id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {agentLoading ? (
                      <Skeleton className="h-8 w-48" />
                    ) : (
                      agent?.name ?? 'Publish agent'
                    )}
                  </h1>
                  <Badge
                    variant={
                      publishStatus === 'published'
                        ? 'default'
                        : publishStatus === 'draft'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="capitalize"
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-0.5">
                  Share your public chat link and view usage metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 max-w-4xl space-y-8">
            {/* Public URL & quick actions */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Public link</CardTitle>
                <CardDescription>
                  Anyone with this link can start a conversation with your agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={publicUrl}
                    className="font-mono text-sm bg-muted/50"
                  />
                  <Button variant="outline" size="icon" onClick={copyLink} title="Copy URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link
                      to={`/chat/${publicSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open chat
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" title="Show QR code">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateUrl}
                    title="Regenerate URL"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeAccess}
                    title="Revoke access"
                    className="text-destructive hover:text-destructive"
                  >
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Revoke access
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Embed options */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Embed options</CardTitle>
                <CardDescription>
                  Use this iframe to embed the chat on your site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg border border-border bg-muted/30 p-4 text-xs overflow-x-auto">
                  {`<iframe src="${publicUrl}" width="400" height="600" frameborder="0"></iframe>`}
                </pre>
              </CardContent>
            </Card>

            {/* Usage metrics */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Sessions and completion stats for this agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {summaryLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <KPICard
                        title="Sessions"
                        value={summary?.sessions ?? 0}
                        subtitle="Total"
                        icon={MessageSquare}
                      />
                      <KPICard
                        title="Completion rate"
                        value={
                          summary?.completionRate != null
                            ? `${Math.round(summary.completionRate * 100)}%`
                            : '—'
                        }
                        subtitle="Completed / started"
                        icon={TrendingUp}
                      />
                      <KPICard
                        title="Avg. duration"
                        value={formatDuration(summary?.avgDurationSeconds ?? null)}
                        subtitle="Per session"
                        icon={Clock}
                      />
                      <KPICard
                        title="Validation fail rate"
                        value={
                          summary?.validationsFailRate != null
                            ? `${Math.round(summary.validationsFailRate * 100)}%`
                            : '—'
                        }
                        subtitle="Failed validations"
                        icon={AlertCircle}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Sessions over time
                      </p>
                      <SparklineChart
                        data={chartData}
                        height={120}
                        showTooltip
                        className={cn(chartData.length === 0 && 'border border-dashed border-border rounded-lg')}
                      />
                    </div>
                  </>
                )}
                {!summaryLoading && (summary?.sessions ?? 0) === 0 && chartData.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sessions yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
