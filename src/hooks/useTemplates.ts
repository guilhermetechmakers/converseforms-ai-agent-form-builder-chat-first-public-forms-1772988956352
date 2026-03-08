import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { templatesApi, normalizeTemplatesResponse, normalizeCloneResponse } from '@/api/templates'
import { agentsApi } from '@/api/agents'
import type { Template, CloneTemplateRequest } from '@/types/template'
import type { CreateAgentInput } from '@/types/agent'
import { agentKeys } from '@/hooks/useAgents'

const BUILT_IN_IDS = ['lead-capture', 'demo-request', 'support-triage']
export function isBuiltInTemplateId(id: string): boolean {
  return BUILT_IN_IDS.includes(id)
}

export const templateKeys = {
  all: ['templates'] as const,
  list: () => [...templateKeys.all, 'list'] as const,
}

/** Fetch templates list; returns { data: Template[] } with data guarded (data ?? []). */
export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: async () => {
      const res = await templatesApi.getList()
      const data: Template[] = Array.isArray(res)
        ? (res as Template[])
        : (normalizeTemplatesResponse(res as { data?: Template[] }) ?? [])
      return { data }
    },
    staleTime: 1000 * 60 * 5,
  })
}

/** Clone input: API request or built-in create payload */
export type CloneTemplateMutationInput =
  | CloneTemplateRequest
  | { builtInConfig: CreateAgentInput }

/** Clone a template into a new agent; on success navigates to agent edit. Supports built-in templates via builtInConfig. */
export function useCloneTemplate() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (input: CloneTemplateMutationInput) => {
      if ('builtInConfig' in input && input.builtInConfig) {
        const agent = await agentsApi.create(input.builtInConfig)
        return agent ? { id: agent.id, name: agent.name ?? 'Untitled', status: agent.status ?? 'draft' } : null
      }
      const res = await templatesApi.clone(input as CloneTemplateRequest)
      return normalizeCloneResponse(res)
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.list() })
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      const id = result?.id
      if (id) {
        toast.success('Template cloned. Opening agent editor.')
        navigate(`/dashboard/agents/${id}`, { replace: true })
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to clone template.')
    },
  })
}
