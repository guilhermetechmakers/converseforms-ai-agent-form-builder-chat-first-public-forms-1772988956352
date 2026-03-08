import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SessionMetadata } from '@/types/session'

export interface SessionMetadataPanelProps {
  /** Session metadata (ip, ua, referrer, utm, device, geo, collectionTimestamps). PII should be masked server-side. */
  metadata?: SessionMetadata | null
  /** Optional respondent metadata (masked) */
  respondentMetadata?: Record<string, unknown> | null
  className?: string
}

function MetaRow({ label, value }: { label: string; value: string | undefined }) {
  if (value == null || value === '') return null
  return (
    <div className="flex flex-wrap gap-2 py-1.5 text-sm">
      <span className="font-medium text-muted-foreground shrink-0">{label}</span>
      <span className="break-all text-foreground">{value}</span>
    </div>
  )
}

/** Displays session/respondent metadata: IP, user-agent, referrer, UTM, device, browser, collection timestamps. */
export function SessionMetadataPanel({
  metadata,
  respondentMetadata,
  className,
}: SessionMetadataPanelProps) {
  const meta = metadata ?? {}
  const resp = respondentMetadata ?? {}
  const hasMeta = Object.keys(meta).length > 0 || Object.keys(resp).length > 0

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">Session metadata</CardTitle>
        <CardDescription>Device, referrer, and collection info</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {!hasMeta ? (
          <p className="text-sm text-muted-foreground py-2">No metadata collected for this session.</p>
        ) : (
          <div className="divide-y divide-border">
            <MetaRow label="IP" value={meta.ip ?? (resp.ip as string)} />
            <MetaRow label="User agent" value={meta.userAgent} />
            <MetaRow label="Referrer" value={meta.referrer} />
            {(meta.utmSource ?? meta.utmMedium ?? meta.utmCampaign) && (
              <div className="py-1.5 text-sm">
                <span className="font-medium text-muted-foreground">UTM</span>
                <span className="ml-2 text-foreground">
                  {[meta.utmSource, meta.utmMedium, meta.utmCampaign].filter(Boolean).join(' · ') || '—'}
                </span>
              </div>
            )}
            <MetaRow label="Device" value={meta.device ?? (resp.device as string)} />
            <MetaRow label="OS" value={meta.os} />
            <MetaRow label="Browser" value={meta.browser} />
            <MetaRow label="Geo" value={meta.geo ?? (resp.location as string)} />
            <MetaRow label="Consent" value={meta.consentStatus ?? (resp.consentStatus as string)} />
            {meta.collectionTimestamps && Object.keys(meta.collectionTimestamps).length > 0 && (
              <div className="py-1.5 text-sm">
                <span className="font-medium text-muted-foreground block mb-1">Collection timestamps</span>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  {Object.entries(meta.collectionTimestamps).map(([k, v]) => (
                    <li key={k}>
                      <span className="text-foreground">{k}</span>: {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
