import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Image, File } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionAttachment } from '@/types/session'

export interface AttachmentsGalleryProps {
  attachments: SessionAttachment[]
  onDownload?: (attachment: SessionAttachment) => void
  getDownloadUrl?: (attachment: SessionAttachment) => Promise<string> | string
  className?: string
}

function iconForType(type: SessionAttachment['type']) {
  switch (type) {
    case 'pdf':
      return <File className="h-8 w-8 text-muted-foreground" />
    case 'image':
      return <Image className="h-8 w-8 text-muted-foreground" />
    default:
      return <FileText className="h-8 w-8 text-muted-foreground" />
  }
}

/** List of session attachments with preview and download. Pre-signed URL can be fetched via getDownloadUrl. */
export function AttachmentsGallery({
  attachments,
  onDownload,
  getDownloadUrl,
  className,
}: AttachmentsGalleryProps) {
  const list = Array.isArray(attachments) ? attachments : []

  const handleDownload = async (att: SessionAttachment) => {
    if (onDownload) {
      onDownload(att)
      return
    }
    if (getDownloadUrl) {
      const url = await getDownloadUrl(att)
      const a = document.createElement('a')
      a.href = typeof url === 'string' ? url : (url as string)
      a.download = att.filename ?? att.s3Key.split('/').pop() ?? 'download'
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.click()
    }
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
        <CardDescription>Files and assets for this session</CardDescription>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attachments.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {iconForType(att.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {att.filename ?? att.s3Key.split('/').pop() ?? 'Attachment'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {att.type}
                    {att.size != null && ` · ${(att.size / 1024).toFixed(1)} KB`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownload(att)}
                  aria-label={`Download ${att.filename ?? 'attachment'}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
