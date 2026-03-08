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
  Circle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WebhookDelivery } from '@/types/session'
import type { ExportFormat } from './ExportModal'

export interface SessionViewerActionBarProps {
  /** Session id (for aria/documentation) */
  sessionId?: string
  /** Whether session is marked as reviewed */
  reviewed?: boolean
  /** Last webhook delivery attempts for status */
  webhookDeliveries?: WebhookDelivery[]
  onExport: (format: ExportFormat) => void
  onResendWebhook: () => void
  onTag: (tags: string[]) => void
  onAnnotate: (annotation: string) => void
  onMarkReviewed: (reviewed: boolean) => void
  isExporting?: boolean
  isResendingWebhook?: boolean
  isTagging?: boolean
  isAnnotating?: boolean
  isMarkingReviewed?: boolean
  className?: string
}

export function SessionViewerActionBar({
  sessionId: _sessionId,
  reviewed = false,
  webhookDeliveries = [],
  onExport,
  onResendWebhook,
  onTag,
  onAnnotate,
  onMarkReviewed,
  isExporting = false,
  isResendingWebhook = false,
  isTagging = false,
  isAnnotating = false,
  isMarkingReviewed = false,
  className,
}: SessionViewerActionBarProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [annotateModalOpen, setAnnotateModalOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [annotateInput, setAnnotateInput] = useState('')

  const deliveries = Array.isArray(webhookDeliveries) ? webhookDeliveries : []
  const lastDelivery = deliveries.length > 0 ? deliveries[deliveries.length - 1] : null
  const webhookStatus = lastDelivery?.status ?? null

  const handleExportConfirm = (format: ExportFormat) => {
    onExport(format)
    setExportModalOpen(false)
  }

  const handleTagSubmit = () => {
    const tags = tagInput
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length > 0) {
      onTag(tags)
      setTagInput('')
      setTagModalOpen(false)
    }
  }

  const handleAnnotateSubmit = () => {
    const note = annotateInput.trim()
    if (note) {
      onAnnotate(note)
      setAnnotateInput('')
      setAnnotateModalOpen(false)
    }
  }

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
          <CardDescription>Export, webhook, tag, and review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setExportModalOpen(true)}
            disabled={isExporting}
            aria-label="Export session"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <Download className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-2">Export (CSV/JSON)</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onResendWebhook}
            disabled={isResendingWebhook}
            aria-label="Resend to webhook"
          >
            {isResendingWebhook ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <RefreshCw className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-2">Resend to webhook</span>
            {webhookStatus && (
              <Badge
                variant={webhookStatus === 'success' ? 'success' : webhookStatus === 'failed' ? 'destructive' : 'secondary'}
                className="ml-auto text-xs"
              >
                {webhookStatus}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setTagModalOpen(true)}
            disabled={isTagging}
            aria-label="Add tags"
          >
            {isTagging ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <Tag className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-2">Tag</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setAnnotateModalOpen(true)}
            disabled={isAnnotating}
            aria-label="Annotate"
          >
            {isAnnotating ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <MessageSquarePlus className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-2">Annotate</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onMarkReviewed(!reviewed)}
            disabled={isMarkingReviewed}
            aria-label={reviewed ? 'Clear reviewed' : 'Mark as reviewed'}
          >
            {isMarkingReviewed ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : reviewed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="ml-2">{reviewed ? 'Reviewed' : 'Mark as reviewed'}</span>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="export-desc">
          <DialogHeader>
            <DialogTitle>Export session</DialogTitle>
            <DialogDescription id="export-desc">Choose format and download.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleExportConfirm('csv')}
              disabled={isExporting}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleExportConfirm('json')}
              disabled={isExporting}
            >
              JSON
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={tagModalOpen} onOpenChange={setTagModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add tags</DialogTitle>
            <DialogDescription>Comma- or space-separated tags.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="tag-input" className="sr-only">
              Tags
            </Label>
            <Input
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. follow-up, high-value"
              aria-label="Tags"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagSubmit} disabled={!tagInput.trim() || isTagging}>
              {isTagging ? 'Adding…' : 'Add tags'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={annotateModalOpen} onOpenChange={setAnnotateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Annotate session</DialogTitle>
            <DialogDescription>Add a note for this session.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="annotate-input" className="sr-only">
              Annotation
            </Label>
            <Input
              id="annotate-input"
              value={annotateInput}
              onChange={(e) => setAnnotateInput(e.target.value)}
              placeholder="Your note…"
              aria-label="Annotation"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnotateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAnnotateSubmit} disabled={!annotateInput.trim() || isAnnotating}>
              {isAnnotating ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
