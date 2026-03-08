import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { agentsApi } from '@/api/agents'
import type {
  Agent,
  AgentListParams,
  AgentListResponse,
  CreateAgentInput,
  UpdateAgentInput,
} from '@/types/agent'

const PAGE_SIZE = 20

export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (params: AgentListParams) => [...agentKeys.lists(), params] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
}

/**
 * Fetch paginated list of agents with filters. Response data is normalized to an array.
 */
export function useAgentsList(params: AgentListParams = {}) {
  const { ownerId, orgId, status = 'all', search = '', sort = 'lastActivity', page = 1, pageSize = PAGE_SIZE } = params
  return useQuery({
    queryKey: agentKeys.list({ ownerId, orgId, status, search, sort, page, pageSize }),
    queryFn: async () => {
      const res = await agentsApi.getList({
        ownerId,
        orgId,
        status,
        search,
        sort,
        page,
        pageSize,
      })
      // Support both { data, total } and legacy array response
      const asPaginated = res as AgentListResponse
      const raw = res as unknown
      const data: Agent[] = Array.isArray(asPaginated?.data)
        ? asPaginated.data
        : Array.isArray(raw)
          ? (raw as Agent[])
          : []
      const total =
        typeof asPaginated?.total === 'number' ? asPaginated.total : data.length
      return { data, total }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAgent(id: string | undefined) {
  return useQuery({
    queryKey: agentKeys.detail(id ?? ''),
    queryFn: () => agentsApi.getById(id!),
    enabled: !!id,
  })
}

/** Fetch agent by public slug for the public chat page. */
export function useAgentBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: [...agentKeys.details(), 'slug', slug ?? ''] as const,
    queryFn: () => agentsApi.getBySlug(slug!),
    enabled: !!slug,
  })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAgentInput) => agentsApi.create(data),
    onSuccess: (newAgent) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      if (newAgent?.id) {
        queryClient.setQueryData(agentKeys.detail(newAgent.id), newAgent)
      }
      toast.success('Agent created successfully.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to create agent.')
    },
  })
}

export function useUpdateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgentInput }) =>
      agentsApi.update(id, data),
    onSuccess: (updated) => {
      if (updated?.id) {
        queryClient.setQueryData(agentKeys.detail(updated.id), updated)
      }
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      toast.success('Agent updated successfully.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to update agent.')
    },
  })
}

export function useDuplicateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agentsApi.duplicate(id),
    onSuccess: (duplicated) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      if (duplicated?.id) {
        queryClient.setQueryData(agentKeys.detail(duplicated.id), duplicated)
      }
      toast.success('Agent duplicated successfully.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to duplicate agent.')
    },
  })
}

export function usePublishAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agentsApi.publish(id),
    onSuccess: (updated) => {
      if (updated?.id) {
        queryClient.setQueryData(agentKeys.detail(updated.id), updated)
      }
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      toast.success('Agent publish state updated.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to update publish state.')
    },
  })
}

export function useArchiveAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agentsApi.archive(id),
    onSuccess: (updated) => {
      if (updated?.id) {
        queryClient.setQueryData(agentKeys.detail(updated.id), updated)
      }
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      toast.success('Agent archived.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to archive agent.')
    },
  })
}

export function useBulkAgents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ action, ids }: { action: 'publish' | 'archive' | 'export'; ids: string[] }) =>
      agentsApi.bulk(action, ids),
    onSuccess: (_, { action, ids }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() })
      const msg =
        action === 'export'
          ? `Export started for ${ids.length} agent(s).`
          : `${action === 'publish' ? 'Published' : 'Archived'} ${ids.length} agent(s).`
      toast.success(msg)
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Bulk action failed.')
    },
  })
}
