import { api } from '@/lib/api'
import type {
  DashboardSummary,
  RecentSessionItem,
  DashboardAlert,
} from '@/types/dashboard'

export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
  getRecentSessions: (params?: { limit?: number; agentId?: string }) => {
    const search = new URLSearchParams()
    if (params?.limit != null) search.set('limit', String(params.limit))
    if (params?.agentId != null) search.set('agentId', params.agentId)
    const q = search.toString()
    return api.get<{ sessions: RecentSessionItem[] }>(`/dashboard/recent-sessions${q ? `?${q}` : ''}`)
  },
  getAlerts: () => api.get<{ alerts: DashboardAlert[] }>('/dashboard/alerts'),
}
