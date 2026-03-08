/**
 * Billing & Subscription types for ConverseForms.
 * Aligns with GET/POST /api/billing/* contracts. Use safe defaults in UI.
 */

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing'

export interface BillingAddress {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export interface Plan {
  id: string
  stripePlanId?: string
  name: string
  description?: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
}

export interface InvoiceLineItem {
  id: string
  description: string
  amount: number
  quantity: number
  unitPrice?: number
}

export interface Invoice {
  id: string
  stripeInvoiceId?: string
  customerId: string
  subscriptionId?: string
  date: string
  amountDue: number
  amountPaid: number
  currency: string
  status: InvoiceStatus
  pdfUrl?: string
  lineItems?: InvoiceLineItem[]
  number?: string
}

export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId?: string
  planId: string
  plan?: Plan
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  quantity?: number
}

export interface CheckoutSessionResponse {
  url: string
  sessionId: string
}

export interface PromoApplyRequest {
  code: string
  subscriptionId?: string
}

export interface PromoApplyResponse {
  valid: boolean
  discountPercent?: number
  discountAmount?: number
  message?: string
}

export interface InvoicesListResponse {
  data: Invoice[]
  count: number
  page: number
  limit: number
}

export interface PlansListResponse {
  data: Plan[]
}
