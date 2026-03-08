import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  WebhookList,
  WebhookFormModal,
  DeliveryLogViewer,
  TestDeliveryPanel,
} from '@/components/webhooks'
import { webhooksApi } from '@/api/webhooks'
import type { Webhook, CreateWebhookInput } from '@/types/webhook'
import { toast } from 'sonner'

const WEBHOOKS_QUERY_KEY = ['webhooks'] as const

export default function Webhooks() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [logsWebhook, setLogsWebhook] = useState<Webhook | null>(null)
  const [testWebhook, setTestWebhook] = useState<Webhook | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null)

  const handleAdd = () => {
    setEditingWebhook(null)
    setFormOpen(true)
  }

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook)
    setFormOpen(true)
  }

  const handleSubmit = async (data: CreateWebhookInput) => {
    if (editingWebhook) {
      await webhooksApi.update(editingWebhook.id, data)
      toast.success('Webhook updated')
    } else {
      await webhooksApi.create(data)
      toast.success('Webhook created')
    }
    queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY })
  }

  const handleDeleteClick = (webhook: Webhook) => {
    setDeleteTarget(webhook)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await webhooksApi.delete(deleteTarget.id)
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY })
      toast.success('Webhook deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to delete webhook')
    }
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Webhooks</h1>
                <p className="text-muted-foreground">
                  Send session events to your endpoints. Configure signing, retries, and DLQ.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8 sm:p-8">
            <WebhookList
              onAdd={handleAdd}
              onEdit={handleEdit}
              onViewLogs={setLogsWebhook}
              onTest={setTestWebhook}
              onDelete={handleDeleteClick}
            />

            {logsWebhook && (
              <DeliveryLogViewer webhook={logsWebhook} onClose={() => setLogsWebhook(null)} />
            )}

            {testWebhook && (
              <TestDeliveryPanel webhook={testWebhook} onClose={() => setTestWebhook(null)} />
            )}
          </div>
        </main>
      </div>

      <WebhookFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        webhook={editingWebhook}
        onSubmit={handleSubmit}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent aria-describedby="delete-webhook-description">
          <DialogHeader>
            <DialogTitle>Delete webhook</DialogTitle>
            <DialogDescription id="delete-webhook-description">
              {deleteTarget
                ? `Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
