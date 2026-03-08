/**
 * Billing API – subscriptions, invoices, checkout, usage, promo.
 * All responses must be validated; use data ?? [] and safe defaults in consumers.
 */

import { api } from '@/lib/api'
import type {
  BillingUsageResponse,
} from '@/types/analytics'
import type {
  Invoice,
  Subscription,
  InvoicesListResponse,
  PlansListResponse,
  CheckoutSessionResponse,
  PromoApplyRequest,
  PromoApplyResponse,
} from '@/types/billing'

const BILLING_PREFIX = '/billing'

export const billingApi = {
  /** GET /api/billing/usage */
  getUsage: () => api.get<BillingUsageResponse>(`${BILLING_PREFIX}/usage`),

  /** GET /api/billing/invoices?page=&limit=&status=&from=&to= */
  getInvoices: (params?: { page?: number; limit?: number; status?: string; from?: string; to?: string }) => {
    const q = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    return api.get<InvoicesListResponse>(`${BILLING_PREFIX}/invoices${q ? `?${q}` : ''}`)
  },

  /** GET /api/billing/invoices/:id */
  getInvoice: (id: string) => api.get<Invoice>(`${BILLING_PREFIX}/invoices/${id}`),

  /** GET /api/billing/invoices/:id/download – returns { url: string } */
  getInvoiceDownloadUrl: (id: string) =>
    api.get<{ url: string }>(`${BILLING_PREFIX}/invoices/${id}/download`),

  /** GET /api/billing/subscriptions/:id */
  getSubscription: (id: string) => api.get<Subscription>(`${BILLING_PREFIX}/subscriptions/${id}`),

  /** GET /api/billing/subscriptions – current user's subscription */
  getCurrentSubscription: () => api.get<Subscription | null>(`${BILLING_PREFIX}/subscriptions/current`),

  /** POST /api/billing/subscriptions */
  createSubscription: (body: { planId: string; quantity?: number }) =>
    api.post<Subscription>(`${BILLING_PREFIX}/subscriptions`, body),

  /** POST /api/billing/subscriptions/:id/cancel */
  cancelSubscription: (id: string, body?: { atPeriodEnd?: boolean }) =>
    api.post<Subscription>(`${BILLING_PREFIX}/subscriptions/${id}/cancel`, body ?? {}),

  /** POST /api/billing/usage/report */
  reportUsage: (body: { quantity: number; subscriptionItemId?: string }) =>
    api.post<{ usage: number; nextBillDate?: string }>(`${BILLING_PREFIX}/usage/report`, body),

  /** POST /api/billing/checkout – create Stripe Checkout session */
  createCheckoutSession: (body: { planId: string; successUrl?: string; cancelUrl?: string; couponCode?: string }) =>
    api.post<CheckoutSessionResponse>(`${BILLING_PREFIX}/checkout`, body),

  /** POST /api/billing/payment-method – update default payment method (Stripe billing portal or callback) */
  updatePaymentMethod: (body?: { returnUrl?: string }) =>
    api.post<{ url: string }>(`${BILLING_PREFIX}/payment-method`, body ?? {}),

  /** GET /api/billing/plans */
  getPlans: () => api.get<PlansListResponse>(`${BILLING_PREFIX}/plans`),

  /** POST /api/billing/promo/apply */
  applyPromo: (body: PromoApplyRequest) =>
    api.post<PromoApplyResponse>(`${BILLING_PREFIX}/promo/apply`, body),
}
