/**
 * Billing React Query hooks. Guard all list data: (data ?? []), Array.isArray checks.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { billingApi } from '@/api/billing'
import type { BillingUsageSummary } from '@/types/analytics'
import type { Invoice, Subscription, Plan, InvoicesListResponse, PromoApplyRequest } from '@/types/billing'

export const billingKeys = {
  all: ['billing'] as const,
  usage: () => [...billingKeys.all, 'usage'] as const,
  invoices: (params?: Record<string, unknown>) => [...billingKeys.all, 'invoices', params ?? {}] as const,
  invoice: (id: string) => [...billingKeys.all, 'invoice', id] as const,
  subscription: (id?: string) => [...billingKeys.all, 'subscription', id ?? 'current'] as const,
  plans: () => [...billingKeys.all, 'plans'] as const,
}

function safeInvoicesResponse(data: unknown): InvoicesListResponse {
  const fallback: InvoicesListResponse = { data: [], count: 0, page: 1, limit: 20 }
  if (!data || typeof data !== 'object') return fallback
  const o = data as { data?: Invoice[]; count?: number; page?: number; limit?: number }
  return {
    data: Array.isArray(o.data) ? o.data : [],
    count: typeof o.count === 'number' ? o.count : 0,
    page: typeof o.page === 'number' ? o.page : 1,
    limit: typeof o.limit === 'number' ? o.limit : 20,
  }
}

function safeSubscription(data: unknown): Subscription | null {
  if (data && typeof data === 'object') return data as Subscription
  return null
}

function safePlans(data: unknown): Plan[] {
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
    return (data as { data: Plan[] }).data
  return []
}

function safeBillingUsage(data: unknown): BillingUsageSummary | null {
  if (data && typeof data === 'object' && 'usage' in data)
    return (data as { usage: BillingUsageSummary }).usage ?? null
  return null
}

export function useBillingUsage() {
  return useQuery({
    queryKey: billingKeys.usage(),
    queryFn: async () => {
      const res = await billingApi.getUsage()
      return safeBillingUsage(res)
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useInvoices(params?: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
  return useQuery({
    queryKey: billingKeys.invoices(params),
    queryFn: async () => {
      const res = await billingApi.getInvoices(params)
      return safeInvoicesResponse(res)
    },
    staleTime: 1000 * 60,
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: billingKeys.invoice(id ?? ''),
    queryFn: () => billingApi.getInvoice(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  })
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: billingKeys.subscription(),
    queryFn: async () => {
      const res = await billingApi.getCurrentSubscription()
      return safeSubscription(res)
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useSubscription(id: string | undefined) {
  return useQuery({
    queryKey: billingKeys.subscription(id),
    queryFn: () => billingApi.getSubscription(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  })
}

export function usePlans() {
  return useQuery({
    queryKey: billingKeys.plans(),
    queryFn: async () => {
      const res = await billingApi.getPlans()
      return safePlans(res)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: billingApi.createCheckoutSession,
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url
      else toast.error('Checkout URL not returned')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Checkout failed'),
  })
}

export function useCancelSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, atPeriodEnd }: { id: string; atPeriodEnd?: boolean }) =>
      billingApi.cancelSubscription(id, { atPeriodEnd }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.all })
      toast.success('Subscription canceled')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Cancel failed'),
  })
}

export function useApplyPromo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PromoApplyRequest) => billingApi.applyPromo(input),
    onSuccess: (data) => {
      if (data?.valid) {
        queryClient.invalidateQueries({ queryKey: billingKeys.all })
        toast.success('Promo code applied')
      } else toast.error(data?.message ?? 'Invalid promo code')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to apply promo'),
  })
}

export function useUpdatePaymentMethod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (returnUrl?: string) => billingApi.updatePaymentMethod({ returnUrl }),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url
      else qc.invalidateQueries({ queryKey: billingKeys.all })
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Update failed'),
  })
}
