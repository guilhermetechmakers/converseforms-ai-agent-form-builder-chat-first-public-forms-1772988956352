import { api } from '@/lib/api'
import type { Agent, CreateAgentInput, UpdateAgentInput } from '@/types/agent'

export const agentsApi = {
  getAll: () => api.get<Agent[]>('/agents'),
  getById: (id: string) => api.get<Agent>(`/agents/${id}`),
  getBySlug: (slug: string) => api.get<Agent>(`/agents/public/${slug}`),
  create: (data: CreateAgentInput) => api.post<Agent>('/agents', data),
  update: (id: string, data: UpdateAgentInput) => api.put<Agent>(`/agents/${id}`, data),
  delete: (id: string) => api.delete<void>(`/agents/${id}`),
  publish: (id: string) => api.post<Agent>(`/agents/${id}/publish`, {}),
}
