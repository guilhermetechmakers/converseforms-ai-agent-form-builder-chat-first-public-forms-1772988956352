import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Product' },
  { to: '/templates', label: 'Templates' },
  { to: '/pricing', label: 'Pricing' },
]

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center border-b border-border bg-background/95 backdrop-blur',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-foreground">
          ConverseForms
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
