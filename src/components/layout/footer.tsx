import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const footerLinks = {
  Product: [
    { to: '/templates', label: 'Templates' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/dashboard', label: 'Dashboard' },
  ],
  Legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
  Support: [
    { to: '/help', label: 'Help & FAQ' },
    { to: '/about', label: 'About' },
  ],
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'border-t border-border bg-muted/30 py-12',
        className
      )}
    >
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-foreground">ConverseForms</p>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-first conversational forms and lead capture.
            </p>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-foreground">{heading}</p>
              <ul className="mt-3 space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ConverseForms. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
