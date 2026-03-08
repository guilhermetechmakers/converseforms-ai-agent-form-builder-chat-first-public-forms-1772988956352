import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { webhooksApi } from '@/api/webhooks'
import type { Webhook, DeliveryLog } from '@/types/webhook'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const REDACT_PLACEHOLDER = '[redacted]'

function redactPayload(body: string | null | undefined, maxLength = 2000): string {
  const raw = typeof body === 'string' ? body : ''
  if (raw.length <= maxLength) return raw
  return raw.slice(0, maxLength) + '\n… [truncated]'
}

function formatTs(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

function statusVariant(code: number): 'success' | 'warning' | 'destructive' | 'secondary' {
  if (code >= 200 && code < 300) return 'success'
  if (code >= 400) return 'destructive'
  return 'warning'
}

export interface DeliveryLogViewerProps {
  webhook: Webhook | null
  onClose: () => void
}

export function DeliveryLogViewer({ webhook, onClose }: DeliveryLogViewerProps) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [eventFilter, setEventFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const params = useMemo(() => {
    const p: { from?: string; to?: string; statusCode?: number; event?: string } = {}
    if (from) p.from = from
    if (to) p.to = to
    const sc = parseInt(statusFilter, 10)
    if (!Number.isNaN(sc)) p.statusCode = sc
    if (eventFilter) p.event = eventFilter
    return p
  }, [from, to, statusFilter, eventFilter])

  const { data, isLoading, error } = useQuery({
    queryKey: ['webhook-logs', webhook?.id, params],
    queryFn: async () => {
      if (!webhook?.id) return []
      const res = await webhooksApi.getLogs(webhook.id, params)
      return Array.isArray(res) ? res : (res as { data?: DeliveryLog[] })?.data ?? []
    },
    enabled: !!webhook?.id,
  })

  const deliveries: DeliveryLog[] = Array.isArray(data) ? data : []

  if (!webhook) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Delivery logs — {webhook.name}
          </CardTitle>
          <CardDescription>Request/response and status per delivery</CardDescription>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="space-y-2">
            <Label htmlFor="log-from">From (date)</Label>
            <Input
              id="log-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Filter from date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-to">To (date)</Label>
            <Input
              id="log-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Filter to date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-status">Status code</Label>
            <Input
              id="log-status"
              type="text"
              placeholder="e.g. 200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-event">Event</Label>
            <Input
              id="log-event"
              type="text"
              placeholder="e.g. session.completed"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              aria-label="Filter by event"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">Failed to load logs. Please try again.</p>
        )}

        {isLoading && (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!isLoading && !error && deliveries.length === 0 && (
          <p className="text-sm text-muted-foreground">No delivery logs for this webhook yet.</p>
        )}

        {!isLoading && !error && deliveries.length > 0 && (
          <ul className="space-y-2" role="list">
            {deliveries.map((log) => {
              const isExpanded = expandedId === log.id
              return (
                <li
                  key={log.id}
                  className="rounded-lg border border-border bg-card transition-shadow hover:shadow-card"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse log details' : 'Expand log details'}
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatTs(log.timestamp)}
                      </span>
                      <Badge variant={statusVariant(log.statusCode ?? 0)}>
                        {log.statusCode ?? '—'}
                      </Badge>
                      <span className="text-sm">{log.event ?? '—'}</span>
                      {log.retriedCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Retries: {log.retriedCount}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.durationMs != null ? `${log.durationMs}ms` : ''}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-4">
                      {log.errorMessage && (
                        <p className="text-sm text-destructive">{log.errorMessage}</p>
                      )}
                      <div>
                        <Label className="text-xs">Request body (redacted)</Label>
                        <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap break-words">
                          {redactPayload(log.requestBody)}
                        </pre>
                      </div>
                      <div>
                        <Label className="text-xs">Response body</Label>
                        <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap break-words">
                          {redactPayload(log.responseBody)}
                        </pre>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
