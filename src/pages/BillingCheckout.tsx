import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { CheckoutView } from '@/components/billing'
import { usePlans, useCreateCheckoutSession, useApplyPromo } from '@/hooks/useBilling'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Plan } from '@/types/billing'

export default function BillingCheckout() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [couponValid, setCouponValid] = useState(false)

  const { data: plansData, isLoading: plansLoading } = usePlans()
  const createCheckout = useCreateCheckoutSession()
  const applyPromo = useApplyPromo()

  const plans = Array.isArray(plansData) ? plansData : []

  const selectedPlan: Plan | undefined = selectedPlanId
    ? (plans ?? []).find((p) => p.id === selectedPlanId)
    : undefined

  const summary = selectedPlan
    ? {
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        currency: selectedPlan.currency ?? 'USD',
        interval: selectedPlan.interval === 'yearly' ? 'year' : 'month',
      }
    : undefined

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) return
    setCouponMessage(null)
    applyPromo.mutate(
      { code: couponCode.trim() },
      {
        onSuccess: (res) => {
          if (res?.valid) {
            setCouponMessage(res?.message ?? 'Promo applied.')
            setCouponValid(true)
          } else {
            setCouponMessage(res?.message ?? 'Invalid promo code.')
            setCouponValid(false)
          }
        },
        onError: () => {
          setCouponMessage('Failed to validate promo code.')
          setCouponValid(false)
        },
      }
    )
  }, [couponCode, applyPromo])

  const handleConfirm = useCallback(() => {
    if (!selectedPlanId) return
    const successUrl = `${window.location.origin}/dashboard/billing?checkout=success`
    const cancelUrl = `${window.location.origin}/dashboard/billing/checkout`
    createCheckout.mutate({
      planId: selectedPlanId,
      successUrl,
      cancelUrl,
      couponCode: couponCode.trim() || undefined,
    })
  }, [selectedPlanId, couponCode, createCheckout])

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-6 md:px-8">
            <div className="max-w-[1200px] mx-auto">
              <Button variant="ghost" size="sm" asChild className="mb-2">
                <Link to="/dashboard/billing">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Choose a plan and complete payment securely with Stripe.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
            {plansLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 rounded-lg bg-muted" />
                <div className="h-32 rounded-lg bg-muted" />
              </div>
            ) : plans.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
                <p className="text-sm">No plans available. Please contact support.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/dashboard/billing">Back to Billing</Link>
                </Button>
              </div>
            ) : (
              <CheckoutView
                plans={plans}
                selectedPlanId={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                couponMessage={couponMessage}
                couponValid={couponValid}
                isLoading={createCheckout.isPending}
                onConfirm={handleConfirm}
                summary={summary}
              />
            )}
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
