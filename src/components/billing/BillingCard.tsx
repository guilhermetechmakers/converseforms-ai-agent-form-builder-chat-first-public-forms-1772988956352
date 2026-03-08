import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BillingCardProps {
  title: string
  description?: string
  meta?: string
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
  children?: React.ReactNode
  className?: string
}

export function BillingCard({
  title,
  description,
  meta,
  primaryAction,
  secondaryAction,
  children,
  className,
}: BillingCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
          {meta && (
            <p className="text-xs text-muted-foreground mt-1">{meta}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {secondaryAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={secondaryAction.onClick}
              aria-label={secondaryAction.label}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              size="sm"
              onClick={primaryAction.onClick}
              aria-label={primaryAction.label}
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </CardHeader>
      {children && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  )
}
