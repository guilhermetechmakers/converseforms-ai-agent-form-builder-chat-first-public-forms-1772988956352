/**
 * Payment method form – Stripe Elements integration stub.
 * Replace with Stripe Elements (CardElement) when Stripe client key is configured.
 * Handles focus states, validation messaging, and accessibility.
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PaymentMethodFormProps {
  onSubmit?: (payload: { success: boolean }) => void
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function PaymentMethodForm({
  onSubmit,
  isLoading = false,
  error,
  className,
}: PaymentMethodFormProps) {
  const [localError, setLocalError] = React.useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (onSubmit) {
      onSubmit({ success: true })
    }
  }

  const displayError = error ?? localError

  return (
    <Card className={cn('transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2', className)}>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>
          Add or update your card. Payment details are secured by Stripe and never stored on our servers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stripe Elements placeholder – replace with Stripe CardElement when client key is available */}
          <div className="rounded-lg border border-input bg-muted/30 px-3 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Card details</p>
            <p className="text-xs">
              Stripe Elements will render here. Configure VITE_STRIPE_PUBLISHABLE_KEY and mount the CardElement for PCI-compliant card entry.
            </p>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="4242 4242 4242 4242"
                className="max-w-[200px] font-mono"
                disabled
                aria-label="Card number (placeholder)"
              />
              <Input placeholder="MM/YY" className="max-w-[80px]" disabled aria-label="Expiry (placeholder)" />
              <Input placeholder="CVC" className="max-w-[60px]" disabled aria-label="CVC (placeholder)" />
            </div>
          </div>
          {displayError && (
            <p className="text-sm text-destructive" role="alert">
              {displayError}
            </p>
          )}
          <Button type="submit" disabled={isLoading} className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98]">
            {isLoading ? 'Updating…' : 'Update payment method'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
