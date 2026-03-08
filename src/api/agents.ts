import { api } from '@/lib/api'
import type {
  Agent,
  AgentListParams,
  AgentListResponse,
  CreateAgentInput,
  UpdateAgentInput,
} from '@/types/agent'

function buildQuery(params: AgentListParams): string {
  const search = new URLSearchParams()
  if (params.ownerId != null) search.set('ownerId', params.ownerId)
  if (params.orgId != null) search.set('orgId', params.orgId)
  if (params.status != null && params.status !== 'all') search.set('status', params.status)
  if (params.search != null && params.search.trim() !== '') search.set('search', params.search.trim())
  if (params.sort != null) search.set('sort', params.sort)
  if (params.page != null) search.set('page', String(params.page))
  if (params.pageSize != null) search.set('pageSize', String(params.pageSize))
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const agentsApi = {
  /** List agents with filters, search, sort, and pagination */
  getList: (params: AgentListParams = {}) => {
    const query = buildQuery(params)
    return api.get<AgentListResponse>(`/agents${query}`)
  },

  getAll: () => api.get<Agent[]>('/agents'),

  getById: (id: string) => api.get<Agent>(`/agents/${id}`),
  getBySlug: (slug: string) => api.get<Agent>(`/agents/public/${slug}`),
  create: (data: CreateAgentInput) => api.post<Agent>('/agents', data),
  update: (id: string, data: UpdateAgentInput) => api.put<Agent>(`/agents/${id}`, data),
  delete: (id: string) => api.delete<void>(`/agents/${id}`),
  publish: (id: string) => api.post<Agent>(`/agents/${id}/publish`, {}),

  /** Duplicate an agent; returns the new agent */
  duplicate: (id: string) => api.post<Agent>(`/agents/${id}/duplicate`, {}),

  /** Archive an agent */
  archive: (id: string) => api.post<Agent>(`/agents/${id}/archive`, {}),

  /** Bulk actions: publish | archive | export */
  bulk: (action: 'publish' | 'archive' | 'export', ids: string[]) =>
    api.post<{ success: boolean; count?: number }>('/agents/bulk', { action, ids }),
}
