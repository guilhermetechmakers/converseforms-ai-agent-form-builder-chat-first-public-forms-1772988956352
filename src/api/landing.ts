/**
 * Landing page API – fetches features, testimonials, pricing, and demo URL.
 * Uses api.get; when backend is unavailable, useLandingData falls back to mock data.
 */
import { api } from '@/lib/api'
import type {
  FeatureCard,
  Testimonial,
  PricingTier,
  LandingFeaturesResponse,
  LandingTestimonialsResponse,
  LandingPricingResponse,
  LandingDemoUrlResponse,
} from '@/types/landing'

export const landingApi = {
  getFeatures: async (): Promise<FeatureCard[]> => {
    const res = await api.get<LandingFeaturesResponse>('/landing/features')
    return Array.isArray(res?.data) ? res.data : []
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    const res = await api.get<LandingTestimonialsResponse>('/landing/testimonials')
    return Array.isArray(res?.data) ? res.data : []
  },

  getPricing: async (): Promise<PricingTier[]> => {
    const res = await api.get<LandingPricingResponse>('/landing/pricing')
    return Array.isArray(res?.data) ? res.data : []
  },

  getDemoUrl: async (): Promise<string> => {
    const res = await api.get<LandingDemoUrlResponse>('/landing/demo-url')
    const url = res?.data?.url
    return typeof url === 'string' ? url : ''
  },
}
