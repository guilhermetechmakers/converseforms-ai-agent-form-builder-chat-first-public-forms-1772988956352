import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ProseRenderer } from './ProseRenderer'

export interface ToSSectionProps {
  sectionId: string
  title: string
  body: string | ReactNode
  subsections?: Array<{ id: string; title: string; body: string | ReactNode }>
  className?: string
}

/**
 * Renders a single ToS section with h2 heading and optional subsections (h3).
 * Null-safe: subsections default to [] for mapping.
 */
export function ToSSection({
  sectionId,
  title,
  body,
  subsections,
  className,
}: ToSSectionProps) {
  const safeSubsections = Array.isArray(subsections) ? subsections : []

  return (
    <section
      id={sectionId}
      className={cn('scroll-mt-24', className)}
      aria-labelledby={`${sectionId}-heading`}
    >
      <h2
        id={`${sectionId}-heading`}
        className="text-foreground text-xl font-semibold tracking-tight md:text-2xl"
      >
        {title ?? ''}
      </h2>
      <div className="mt-3">
        <ProseRenderer content={body} />
      </div>
      {(safeSubsections ?? []).map((sub) => (
        <div key={sub.id} className="mt-6">
          <h3
            id={sub.id}
            className="text-foreground text-lg font-semibold tracking-tight"
          >
            {sub.title ?? ''}
          </h3>
          <div className="mt-2">
            <ProseRenderer content={sub.body} />
          </div>
        </div>
      ))}
    </section>
  )
}
