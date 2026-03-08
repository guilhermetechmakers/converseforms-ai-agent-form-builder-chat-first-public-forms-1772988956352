/**
 * Context attachments panel for Agent Builder.
 * Upload docs/FAQs, show status, clear context. Runtime-safe array handling.
 */

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileText, Upload, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContextAttachmentType } from '@/types/context'
import { useUploadContext, useClearContext } from '@/hooks/useContext'

const ACCEPT = '.pdf,.doc,.docx,.html,.htm,.txt'
const MAX_SIZE_MB = 10
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024

export interface AttachmentItem {
  id: string
  title: string
  type: ContextAttachmentType
  status: 'indexing' | 'ready' | 'error'
  createdAt: string
}

export interface AttachmentsPanelProps {
  agentId: string | undefined
  /** Optional list of attachments (from agent or local state) */
  attachments?: AttachmentItem[]
  /** Called when attachment list changes (e.g. after upload); optional for read-only display */
  onAttachmentsChange?: (attachments: AttachmentItem[]) => void
  disabled?: boolean
  className?: string
}

export function AttachmentsPanel({
  agentId,
  attachments = [],
  disabled = false,
  className,
}: AttachmentsPanelProps) {
  const [dragActive, setDragActive] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const list = Array.isArray(attachments) ? attachments : []
  const uploadMutation = useUploadContext(agentId)
  const clearMutation = useClearContext(agentId)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!agentId || !files || files.length === 0) return
      const fileArray = Array.from(files)
      const valid = fileArray.filter((f) => f.size <= MAX_BYTES)
      if (valid.length === 0) {
        return
      }
      uploadMutation.mutate(
        {
          files: valid,
          metadata: {
            docTitle: docTitle.trim() || undefined,
            language: language.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            setDocTitle('')
            setLanguage('')
          },
        }
      )
    },
    [agentId, docTitle, language, uploadMutation]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const onDragLeave = () => setDragActive(false)

  const onClearContext = () => {
    if (!agentId) return
    clearMutation.mutate(undefined, {
      onSettled: () => setClearDialogOpen(false),
    })
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Context & knowledge</CardTitle>
        <CardDescription>
          Attach FAQs, documents, or product copy. Content is indexed for retrieval during
          conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={cn(
            'rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors',
            dragActive && 'border-accent bg-accent/5',
            disabled && 'pointer-events-none opacity-60'
          )}
        >
          <input
            type="file"
            id="context-upload"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled || uploadMutation.isPending}
          />
          <label
            htmlFor="context-upload"
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-foreground">
              {uploadMutation.isPending
                ? 'Indexing…'
                : 'Drag files here or click to upload'}
            </span>
            <span className="text-xs text-muted-foreground">
              PDF, DOCX, HTML, TXT up to {MAX_SIZE_MB}MB
            </span>
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label htmlFor="context-docTitle">Document title (optional)</Label>
            <Input
              id="context-docTitle"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. FAQ 2024"
              disabled={disabled}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="context-language">Language (optional)</Label>
            <Input
              id="context-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. en"
              disabled={disabled}
              className="mt-1"
            />
          </div>
        </div>

        {list.length > 0 && (
          <div className="space-y-2">
            <Label>Attached</Label>
            <ul className="space-y-2">
              {list.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm">{a.title || 'Untitled'}</span>
                    <StatusChip status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
            disabled={disabled || clearMutation.isPending}
            className="text-destructive hover:text-destructive"
            aria-label="Clear all context"
          >
            {clearMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Clear all context
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={clearDialogOpen} onOpenChange={(open) => setClearDialogOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all context?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all indexed documents and FAQs for this agent. Retrieval
              during chat will no longer use this knowledge. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearContext}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear context
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function StatusChip({ status }: { status: AttachmentItem['status'] }) {
  const variant =
    status === 'ready' ? 'default' : status === 'error' ? 'destructive' : 'secondary'
  const label = status === 'indexing' ? 'Indexing…' : status === 'ready' ? 'Ready' : 'Error'
  return <Badge variant={variant}>{label}</Badge>
}
