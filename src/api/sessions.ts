import { api } from '@/lib/api'
import type {
  Session,
  SessionDetail,
  ListSessionsParams,
  ListSessionsResponse,
  ExportJob,
} from '@/types/session'

function buildSessionsQuery(params: ListSessionsParams): string {
  const search = new URLSearchParams()
  if (params.orgId != null) search.set('orgId', params.orgId)
  if (params.agentId != null) search.set('agentId', params.agentId)
  if (params.status != null && params.status !== 'all') search.set('status', params.status)
  if (params.dateFrom != null) search.set('dateFrom', params.dateFrom)
  if (params.dateTo != null) search.set('dateTo', params.dateTo)
  if (params.search != null && params.search.trim() !== '') search.set('search', params.search.trim())
  if (params.sort != null) search.set('sort', params.sort)
  if (params.order != null) search.set('order', params.order)
  if (params.page != null) search.set('page', String(params.page))
  if (params.pageSize != null) search.set('pageSize', String(params.pageSize))
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const sessionsApi = {
  /** List sessions with filters, pagination */
  list: (params: ListSessionsParams = {}) => {
    const query = buildSessionsQuery(params)
    return api.get<ListSessionsResponse>(`/sessions${query}`)
  },

  /** Get single session by id (full detail for Session Viewer) */
  getById: (id: string) => api.get<SessionDetail>(`/sessions/${id}`),

  start: (agentId: string) => api.post<Session>('/sessions/start', { agentId }),

  sendMessage: (sessionId: string, content: string) =>
    api.post<Session>(`/sessions/${sessionId}/message`, { content }),

  /** Export single session as CSV or JSON (returns Blob) */
  exportSession: (id: string, format: 'json' | 'csv') =>
    api.getBlob(`/sessions/${id}/export?format=${format}`),

  tag: (id: string, tags: string[]) =>
    api.post<SessionDetail>(`/sessions/${id}/tag`, { tags }),

  annotate: (id: string, annotation: string) =>
    api.post<SessionDetail>(`/sessions/${id}/annotate`, { annotation }),

  resendWebhook: (id: string) =>
    api.post<{ success: boolean }>(`/sessions/${id}/resend-webhook`, {}),

  /** Mark session as reviewed (or clear reviewed state) */
  markReviewed: (id: string, reviewed: boolean) =>
    api.post<SessionDetail>(`/sessions/${id}/mark-reviewed`, { reviewed }),

  purge: (id: string) =>
    api.post<{ success: boolean }>(`/sessions/${id}/purge`, {}),

  /** Bulk export: start job, returns job id and status */
  bulkExport: (params: { format: 'csv' | 'json'; sessionIds?: string[]; dateFrom?: string; dateTo?: string }) =>
    api.post<ExportJob>('/sessions/export', params),
}
