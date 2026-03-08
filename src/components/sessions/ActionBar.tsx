import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  RefreshCw,
  Tag,
  MessageSquarePlus,
  CheckCircle2,
  Loader2,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExportModal, type ExportFormat } from './ExportModal'
import type { WebhookDelivery } from '@/types/session'

export interface ActionBarProps {
  sessionId: string
  /** Current tags to display */
  tags?: string[]
  /** Whether session is marked as reviewed */
  reviewedAt?: string | null
  /** Last webhook delivery attempts for status display */
  webhookDeliveries?: WebhookDelivery[]
  onExport: (format: ExportFormat) => void
  exportLoading?: boolean
  onResendWebhook: () => void
  resendWebhookLoading?: boolean
  onTag: (tags: string[]) => void
  tagLoading?: boolean
  onAnnotate: (annotation: string) => void
  annotateLoading?: boolean
  onMarkReviewed: (reviewed: boolean) => void
  markReviewedLoading?: boolean
  className?: string
}

/** Action bar: Export (CSV/JSON), Resend Webhook, Tag, Annotate, Mark as Reviewed. Shows progress and webhook status. */
export function ActionBar({
  sessionId: _sessionId,
  tags = [],
  reviewedAt,
  webhookDeliveries = [],
  onExport,
  exportLoading = false,
  onResendWebhook,
  resendWebhookLoading = false,
  onTag,
  tagLoading = false,
  onAnnotate,
  annotateLoading = false,
  onMarkReviewed,
  markReviewedLoading = false,
  className,
}: ActionBarProps) {
  const [exportOpen, setExportOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [annotateOpen, setAnnotateOpen] = useState(false)
  const [annotateInput, setAnnotateInput] = useState('')

  const safeTags = Array.isArray(tags) ? tags : []
  const lastDelivery = (webhookDeliveries ?? [])[webhookDeliveries.length - 1]
  const webhookStatus = lastDelivery?.status ?? null

  const handleExportConfirm = (format: ExportFormat) => {
    onExport(format)
    setExportOpen(false)
  }

  const handleTagSubmit = () => {
    const next = tagInput.trim() ? tagInput.trim().split(/\s*,\s*/).filter(Boolean) : []
    if (next.length > 0) {
      onTag([...new Set([...safeTags, ...next])])
      setTagInput('')
      setTagOpen(false)
    }
  }

  const handleAnnotateSubmit = () => {
    const note = annotateInput.trim()
    if (note) {
      onAnnotate(note)
      setAnnotateInput('')
      setAnnotateOpen(false)
    }
  }

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
          <CardDescription>Export, webhook, tag, and annotate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportOpen(true)}
              disabled={exportLoading}
              aria-label="Export session"
            >
              {exportLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-1.5">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResendWebhook}
              disabled={resendWebhookLoading}
              aria-label="Resend to webhook"
            >
              {resendWebhookLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1.5">Resend webhook</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTagOpen(true)}
              disabled={tagLoading}
              aria-label="Add tag"
            >
              <Tag className="h-4 w-4" />
              <span className="ml-1.5">Tag</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnnotateOpen(true)}
              disabled={annotateLoading}
              aria-label="Annotate"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span className="ml-1.5">Annotate</span>
            </Button>
            <Button
              variant={reviewedAt ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMarkReviewed(!reviewedAt)}
              disabled={markReviewedLoading}
              aria-label={reviewedAt ? 'Clear reviewed' : 'Mark as reviewed'}
            >
              {markReviewedLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span className="ml-1.5">{reviewedAt ? 'Reviewed' : 'Mark reviewed'}</span>
            </Button>
          </div>
          {webhookStatus && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Webhook:</span>
              <Badge
                variant={
                  webhookStatus === 'success'
                    ? 'success'
                    : webhookStatus === 'failed' || webhookStatus === 'dlq'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {webhookStatus}
              </Badge>
            </div>
          )}
          {safeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {safeTags.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        onConfirm={handleExportConfirm}
        isLoading={exportLoading}
      />

      <Dialog open={tagOpen} onOpenChange={setTagOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="tag-desc">
          <DialogHeader>
            <DialogTitle>Add tags</DialogTitle>
            <DialogDescription id="tag-desc">
              Enter one or more tags, comma-separated.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="tag-input" className="sr-only">
              Tags
            </Label>
            <Input
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. follow-up, vip"
              onKeyDown={(e) => e.key === 'Enter' && handleTagSubmit()}
              aria-label="Tags"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagSubmit} disabled={!tagInput.trim() || tagLoading}>
              {tagLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={annotateOpen} onOpenChange={setAnnotateOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="annotate-desc">
          <DialogHeader>
            <DialogTitle>Annotate session</DialogTitle>
            <DialogDescription id="annotate-desc">
              Add a note for this session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="annotate-input" className="sr-only">
              Note
            </Label>
            <Input
              id="annotate-input"
              value={annotateInput}
              onChange={(e) => setAnnotateInput(e.target.value)}
              placeholder="Your note…"
              onKeyDown={(e) => e.key === 'Enter' && handleAnnotateSubmit()}
              aria-label="Annotation"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnotateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAnnotateSubmit} disabled={!annotateInput.trim() || annotateLoading}>
              {annotateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
