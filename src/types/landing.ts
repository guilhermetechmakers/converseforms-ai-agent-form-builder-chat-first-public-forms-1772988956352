/**
 * Landing page data models (frontend-facing shapes).
 * All array/optional fields must be guarded at runtime.
 */

export interface FeatureCard {
  id: string
  title: string
  description: string
  iconName: string
  cta?: { label: string; href: string }
}

export interface Testimonial {
  id: string
  author: string
  company?: string
  quote: string
  logoUrl?: string
}

export interface PricingTier {
  id: string
  name: string
  price: string
  features: string[]
  ctaLabel?: string
  highlight?: boolean
}

export interface NavLink {
  label: string
  href: string
  active?: boolean
}

export interface LandingDemoUrl {
  url: string
}

export interface LandingFeaturesResponse {
  data?: FeatureCard[] | null
}

export interface LandingTestimonialsResponse {
  data?: Testimonial[] | null
}

export interface LandingPricingResponse {
  data?: PricingTier[] | null
}

export interface LandingDemoUrlResponse {
  data?: LandingDemoUrl | null
}
