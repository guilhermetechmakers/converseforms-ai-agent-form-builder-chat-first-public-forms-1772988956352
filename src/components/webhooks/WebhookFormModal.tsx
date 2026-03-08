import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { WEBHOOK_EVENTS, type Webhook, type CreateWebhookInput, type RetryPolicy } from '@/types/webhook'
import {
  validateWebhookForm,
  isValidUrl,
  sanitizeHeaders,
  type WebhookFormErrors,
} from '@/lib/webhook-validation'
import { cn } from '@/lib/utils'

const DEFAULT_RETRY: RetryPolicy = {
  maxRetries: 3,
  backoffMs: 1000,
  backoffStrategy: 'exponential',
  initialDelayMs: 500,
}

export interface WebhookFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  webhook: Webhook | null
  onSubmit: (data: CreateWebhookInput) => Promise<void>
}

export function WebhookFormModal({
  open,
  onOpenChange,
  webhook,
  onSubmit,
}: WebhookFormModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [signingEnabled, setSigningEnabled] = useState(false)
  const [signingSecret, setSigningSecret] = useState('')
  const [handshakeVerification, setHandshakeVerification] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [retryPolicy, setRetryPolicy] = useState<RetryPolicy>({ ...DEFAULT_RETRY })
  const [dlqEnabled, setDlqEnabled] = useState(false)
  const [dlqEndpoint, setDlqEndpoint] = useState('')
  const [errors, setErrors] = useState<WebhookFormErrors>({})
  const [saving, setSaving] = useState(false)

  const resetForm = useCallback(() => {
    setName('')
    setUrl('')
    setSigningEnabled(false)
    setSigningSecret('')
    setHandshakeVerification(false)
    setEvents([])
    setHeaders({})
    setRetryPolicy({ ...DEFAULT_RETRY })
    setDlqEnabled(false)
    setDlqEndpoint('')
    setErrors({})
  }, [])

  useEffect(() => {
    if (open) {
      if (webhook) {
        setName(webhook.name ?? '')
        setUrl(webhook.url ?? '')
        setSigningEnabled(webhook.signingEnabled ?? false)
        setSigningSecret('') // Never show existing secret
        setHandshakeVerification(webhook.handshakeVerification ?? false)
        setEvents(Array.isArray(webhook.events) ? [...webhook.events] : [])
        setHeaders(typeof webhook.headers === 'object' && webhook.headers ? { ...webhook.headers } : {})
        setRetryPolicy(webhook.retryPolicy ? { ...DEFAULT_RETRY, ...webhook.retryPolicy } : { ...DEFAULT_RETRY })
        setDlqEnabled(webhook.dlqEnabled ?? false)
        setDlqEndpoint(webhook.dlqEndpoint ?? '')
      } else {
        resetForm()
      }
    }
  }, [open, webhook, resetForm])

  const toggleEvent = (event: string) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  const addHeader = () => {
    setHeaders((prev) => ({ ...prev, `__new_${Date.now()}`: '' }))
  }

  const updateHeaderKey = (oldKey: string, newKey: string) => {
    setHeaders((prev) => {
      const next = { ...prev }
      const val = next[oldKey]
      delete next[oldKey]
      if (newKey.trim()) next[newKey.trim()] = val ?? ''
      return next
    })
  }

  const updateHeaderValue = (key: string, value: string) => {
    setHeaders((prev) => ({ ...prev, [key]: value }))
  }

  const removeHeader = (key: string) => {
    setHeaders((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: name.trim(),
      url: url.trim(),
      signingEnabled,
      signingSecret: signingEnabled ? signingSecret.trim() : undefined,
      handshakeVerification,
      events,
      headers: sanitizeHeaders(headers),
      retryPolicy,
      dlqEnabled,
      dlqEndpoint: dlqEnabled ? dlqEndpoint.trim() || undefined : undefined,
    }
    const nextErrors = validateWebhookForm(payload)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await onSubmit(payload)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setErrors({ url: (err as Error)?.message ?? 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]"
        aria-describedby="webhook-form-description"
      >
        <DialogHeader>
          <DialogTitle>{webhook ? 'Edit webhook' : 'Create webhook'}</DialogTitle>
          <DialogDescription id="webhook-form-description">
            Configure URL, events, signing, and retry behavior.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-name">Name (required)</Label>
            <Input
              id="webhook-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My webhook"
              className={errors.name ? 'border-destructive' : ''}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL (required)</Label>
            <Input
              id="webhook-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/webhooks"
              className={errors.url ? 'border-destructive' : ''}
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? 'url-error' : undefined}
            />
            {errors.url && (
              <p id="url-error" className="text-sm text-destructive">
                {errors.url}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="signing-enabled">Enable signing (HMAC)</Label>
              <p className="text-xs text-muted-foreground">Sign payloads with a secret key</p>
            </div>
            <Switch
              id="signing-enabled"
              checked={signingEnabled}
              onCheckedChange={setSigningEnabled}
              aria-label="Enable signing"
            />
          </div>
          {signingEnabled && (
            <div className="space-y-2">
              <Label htmlFor="signing-secret">Signing secret</Label>
              <Input
                id="signing-secret"
                type="password"
                value={signingSecret}
                onChange={(e) => setSigningSecret(e.target.value)}
                placeholder={webhook?.signingEnabled ? 'Leave blank to keep current' : 'Min 16 characters'}
                className={errors.signingSecret ? 'border-destructive' : ''}
                aria-invalid={!!errors.signingSecret}
              />
              {errors.signingSecret && (
                <p className="text-sm text-destructive">{errors.signingSecret}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="handshake">Handshake verification</Label>
              <p className="text-xs text-muted-foreground">Verify endpoint on first setup</p>
            </div>
            <Switch
              id="handshake"
              checked={handshakeVerification}
              onCheckedChange={setHandshakeVerification}
              aria-label="Handshake verification"
            />
          </div>

          <div className="space-y-2">
            <Label>Events (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {WEBHOOK_EVENTS.map((ev) => (
                <button
                  key={ev}
                  type="button"
                  onClick={() => toggleEvent(ev)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    events.includes(ev)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  )}
                >
                  {ev}
                </button>
              ))}
            </div>
            {errors.events && (
              <p className="text-sm text-destructive">{errors.events}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Custom headers</Label>
              <Button type="button" variant="outline" size="sm" onClick={addHeader}>
                Add header
              </Button>
            </div>
            {Object.entries(headers).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <Input
                  placeholder="Header name"
                  value={k.startsWith('__new_') ? '' : k}
                  onChange={(e) => updateHeaderKey(k, e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={v}
                  onChange={(e) => updateHeaderValue(k, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(k)}
                  aria-label="Remove header"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-lg border border-border p-4">
            <Label>Retry settings</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="max-retries">Max retries</Label>
                <Input
                  id="max-retries"
                  type="number"
                  min={0}
                  max={100}
                  value={retryPolicy.maxRetries}
                  onChange={(e) =>
                    setRetryPolicy((p) => ({ ...p, maxRetries: parseInt(e.target.value, 10) || 0 }))
                  }
                  className={errors.maxRetries ? 'border-destructive' : ''}
                />
                {errors.maxRetries && (
                  <p className="text-xs text-destructive">{errors.maxRetries}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="backoff-ms">Backoff (ms)</Label>
                <Input
                  id="backoff-ms"
                  type="number"
                  min={100}
                  value={retryPolicy.backoffMs}
                  onChange={(e) =>
                    setRetryPolicy((p) => ({ ...p, backoffMs: parseInt(e.target.value, 10) || 1000 }))
                  }
                  className={errors.backoffMs ? 'border-destructive' : ''}
                />
                {errors.backoffMs && (
                  <p className="text-xs text-destructive">{errors.backoffMs}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="backoff-strategy">Strategy</Label>
                <select
                  id="backoff-strategy"
                  value={retryPolicy.backoffStrategy}
                  onChange={(e) =>
                    setRetryPolicy((p) => ({
                      ...p,
                      backoffStrategy: e.target.value as 'fixed' | 'exponential',
                    }))
                  }
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="fixed">Fixed</option>
                  <option value="exponential">Exponential</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="dlq-enabled">Dead letter queue (DLQ)</Label>
              <p className="text-xs text-muted-foreground">Route failed deliveries after retries</p>
            </div>
            <Switch
              id="dlq-enabled"
              checked={dlqEnabled}
              onCheckedChange={setDlqEnabled}
              aria-label="Enable DLQ"
            />
          </div>
          {dlqEnabled && (
            <div className="space-y-2">
              <Label htmlFor="dlq-endpoint">DLQ endpoint URL</Label>
              <Input
                id="dlq-endpoint"
                type="url"
                value={dlqEndpoint}
                onChange={(e) => setDlqEndpoint(e.target.value)}
                placeholder="https://..."
                className={errors.dlqEndpoint ? 'border-destructive' : ''}
              />
              {errors.dlqEndpoint && (
                <p className="text-sm text-destructive">{errors.dlqEndpoint}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : webhook ? 'Save changes' : 'Create webhook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
