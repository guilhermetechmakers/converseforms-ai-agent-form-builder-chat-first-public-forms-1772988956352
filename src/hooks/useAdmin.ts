/**
 * Admin React Query hooks with safe data handling.
 * All list data is normalized to arrays; never assume non-null.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminApi, safeArray } from '@/api/admin'
import type {
  AdminUser,
  AdminQuota,
  AdminInvoice,
  AdminLog,
  AdminFlag,
  AdminMetric,
  AdminDashboardStats,
  CreateUserInput,
  UpdateUserInput,
  UpdateFlagInput,
} from '@/types/admin'

export const adminKeys = {
  users: ['admin', 'users'] as const,
  quotas: ['admin', 'quotas'] as const,
  invoices: ['admin', 'invoices'] as const,
  logs: (params?: Record<string, string>) => ['admin', 'logs', params ?? {}] as const,
  flags: ['admin', 'flags'] as const,
  stats: ['admin', 'stats'] as const,
  metrics: (params?: Record<string, string>) => ['admin', 'metrics', params ?? {}] as const,
  orgDefaults: (orgId: string) => ['admin', 'org', orgId] as const,
}

function normalizeUsers(data: unknown): AdminUser[] {
  if (Array.isArray(data)) return data as AdminUser[]
  const o = data as { users?: AdminUser[] } | null | undefined
  return Array.isArray(o?.users) ? o.users : []
}

function normalizeQuotas(data: unknown): AdminQuota[] {
  return safeArray<AdminQuota>(Array.isArray(data) ? data : (data as { quotas?: AdminQuota[] })?.quotas)
}

function normalizeInvoices(data: unknown): AdminInvoice[] {
  return safeArray<AdminInvoice>(Array.isArray(data) ? data : (data as { invoices?: AdminInvoice[] })?.invoices)
}

function normalizeLogs(data: unknown): AdminLog[] {
  return safeArray<AdminLog>(Array.isArray(data) ? data : (data as { logs?: AdminLog[] })?.logs)
}

function normalizeFlags(data: unknown): AdminFlag[] {
  return safeArray<AdminFlag>(Array.isArray(data) ? data : (data as { flags?: AdminFlag[] })?.flags)
}

function normalizeMetrics(data: unknown): AdminMetric[] {
  return safeArray<AdminMetric>(Array.isArray(data) ? data : (data as { metrics?: AdminMetric[] })?.metrics)
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: async () => {
      try {
        const raw = await adminApi.getUsers()
        return normalizeUsers(raw)
      } catch {
        return [] as AdminUser[]
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminQuotas() {
  return useQuery({
    queryKey: adminKeys.quotas,
    queryFn: async () => {
      try {
        const raw = await adminApi.getQuotas()
        return normalizeQuotas(raw)
      } catch {
        return [] as AdminQuota[]
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminInvoices() {
  return useQuery({
    queryKey: adminKeys.invoices,
    queryFn: async () => {
      try {
        const raw = await adminApi.getInvoices()
        return normalizeInvoices(raw)
      } catch {
        return [] as AdminInvoice[]
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminLogs(params?: { type?: string; severity?: string; from?: string; to?: string }) {
  return useQuery({
    queryKey: adminKeys.logs(params as Record<string, string>),
    queryFn: async () => {
      try {
        const raw = await adminApi.getLogs(params)
        return normalizeLogs(raw)
      } catch {
        return [] as AdminLog[]
      }
    },
    staleTime: 1000 * 60,
  })
}

export function useAdminFlags() {
  return useQuery({
    queryKey: adminKeys.flags,
    queryFn: async () => {
      try {
        const raw = await adminApi.getFlags()
        return normalizeFlags(raw)
      } catch {
        return [] as AdminFlag[]
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: async (): Promise<AdminDashboardStats> => {
      try {
        const data = await adminApi.getDashboardStats()
        return (
          data ?? {
            totalUsers: 0,
            activeAgents: 0,
            llmUsageCosts: 0,
            pendingInvoices: 0,
          }
        )
      } catch {
        return {
          totalUsers: 0,
          activeAgents: 0,
          llmUsageCosts: 0,
          pendingInvoices: 0,
        }
      }
    },
    staleTime: 1000 * 60,
  })
}

export function useAdminMetrics(params?: { from?: string; to?: string; breakdown?: string }) {
  return useQuery({
    queryKey: adminKeys.metrics(params as Record<string, string>),
    queryFn: async () => {
      try {
        const raw = await adminApi.getMetrics(params)
        return normalizeMetrics(raw)
      } catch {
        return [] as AdminMetric[]
      }
    },
    staleTime: 1000 * 60,
  })
}

export function useAdminOrgDefaults(orgId: string) {
  return useQuery({
    queryKey: adminKeys.orgDefaults(orgId),
    queryFn: () => adminApi.getOrgDefaults(orgId),
    enabled: !!orgId,
  })
}

export function useCreateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUserInput) => adminApi.createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('User created')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to create user'),
  })
}

export function useUpdateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserInput }) => adminApi.updateUser(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('User updated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update user'),
  })
}

export function useDeleteAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('User removed')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to delete user'),
  })
}

export function useAdminResetPassword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => adminApi.resetPassword(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('Password reset email sent')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to reset password'),
  })
}

export function useAdminImpersonate() {
  return useMutation({
    mutationFn: (userId: string) => adminApi.impersonate(userId),
    onSuccess: (data) => {
      if (data?.url) window.open(data.url, '_blank')
      toast.success('Impersonation session opened')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Impersonation failed'),
  })
}

export function useUpdateAdminQuotas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orgId, quotas }: { orgId: string; quotas: Parameters<typeof adminApi.updateQuotas>[1] }) =>
      adminApi.updateQuotas(orgId, quotas),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.quotas })
      toast.success('Quotas updated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update quotas'),
  })
}

export function useAdminRefundInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.refundInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.invoices })
      qc.invalidateQueries({ queryKey: adminKeys.stats })
      toast.success('Refund initiated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Refund failed'),
  })
}

export function useAdminApplyCredit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { customerId: string; amount: number; reason: string }) =>
      adminApi.applyCredit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.invoices })
      qc.invalidateQueries({ queryKey: adminKeys.stats })
      toast.success('Credit applied')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Apply credit failed'),
  })
}

export function useAdminCreatePromo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      code: string
      discountPercent?: number
      discountAmount?: number
      validFrom?: string
      validTo?: string
      usageLimit?: number
    }) => adminApi.createPromo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.stats })
      toast.success('Promo code created')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Create promo failed'),
  })
}

export function useUpdateAdminFlag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateFlagInput }) => adminApi.updateFlag(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.flags })
      toast.success('Flag updated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update flag'),
  })
}
