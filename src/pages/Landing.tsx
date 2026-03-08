import { useLandingData } from '@/hooks/useLandingData'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  LandingLayout,
  HeroSection,
  FeatureCard,
  PricingTeaser,
  TestimonialStrip,
  DemoAgentLauncher,
} from '@/components/landing'
import { Skeleton } from '@/components/ui/skeleton'
import type { NavLink } from '@/types/landing'

const NAV_LINKS: NavLink[] = [
  { label: 'Product', href: '/', active: true },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
]

export default function Landing() {
  const { features, testimonials, pricing, demoUrl, isLoading } = useLandingData()
  const featuresList = Array.isArray(features) ? features : []
  const testimonialsList = Array.isArray(testimonials) ? testimonials : []
  const pricingList = Array.isArray(pricing) ? pricing : []

  return (
    <AnimatedPage>
      <LandingLayout navLinks={NAV_LINKS}>
        <HeroSection
          title="Turn forms into conversations"
          subtitle="ConverseForms turns static forms into AI agents that collect leads through natural chat. Deploy in minutes. Higher conversion, better data."
          primaryCta={{ label: 'Try Demo', href: '/demo' }}
          secondaryCta={{ label: 'Sign Up', href: '/signup' }}
        />

        <section className="border-t border-border bg-muted/20 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-container">
            <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
              Why conversational capture
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              Product, marketing, and sales teams use ConverseForms to capture and qualify leads without custom engineering.
            </p>
            {isLoading ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-[10px]" />
                ))}
              </div>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuresList.map((feature) => (
                  <FeatureCard key={feature?.id ?? feature?.title} feature={feature} />
                ))}
              </div>
            )}
          </div>
        </section>

        <PricingTeaser tiers={pricingList} />
        <TestimonialStrip testimonials={testimonialsList} />

        <section className="border-t border-border px-6 py-12">
          <div className="mx-auto max-w-container text-center">
            <DemoAgentLauncher demoUrl={demoUrl ?? '/demo'} />
          </div>
        </section>
      </LandingLayout>
    </AnimatedPage>
  )
}
