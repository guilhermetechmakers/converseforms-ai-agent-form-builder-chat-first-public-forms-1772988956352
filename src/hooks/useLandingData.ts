/**
 * Fetches landing data with safe guards. Falls back to mock data when API fails.
 * All arrays default to [] and demoUrl to "" when null/undefined.
 */
import { useQuery } from '@tanstack/react-query'
import { landingApi } from '@/api/landing'
import type { FeatureCard, Testimonial, PricingTier } from '@/types/landing'

const LANDING_KEYS = ['landing'] as const

/** Mock data used when API is unavailable (dev/test). */
const MOCK_FEATURES: FeatureCard[] = [
  { id: '1', title: 'Agent Builder', description: 'Define fields, validations, persona, and appearance. Publish to a public URL in minutes.', iconName: 'Bot', cta: { label: 'Build', href: '/signup' } },
  { id: '2', title: 'Public Links', description: 'Share a single link to your conversational form. No app installs—works in any browser.', iconName: 'Link', cta: { label: 'Publish', href: '/signup' } },
  { id: '3', title: 'Persona', description: 'Set tone and personality so your agent matches your brand and collects better responses.', iconName: 'User', cta: { label: 'Customize', href: '/signup' } },
  { id: '4', title: 'Integrations', description: 'Send submissions to webhooks, CRMs, and your stack. Reliable delivery with retries.', iconName: 'Plug', cta: { label: 'Connect', href: '/signup' } },
]

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', author: 'Alex Chen', company: 'Growth Labs', quote: 'ConverseForms cut our form drop-off by half. The chat flow feels natural and we get richer data.' },
  { id: '2', author: 'Sam Rivera', company: 'B2B SaaS', quote: 'We replaced five static forms with one agent. Setup took an afternoon and our leads are higher quality.' },
]

const MOCK_PRICING: PricingTier[] = [
  { id: 'free', name: 'Free', price: '$0', features: ['1 agent', '100 responses/mo', 'Public link'], ctaLabel: 'Get started', highlight: false },
  { id: 'pro', name: 'Pro', price: '$29/mo', features: ['5 agents', '5K responses/mo', 'Webhooks', 'Priority support'], ctaLabel: 'Start trial', highlight: true },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Unlimited agents', 'SSO', 'SLA', 'Dedicated support'], ctaLabel: 'Contact sales', highlight: false },
]

const DEFAULT_DEMO_URL = '/chat/demo'

function useLandingQuery<T>(key: string, fetcher: () => Promise<T>, fallback: T) {
  return useQuery({
    queryKey: [...LANDING_KEYS, key],
    queryFn: async () => {
      try {
        const result = await fetcher()
        if (Array.isArray(result) && result.length > 0) return result as T
        if (typeof result === 'string' && result.length > 0) return result as T
        return fallback
      } catch {
        return fallback
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useLandingData() {
  const featuresQuery = useLandingQuery('features', landingApi.getFeatures, MOCK_FEATURES)
  const testimonialsQuery = useLandingQuery('testimonials', landingApi.getTestimonials, MOCK_TESTIMONIALS)
  const pricingQuery = useLandingQuery('pricing', landingApi.getPricing, MOCK_PRICING)
  const demoUrlQuery = useLandingQuery('demoUrl', landingApi.getDemoUrl, DEFAULT_DEMO_URL)

  const features = Array.isArray(featuresQuery.data) ? featuresQuery.data : MOCK_FEATURES
  const testimonials = Array.isArray(testimonialsQuery.data) ? testimonialsQuery.data : MOCK_TESTIMONIALS
  const pricing = Array.isArray(pricingQuery.data) ? pricingQuery.data : MOCK_PRICING
  const demoUrl = typeof demoUrlQuery.data === 'string' ? demoUrlQuery.data : DEFAULT_DEMO_URL

  return {
    features,
    testimonials,
    pricing,
    demoUrl,
    isLoading: featuresQuery.isLoading || testimonialsQuery.isLoading || pricingQuery.isLoading || demoUrlQuery.isLoading,
    isError: featuresQuery.isError || testimonialsQuery.isError || pricingQuery.isError || demoUrlQuery.isError,
  }
}
