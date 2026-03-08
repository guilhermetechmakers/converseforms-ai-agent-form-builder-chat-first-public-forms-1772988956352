import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CopyableErrorId } from './CopyableErrorId'
import { StatusLink } from './StatusLink'
import { RetryButton } from './RetryButton'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

export interface ErrorHeroCardProps {
  errorId?: string
  retryAction?: (() => void) | undefined
  statusUrl?: string
  statusLabel?: string
  className?: string
}

/**
 * Centered card for 500 page: apology, explanation, retry CTA, status link, error ID with copy.
 * All props optional; guards for null/undefined throughout.
 */
export function ErrorHeroCard({
  errorId,
  retryAction,
  statusUrl = '/status',
  statusLabel = 'Check system status',
  className,
}: ErrorHeroCardProps) {
  const safeStatusUrl = typeof statusUrl === 'string' && statusUrl.trim() ? statusUrl.trim() : '/status'
  const safeStatusLabel = typeof statusLabel === 'string' && statusLabel.trim() ? statusLabel : 'Check system status'

  return (
    <Card
      className={cn(
        'w-full max-w-[min(100%,36rem)] rounded-[12px] border-border bg-card shadow-card animate-fade-in-down',
        className
      )}
      role="region"
      aria-labelledby="server-error-heading"
    >
      <CardHeader className="space-y-4 pb-2 text-center">
        <div className="flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            aria-hidden
          >
            <AlertTriangle className="h-7 w-7" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            id="server-error-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-foreground"
          >
            We&apos;re sorry — something went wrong
          </span>
        </div>
        <p className="text-base text-muted-foreground">
          Our server ran into an error. Please try again or check system status below.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <RetryButton onClick={retryAction} disabled={typeof retryAction !== 'function'} />
          <StatusLink href={safeStatusUrl} label={safeStatusLabel} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Error reference</span>
          <CopyableErrorId errorId={errorId} />
        </div>
      </CardContent>
    </Card>
  )
}
