import { api } from '@/lib/api'
import type { OrgSettings, RetentionPolicyOption } from '@/types/org'

export const orgApi = {
  getSettings: (orgId: string) =>
    api.get<OrgSettings>(`/org/${orgId}/settings`),

  updateSettings: (orgId: string, data: Partial<OrgSettings>) =>
    api.patch<OrgSettings>(`/org/${orgId}/settings`, data),

  getRetentionPolicies: (orgId: string) =>
    api.get<RetentionPolicyOption[]>(`/org/${orgId}/retention-policies`),

  applyRetention: (orgId: string, policyId: string) =>
    api.post<{ success: boolean }>(`/org/${orgId}/retention/apply`, { policyId }),
}
