import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { webhooksApi } from '@/api/webhooks'
import type { Webhook } from '@/types/webhook'
import { WEBHOOK_EVENTS } from '@/types/webhook'
import { Send, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface TestDeliveryPanelProps {
  webhook: Webhook | null
  onClose: () => void
}

export function TestDeliveryPanel({ webhook, onClose }: TestDeliveryPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<string>(WEBHOOK_EVENTS[0] ?? 'session.completed')

  const testMutation = useMutation({
    mutationFn: async () => {
      if (!webhook?.id) throw new Error('No webhook selected')
      return webhooksApi.test(webhook.id, selectedEvent)
    },
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Test delivery succeeded')
      } else {
        toast.error(result?.errorMessage ?? 'Test delivery failed')
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Test delivery failed')
    },
  })

  const result = testMutation.data
  const isLoading = testMutation.isPending

  if (!webhook) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Test delivery — {webhook.name}
          </CardTitle>
          <CardDescription>
            Send a sample payload to the webhook endpoint. Signing is applied if enabled.
          </CardDescription>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="test-event">Event type</Label>
          <select
            id="test-event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Select test event type"
          >
            {WEBHOOK_EVENTS.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={() => testMutation.mutate()}
          disabled={isLoading}
          aria-label="Send test payload"
        >
          {isLoading ? (
            'Sending…'
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send test payload
            </>
          )}
        </Button>

        {result != null && (
          <div
            className={cn(
              'rounded-lg border p-4',
              result.success
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                : 'border-destructive/50 bg-destructive/5'
            )}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">
                {result.success ? 'Success' : 'Failed'}
              </span>
            </div>
            {result.statusCode != null && (
              <p className="mt-1 text-sm text-muted-foreground">
                Status: {result.statusCode}
                {result.durationMs != null && ` • ${result.durationMs}ms`}
              </p>
            )}
            {result.errorMessage && (
              <p className="mt-1 text-sm text-destructive">{result.errorMessage}</p>
            )}
            {result.responseBody != null && result.responseBody !== '' && (
              <div className="mt-2">
                <Label className="text-xs">Response body</Label>
                <pre className="mt-1 max-h-32 overflow-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap break-words">
                  {result.responseBody}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
