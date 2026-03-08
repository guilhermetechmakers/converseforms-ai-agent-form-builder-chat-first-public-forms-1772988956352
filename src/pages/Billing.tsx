import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { UsageMeter } from '@/components/billing'
import { useBillingUsage, useCurrentSubscription, usePlans } from '@/hooks/useBilling'
import { CreditCard, FileText, Receipt, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function Billing() {
  const { data: usageData, isLoading: usageLoading } = useBillingUsage()
  const { data: subscription, isLoading: subLoading } = useCurrentSubscription()
  const { data: plansData } = usePlans()

  const usage = usageData ?? null
  const plans = Array.isArray(plansData) ? plansData : []
  const currentPlanId = subscription?.planId
  const currentPlan = currentPlanId
    ? (plans ?? []).find((p) => p.id === currentPlanId)
    : plans?.[0]

  const safeUsage = usage ?? {
    plan: 'Free',
    quota: 100,
    usage: 0,
    overage: 0,
    periodStart: '',
    periodEnd: '',
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your subscription, invoices, and payment methods.
            </p>
          </div>

          <div className="p-8 max-w-[1200px] space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">
                  {subLoading ? 'Loading…' : `Current plan: ${currentPlan?.name ?? subscription?.planId ?? 'Free'}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/billing/history">
                    <Receipt className="mr-2 h-4 w-4" />
                    Billing history
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/dashboard/billing/checkout">
                    <FileText className="mr-2 h-4 w-4" />
                    {subscription?.id ? 'Change plan' : 'Subscribe'}
                  </Link>
                </Button>
              </div>
            </div>

            {usageLoading ? (
              <Skeleton className="h-24 rounded-lg w-full max-w-md" />
            ) : (
              <Card className="max-w-md animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-base">Usage</CardTitle>
                  <CardDescription>
                    Session usage for the current billing period.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsageMeter
                    label="Sessions"
                    used={safeUsage.usage}
                    quota={safeUsage.quota}
                    unit="sessions"
                    showOverage={true}
                  />
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Plans</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {(plans ?? []).length === 0 ? (
                  <>
                    {[
                      { name: 'Free', price: 0, description: 'Up to 100 sessions/month', features: ['1 agent', 'Basic support'], id: 'free' },
                      { name: 'Pro', price: 2900, description: 'Up to 5,000 sessions/month', features: ['10 agents', 'Webhooks', 'Priority support'], id: 'pro' },
                      { name: 'Team', price: 9900, description: 'Unlimited sessions', features: ['Unlimited agents', 'SSO', 'Dedicated support'], id: 'team' },
                    ].map((plan) => (
                      <Card
                        key={plan.id}
                        className={cn(
                          (currentPlanId === plan.id || (!currentPlanId && plan.id === 'free')) &&
                            'ring-2 ring-primary'
                        )}
                      >
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>{plan.name}</CardTitle>
                          {(currentPlanId === plan.id || (!currentPlanId && plan.id === 'free')) && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                              Current
                            </span>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-2xl font-bold">
                            ${(plan.price / 100).toFixed(0)}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </p>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <ul className="space-y-2">
                            {plan.features.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          {!(currentPlanId === plan.id || (!currentPlanId && plan.id === 'free')) && (
                            <Button variant={plan.id === 'pro' ? 'default' : 'outline'} className="w-full" asChild>
                              <Link to="/dashboard/billing/checkout">Select</Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  (plans ?? []).map((plan) => (
                    <Card
                      key={plan.id}
                      className={cn(
                        currentPlanId === plan.id && 'ring-2 ring-primary'
                      )}
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{plan.name}</CardTitle>
                        {currentPlanId === plan.id && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            Current
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-2xl font-bold">
                          ${(plan.price / 100).toFixed(0)}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.interval === 'yearly' ? 'yr' : 'mo'}
                          </span>
                        </p>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        )}
                        <ul className="space-y-2">
                          {(plan.features ?? []).map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-success" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {currentPlanId !== plan.id && (
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/dashboard/billing/checkout">Select</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
