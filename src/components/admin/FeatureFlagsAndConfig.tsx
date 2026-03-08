import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useAdminFlags, useUpdateAdminFlag } from '@/hooks/useAdmin'
import type { AdminFlag } from '@/types/admin'
import { AnimatedPage } from '@/components/AnimatedPage'

export function FeatureFlagsAndConfig() {
  const { data: flags = [], isLoading } = useAdminFlags()
  const updateFlag = useUpdateAdminFlag()
  const list = Array.isArray(flags) ? flags : []
  const globalFlags = list.filter((f) => !f.orgId)
  const orgFlags = list.filter((f) => f.orgId)

  const handleToggle = (flag: AdminFlag) => {
    updateFlag.mutate({ id: flag.id, updates: { enabled: !flag.enabled } })
  }

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Feature flags & config</h1>
        <p className="text-muted-foreground">Global and per-org overrides.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Global flags</CardTitle>
          <p className="text-sm text-muted-foreground">Default behavior for all organizations.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : globalFlags.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
              No global flags defined.
            </div>
          ) : (
            <ul className="space-y-4">
              {globalFlags.map((flag) => (
                <li
                  key={flag.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{flag.key}</p>
                    {flag.description && (
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    )}
                    {flag.rolloutPercentage != null && (
                      <p className="text-xs text-muted-foreground">
                        Rollout: {flag.rolloutPercentage}%
                      </p>
                    )}
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => handleToggle(flag)}
                    disabled={updateFlag.isPending}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      {orgFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Per-organization overrides</CardTitle>
            <p className="text-sm text-muted-foreground">Inherit from global when not set.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {orgFlags.map((flag) => (
                <li
                  key={flag.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{flag.key}</p>
                    <p className="text-xs text-muted-foreground">Org: {flag.orgId ?? '—'}</p>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => handleToggle(flag)}
                    disabled={updateFlag.isPending}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  )
}
