import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orgApi } from '@/api/org'
import type { OrgSettings } from '@/types/org'

export const orgKeys = {
  all: ['org'] as const,
  settings: (orgId: string) => [...orgKeys.all, 'settings', orgId] as const,
  retentionPolicies: (orgId: string) => [...orgKeys.all, 'retention-policies', orgId] as const,
}

/** Placeholder org id when not in org context; replace with real org from auth. */
const DEFAULT_ORG_ID = 'default'

export function useOrgSettings(orgId: string | undefined) {
  const id = orgId ?? DEFAULT_ORG_ID
  return useQuery({
    queryKey: orgKeys.settings(id),
    queryFn: () => orgApi.getSettings(id),
    enabled: !!id,
  })
}

export function useUpdateOrgSettings(orgId: string | undefined) {
  const queryClient = useQueryClient()
  const id = orgId ?? DEFAULT_ORG_ID
  return useMutation({
    mutationFn: (data: Partial<OrgSettings>) => orgApi.updateSettings(id, data),
    onSuccess: (updated: OrgSettings | undefined) => {
      queryClient.setQueryData(orgKeys.settings(id), updated)
      toast.success('Settings saved.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to save settings.')
    },
  })
}

export function useRetentionPolicies(orgId: string | undefined) {
  const id = orgId ?? DEFAULT_ORG_ID
  return useQuery({
    queryKey: orgKeys.retentionPolicies(id),
    queryFn: async () => {
      try {
        return await orgApi.getRetentionPolicies(id)
      } catch {
        return []
      }
    },
    enabled: !!id,
  })
}
