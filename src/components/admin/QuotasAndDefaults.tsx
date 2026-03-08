import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdminQuotas } from '@/hooks/useAdmin'
import { AnimatedPage } from '@/components/AnimatedPage'
import { cn } from '@/lib/utils'

export function QuotasAndDefaults() {
  const { data: quotas = [], isLoading } = useAdminQuotas()
  const list = Array.isArray(quotas) ? quotas : []

  const byOrg = list.reduce<Record<string, typeof list>>((acc, q) => {
    const id = q.orgId ?? 'unknown'
    if (!acc[id]) acc[id] = []
    acc[id].push(q)
    return acc
  }, {})

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Quotas & defaults</h1>
        <p className="text-muted-foreground">Org-wide limits and current usage.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organization quotas</CardTitle>
          <p className="text-sm text-muted-foreground">Per-org limits and usage. Set defaults in organization settings.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : Object.keys(byOrg).length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground">
              <p>No quota data yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(byOrg).map(([orgId, items]) => (
                <div key={orgId} className="rounded-lg border border-border p-4">
                  <p className="mb-3 font-medium text-foreground">Org: {orgId}</p>
                  <ul className="space-y-2">
                    {(items ?? []).map((q) => {
                      const pct = q.limit > 0 ? Math.round((q.currentUsage / q.limit) * 100) : 0
                      const isHigh = pct >= 90
                      const isWarn = pct >= 70 && pct < 90
                      return (
                        <li
                          key={`${q.orgId}-${q.metricName}`}
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <span className="text-muted-foreground">{q.metricName}</span>
                          <span className="font-medium">
                            {q.currentUsage} / {q.limit}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              isHigh && 'bg-destructive/10 text-destructive',
                              isWarn && !isHigh && 'bg-warning/10 text-warning'
                            )}
                          >
                            {pct}%
                          </Badge>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
