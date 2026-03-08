import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface AuthenticationLayoutProps {
  children: ReactNode
  className?: string
  /** Optional title above the card (e.g. "Welcome back") */
  title?: string
  /** Optional description below title */
  description?: string
}

/**
 * Wrapper for login/signup and auth-related pages.
 * Centered card over subdued background, with back link and consistent spacing.
 */
export function AuthenticationLayout({
  children,
  className,
  title,
  description,
}: AuthenticationLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8',
        'animate-fade-in-up',
        className
      )}
      role="main"
    >
      <div className="mx-auto w-full max-w-[420px]">
        {title != null && (
          <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}
        {description != null && (
          <p className="mt-2 text-center text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link
          to="/"
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Back to home
        </Link>
      </p>
    </div>
  )
}
