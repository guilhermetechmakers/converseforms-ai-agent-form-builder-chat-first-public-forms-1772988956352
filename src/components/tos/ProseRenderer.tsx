import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ProseRendererProps {
  /** Plain text (rendered as paragraphs) or ReactNode. No raw HTML from untrusted sources. */
  content: string | ReactNode
  className?: string
}

/**
 * Renders policy content safely: string content as paragraphs (split by double newlines),
 * or ReactNode as-is. Use for trusted content only; do not pass unsanitized HTML.
 */
export function ProseRenderer({ content, className }: ProseRendererProps) {
  if (typeof content !== 'string') {
    return <div className={cn('text-base leading-relaxed text-muted-foreground', className)}>{content}</div>
  }

  const safeContent = content ?? ''
  const paragraphs = safeContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) {
    return null
  }

  return (
    <div className={cn('text-base leading-relaxed text-muted-foreground', className)}>
      {(paragraphs ?? []).map((paragraph, index) => (
        <p key={`p-${index}`} className="mb-3 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
