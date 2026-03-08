import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types/billing'

export interface CheckoutViewProps {
  plans: Plan[]
  selectedPlanId: string | null
  onSelectPlan: (planId: string) => void
  couponCode: string
  onCouponChange: (value: string) => void
  onApplyCoupon: () => void
  couponMessage?: string | null
  couponValid?: boolean
  isLoading?: boolean
  onConfirm: () => void
  summary?: { planName?: string; amount?: number; currency?: string; interval?: string }
  className?: string
}

export function CheckoutView({
  plans,
  selectedPlanId,
  onSelectPlan,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  couponMessage,
  couponValid,
  isLoading = false,
  onConfirm,
  summary,
  className,
}: CheckoutViewProps) {
  const planList = Array.isArray(plans) ? plans : []

  return (
    <div className={cn('grid gap-8 lg:grid-cols-3', className)}>
      <div className="lg:col-span-2 space-y-6">
        <section aria-label="Choose plan">
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose a plan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {planList.map((plan) => {
              const isSelected = selectedPlanId === plan.id
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                    isSelected && 'ring-2 ring-accent border-accent'
                  )}
                  onClick={() => onSelectPlan(plan.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectPlan(plan.id)
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${plan.name} plan`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      {isSelected && <Check className="h-5 w-5 text-accent" aria-hidden />}
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      ${(plan.price / 100).toFixed(0)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.interval === 'yearly' ? 'yr' : 'mo'}
                      </span>
                    </p>
                    {plan.description && (
                      <CardDescription>{plan.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {(plan.features ?? []).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success shrink-0" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Promo code</CardTitle>
            <CardDescription>Apply a discount code if you have one.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value)}
              className="max-w-[200px]"
              aria-label="Promo code"
              aria-invalid={couponMessage != null && !couponValid}
              aria-describedby={couponMessage ? 'coupon-message' : undefined}
            />
            <Button type="button" variant="secondary" onClick={onApplyCoupon} disabled={!couponCode.trim()}>
              Apply
            </Button>
            {couponMessage && (
              <p id="coupon-message" className={cn('text-sm mt-2 w-full', couponValid ? 'text-success' : 'text-destructive')}>
                {couponMessage}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Review before checkout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary?.planName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{summary.planName}</span>
              </div>
            )}
            {summary?.amount != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {summary.currency ?? 'USD'} {(summary.amount / 100).toFixed(2)} / {summary.interval ?? 'mo'}
                </span>
              </div>
            )}
            <Button
              className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={onConfirm}
              disabled={!selectedPlanId || isLoading}
            >
              {isLoading ? 'Redirecting…' : 'Continue to payment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
