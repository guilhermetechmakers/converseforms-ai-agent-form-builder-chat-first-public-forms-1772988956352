/**
 * Admin API – centralized calls for users, quotas, billing, logs, flags, metrics.
 * Client code must use safe defaults: Array.isArray(data) ? data : []
 */

import { api } from '@/lib/api'
import type {
  AdminUser,
  AdminOrg,
  AdminQuota,
  AdminInvoice,
  AdminLog,
  AdminFlag,
  AdminDashboardStats,
  OrgDefaultsInput,
  CreateUserInput,
  UpdateUserInput,
  UpdateFlagInput,
} from '@/types/admin'

const ADMIN_PREFIX = '/admin'

function safeArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
    return (data as { data: T[] }).data
  return []
}

export const adminApi = {
  getUsers: () => api.get<unknown>(`${ADMIN_PREFIX}/users`),
  createUser: (input: CreateUserInput) => api.post<AdminUser>(`${ADMIN_PREFIX}/users`, input),
  updateUser: (id: string, updates: UpdateUserInput) => api.patch<AdminUser>(`${ADMIN_PREFIX}/users/${id}`, updates),
  deleteUser: (id: string) => api.delete(`${ADMIN_PREFIX}/users/${id}`),
  resetPassword: (userId: string) => api.post(`${ADMIN_PREFIX}/users/${userId}/reset-password`, {}),
  impersonate: (userId: string) => api.post<{ token: string; url: string }>(`${ADMIN_PREFIX}/users/${userId}/impersonate`, {}),

  getOrgDefaults: (orgId: string) => api.get<AdminOrg | null>(`${ADMIN_PREFIX}/organizations/${orgId}/defaults`),
  updateOrgDefaults: (orgId: string, defaults: OrgDefaultsInput) =>
    api.patch<AdminOrg>(`${ADMIN_PREFIX}/organizations/${orgId}/defaults`, defaults),

  getQuotas: () => api.get<unknown>(`${ADMIN_PREFIX}/quotas`),
  updateQuotas: (orgId: string, quotas: Partial<AdminQuota>) => api.patch<AdminQuota>(`${ADMIN_PREFIX}/quotas/${orgId}`, quotas),

  getInvoices: () => api.get<unknown>(`${ADMIN_PREFIX}/invoices`),
  refundInvoice: (id: string) => api.post(`${ADMIN_PREFIX}/invoices/${id}/refund`, {}),
  chargeInvoice: (id: string) => api.patch<AdminInvoice>(`${ADMIN_PREFIX}/invoices/${id}/charge`, {}),

  /** POST /api/admin/billing/credits */
  applyCredit: (payload: { customerId: string; amount: number; reason: string }) =>
    api.post<{ success: boolean }>(`${ADMIN_PREFIX}/billing/credits`, payload),

  /** POST /api/admin/billing/promo */
  createPromo: (payload: {
    code: string
    discountPercent?: number
    discountAmount?: number
    validFrom?: string
    validTo?: string
    usageLimit?: number
  }) => api.post<{ id: string; code: string }>(`${ADMIN_PREFIX}/billing/promo`, payload),

  getLogs: (params?: { type?: string; severity?: string; from?: string; to?: string }) => {
    const q = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    return api.get<unknown>(`${ADMIN_PREFIX}/logs${q ? `?${q}` : ''}`)
  },
  getLog: (id: string) => api.get<AdminLog | null>(`${ADMIN_PREFIX}/logs/${id}`),

  getFlags: () => api.get<unknown>(`${ADMIN_PREFIX}/flags`),
  updateFlag: (id: string, updates: UpdateFlagInput) => api.patch<AdminFlag>(`${ADMIN_PREFIX}/flags/${id}`, updates),

  getDashboardStats: () => api.get<AdminDashboardStats>(`${ADMIN_PREFIX}/metrics/summary`),
  getMetrics: (params?: { from?: string; to?: string; breakdown?: string }) => {
    const q = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    return api.get<unknown>(`${ADMIN_PREFIX}/metrics${q ? `?${q}` : ''}`)
  },
}

export { safeArray }
