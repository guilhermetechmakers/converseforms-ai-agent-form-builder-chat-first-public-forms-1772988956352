import { type ReactNode } from 'react'
import { Topbar } from './Topbar'
import { LandingFooter } from './LandingFooter'
import type { NavLink } from '@/types/landing'
import { cn } from '@/lib/utils'

interface LandingLayoutProps {
  children: ReactNode
  navLinks: NavLink[]
  className?: string
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Product', href: '/', active: true },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
]

export function LandingLayout({
  children,
  navLinks = DEFAULT_NAV_LINKS,
  className,
}: LandingLayoutProps) {
  const links = Array.isArray(navLinks) ? navLinks : DEFAULT_NAV_LINKS

  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <Topbar
        navLinks={links}
        cta={{ label: 'Join / Create Agent', href: '/signup' }}
        loginHref="/login"
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  )
}
