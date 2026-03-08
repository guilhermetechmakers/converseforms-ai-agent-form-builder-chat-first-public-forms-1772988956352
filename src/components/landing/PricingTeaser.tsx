import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { PricingTier } from '@/types/landing'
import { cn } from '@/lib/utils'

interface PricingTeaserProps {
  tiers: PricingTier[]
  className?: string
}

export function PricingTeaser({ tiers, className }: PricingTeaserProps) {
  const list = Array.isArray(tiers) ? tiers : []

  return (
    <section
      className={cn('border-t border-border bg-muted/20 px-6 py-16 md:py-24', className)}
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-container">
        <h2 id="pricing-heading" className="text-center text-2xl font-semibold text-foreground md:text-3xl">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Start free. Scale as you grow.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tier) => {
            const features = Array.isArray(tier?.features) ? tier.features : []
            return (
              <Card
                key={tier?.id ?? tier?.name}
                className={cn(
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
                  tier?.highlight && 'ring-2 ring-accent'
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{tier?.name ?? ''}</h3>
                    {tier?.highlight && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{tier?.price ?? ''}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    variant={tier?.highlight ? 'default' : 'outline'}
                    className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    asChild
                  >
                    <Link to="/signup">{tier?.ctaLabel ?? 'Get started'}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/pricing">View all plans</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
