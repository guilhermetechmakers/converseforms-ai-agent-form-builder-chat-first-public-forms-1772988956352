import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerGroups: { heading: string; links: { to: string; label: string }[] }[] = [
  { heading: 'Product', links: [{ to: '/templates', label: 'Templates' }, { to: '/pricing', label: 'Pricing' }, { to: '/dashboard', label: 'Dashboard' }] },
  { heading: 'Legal', links: [{ to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms of Service' }] },
  { heading: 'Support', links: [{ to: '/help', label: 'Help & FAQ' }, { to: '/about', label: 'About' }, { to: '/help', label: 'Contact' }] },
]

const socialIcons = [
  { label: 'Twitter', href: '#', Icon: Twitter },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'GitHub', href: '#', Icon: Github },
]

export function LandingFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn('border-t border-border bg-muted/30 py-12', className)}
      role="contentinfo"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-foreground">ConverseForms</p>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-first conversational forms and lead capture.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <p className="text-sm font-semibold text-foreground">{group.heading}</p>
              <ul className="mt-3 space-y-2">
                {(group.links ?? []).map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <div className="flex gap-4" aria-label="Social links">
            {socialIcons.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} ConverseForms. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
