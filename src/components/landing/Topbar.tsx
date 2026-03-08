import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { NavLink as NavLinkType } from '@/types/landing'
import { cn } from '@/lib/utils'

export interface TopbarProps {
  logo?: React.ReactNode
  navLinks: NavLinkType[]
  cta: { label: string; href: string }
  loginHref?: string
  className?: string
}

const defaultLogo = (
  <span className="text-xl font-bold text-foreground">ConverseForms</span>
)

export function Topbar({
  logo = defaultLogo,
  navLinks,
  cta,
  loginHref = '/login',
  className,
}: TopbarProps) {
  const location = useLocation()
  const links = Array.isArray(navLinks) ? navLinks : []

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center border-b border-border bg-background/95 backdrop-blur',
        className
      )}
      role="banner"
    >
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
          {logo}
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href + link.label}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  isActive || link.active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to={loginHref}>Log in</Link>
          </Button>
          <Button asChild>
            <Link to={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
