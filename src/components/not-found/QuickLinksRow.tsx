import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { QUICK_LINKS } from './types'

interface QuickLinksRowProps {
  className?: string
}

const links = Array.isArray(QUICK_LINKS) ? QUICK_LINKS : []

/**
 * Horizontal row of quick links (Home, Help, Contact Support) for the 404 page.
 * Renders from static list; array access guarded for runtime safety.
 */
export function QuickLinksRow({ className }: QuickLinksRowProps) {
  if (links.length === 0) return null

  return (
    <nav
      className={cn('flex flex-wrap items-center justify-center gap-4', className)}
      aria-label="Quick navigation"
    >
      {(links ?? []).map((item) => (
        <Link
          key={item?.id ?? item?.href}
          to={item?.href ?? '/'}
          className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md"
        >
          {item?.label ?? 'Link'}
        </Link>
      ))}
    </nav>
  )
}
