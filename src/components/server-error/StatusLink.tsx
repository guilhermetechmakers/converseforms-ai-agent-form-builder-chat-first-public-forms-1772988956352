import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatusLinkProps {
  href: string
  label: string
  className?: string
  external?: boolean
}

/**
 * Prominent link/button to system status page. Accessible text and focus styles.
 */
export function StatusLink({
  href,
  label,
  className,
  external = false,
}: StatusLinkProps) {
  const safeHref = typeof href === 'string' && href.trim() ? href.trim() : '/status'
  const safeLabel = typeof label === 'string' && label.trim() ? label : 'Check system status'

  if (external) {
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-2 text-base font-semibold text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-1 py-0.5',
          className
        )}
        aria-label={safeLabel}
      >
        {safeLabel}
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
      </a>
    )
  }

  return (
    <Link
      to={safeHref}
      className={cn(
        'inline-flex items-center gap-2 text-base font-semibold text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-1 py-0.5',
        className
      )}
      aria-label={safeLabel}
    >
      {safeLabel}
    </Link>
  )
}
