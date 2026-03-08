import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface CopyableErrorIdProps {
  errorId: string | undefined
  className?: string
}

/**
 * Small pill with error ID and copy-to-clipboard. If errorId is absent, renders subdued state.
 * Uses aria-live for copy feedback and Sonner toast.
 */
export function CopyableErrorId({ errorId, className }: CopyableErrorIdProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const id = typeof errorId === 'string' ? errorId.trim() : ''
    if (!id) return
    const sanitized = id.slice(0, 128)
    window.navigator?.clipboard?.writeText(sanitized).then(
      () => {
        setCopied(true)
        toast.success('Copied!')
        setTimeout(() => setCopied(false), 2000)
      },
      () => toast.error('Copy failed')
    )
  }, [errorId])

  const hasId = typeof errorId === 'string' && errorId.trim().length > 0

  if (!hasId) {
    return (
      <div
        className={cn(
          'rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground',
          className
        )}
        role="status"
        aria-label="Error reference not available"
      >
        Reference not available
      </div>
    )
  }

  const displayId = (errorId ?? '').trim().slice(0, 64)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground',
        className
      )}
      role="group"
    >
      <span className="font-mono" aria-label={`Error ID: ${displayId}`}>
        {displayId}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Copy error ID ${displayId} to clipboard`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
