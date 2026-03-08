import { api } from '@/lib/api'
import type { Session } from '@/types/session'

export const sessionsApi = {
  list: (agentId?: string) =>
    api.get<Session[]>(agentId ? `/sessions?agentId=${agentId}` : '/sessions'),
  getById: (id: string) => api.get<Session>(`/sessions/${id}`),
  start: (agentId: string) => api.post<Session>('/sessions/start', { agentId }),
  sendMessage: (sessionId: string, content: string) =>
    api.post<Session>(`/sessions/${sessionId}/message`, { content }),
  exportSession: (id: string, format: 'json' | 'csv') =>
    api.get<Blob>(`/sessions/${id}/export?format=${format}`),
}
