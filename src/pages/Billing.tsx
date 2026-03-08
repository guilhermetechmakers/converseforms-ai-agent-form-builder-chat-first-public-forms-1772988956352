import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { CreditCard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  { name: 'Free', price: '$0', description: 'Up to 100 sessions/month', features: ['1 agent', 'Basic support'], current: true },
  { name: 'Pro', price: '$29', description: 'Up to 5,000 sessions/month', features: ['10 agents', 'Webhooks', 'Priority support'], current: false },
  { name: 'Team', price: '$99', description: 'Unlimited sessions', features: ['Unlimited agents', 'SSO', 'Dedicated support'], current: false },
]

export default function Billing() {
  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
          </div>
          <div className="p-8">
            <div className="mb-8 flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Current plan: Free</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    plan.current && 'ring-2 ring-primary'
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.current && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Current
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <Button variant={plan.name === 'Pro' ? 'default' : 'outline'} className="w-full">
                        Select
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
