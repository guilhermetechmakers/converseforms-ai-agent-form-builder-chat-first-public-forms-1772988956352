import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { webhooksApi } from '@/api/webhooks'
import type { Webhook } from '@/types/webhook'
import {
  Webhook as WebhookIcon,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const QUERY_KEY = ['webhooks'] as const

function getStatusVariant(
  status: Webhook['lastDeliveryStatus']
): 'success' | 'warning' | 'destructive' | 'secondary' {
  if (status === 'success') return 'success'
  if (status === 'failure') return 'destructive'
  if (status === 'pending') return 'warning'
  return 'secondary'
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

export interface WebhookListProps {
  onAdd: () => void
  onEdit: (webhook: Webhook) => void
  onViewLogs: (webhook: Webhook) => void
  onTest: (webhook: Webhook) => void
  onDelete: (webhook: Webhook) => void
}

export function WebhookList({
  onAdd,
  onEdit,
  onViewLogs,
  onTest,
  onDelete,
}: WebhookListProps) {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await webhooksApi.getAll()
      return Array.isArray(res) ? res : (res as { data?: Webhook[] })?.data ?? []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => webhooksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Webhook deleted')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to delete webhook')
    },
  })

  const webhooks: Webhook[] = Array.isArray(data) ? data : []

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load webhooks. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (webhooks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <WebhookIcon className="h-5 w-5" />
          </div>
          <CardTitle>No webhooks</CardTitle>
          <CardDescription>
            Create a webhook to receive session.completed and other events. We&apos;ll sign
            payloads and retry on failure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onAdd} aria-label="Add webhook">
            <Plus className="mr-2 h-4 w-4" />
            Add webhook
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Manage outbound integrations</CardDescription>
        </div>
        <Button onClick={onAdd} aria-label="Add webhook">
          <Plus className="mr-2 h-4 w-4" />
          Add webhook
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list">
          {webhooks.map((webhook) => {
            const events = webhook?.events ?? []
            const eventLabels = Array.isArray(events) ? events.slice(0, 3).join(', ') : '—'
            return (
              <li
                key={webhook.id}
                className={cn(
                  'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200',
                  'hover:-translate-y-0.5 hover:shadow-card'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{webhook.name ?? 'Unnamed'}</span>
                    <Badge variant={getStatusVariant(webhook.lastDeliveryStatus ?? null)}>
                      {webhook.lastDeliveryStatus ?? 'Never sent'}
                    </Badge>
                    {webhook.dlqEnabled && (
                      <Badge variant="warning">DLQ</Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground" title={webhook.url}>
                    {webhook.url}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Events: {eventLabels}{events.length > 3 ? '…' : ''}
                  </p>
                  {webhook.lastDeliveryAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last: {formatDate(webhook.lastDeliveryAt)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTest(webhook)}
                    aria-label={`Test webhook ${webhook.name}`}
                  >
                    <Send className="mr-1 h-4 w-4" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewLogs(webhook)}
                    aria-label={`View logs for ${webhook.name}`}
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    Logs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(webhook)}
                    aria-label={`Edit webhook ${webhook.name}`}
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(webhook)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewLogs(webhook)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View logs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTest(webhook)}>
                        <Send className="mr-2 h-4 w-4" />
                        Test delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(webhook)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
