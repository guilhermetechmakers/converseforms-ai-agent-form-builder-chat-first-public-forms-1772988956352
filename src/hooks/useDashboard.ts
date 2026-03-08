import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import type { DashboardSummary, RecentSessionItem, DashboardAlert } from '@/types/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  recentSessions: (params?: { limit?: number; agentId?: string }) =>
    [...dashboardKeys.all, 'recent-sessions', params ?? {}] as const,
  alerts: () => [...dashboardKeys.all, 'alerts'] as const,
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const res = await dashboardApi.getSummary()
      return res ?? ({} as DashboardSummary)
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useRecentSessions(params?: { limit?: number; agentId?: string }) {
  return useQuery({
    queryKey: dashboardKeys.recentSessions(params),
    queryFn: async () => {
      const res = await dashboardApi.getRecentSessions(params)
      const sessions = Array.isArray(res?.sessions) ? res.sessions : []
      return { sessions: sessions as RecentSessionItem[] }
    },
    staleTime: 1000 * 60,
  })
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: async () => {
      const res = await dashboardApi.getAlerts()
      const alerts = Array.isArray(res?.alerts) ? res.alerts : []
      return { alerts: alerts as DashboardAlert[] }
    },
    staleTime: 1000 * 60,
  })
}
