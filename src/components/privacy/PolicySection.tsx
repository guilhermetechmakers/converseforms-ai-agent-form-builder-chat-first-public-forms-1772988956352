import { cn } from '@/lib/utils'
export interface PolicySectionProps {
  id: string
  title: string
  content: string
  subpoints?: string[]
  className?: string
}

/**
 * Renders a single policy section with optional subpoints.
 * Null/undefined guard: subpoints default to [] for safe mapping.
 */
export function PolicySection({
  id,
  title,
  content,
  subpoints,
  className,
}: PolicySectionProps) {
  const points = Array.isArray(subpoints) ? subpoints : []
  const safeContent = content ?? ''

  return (
    <section
      id={id}
      className={cn('scroll-mt-24', className)}
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="text-foreground text-xl font-semibold tracking-tight md:text-2xl"
      >
        {title ?? ''}
      </h2>
      <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
        {safeContent}
      </p>
      {points.length > 0 && (
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
          {(points ?? []).map((item, index) => (
            <li key={`${id}-point-${index}`}>{item ?? ''}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
