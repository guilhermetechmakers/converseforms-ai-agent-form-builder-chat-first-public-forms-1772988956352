/**
 * Analytics API – metrics, agent summary, top validation failures.
 * Uses native fetch via src/lib/api.ts. Guard responses with data ?? [].
 */

import { api } from '@/lib/api'
import type {
  AnalyticsMetricsResponse,
  AgentAnalyticsSummary,
  TopValidationFailuresResponse,
} from '@/types/analytics'

export interface AnalyticsMetricsParams {
  start?: string
  end?: string
  agentId?: string
  interval?: 'hour' | 'day'
}

export const analyticsApi = {
  /** GET /api/analytics/metrics – time-series metrics */
  getMetrics: (params?: AnalyticsMetricsParams) => {
    const search = new URLSearchParams()
    if (params?.start) search.set('start', params.start)
    if (params?.end) search.set('end', params.end)
    if (params?.agentId) search.set('agentId', params.agentId)
    if (params?.interval) search.set('interval', params.interval)
    const q = search.toString()
    return api.get<AnalyticsMetricsResponse>(`/analytics/metrics${q ? `?${q}` : ''}`)
  },

  /** GET /api/analytics/agents/:agentId/summary – per-agent aggregates */
  getAgentSummary: (agentId: string) =>
    api.get<AgentAnalyticsSummary>(`/analytics/agents/${agentId}/summary`),

  /** GET /api/analytics/validations/top-failures */
  getTopValidationFailures: (params?: { topN?: number; agentId?: string }) => {
    const search = new URLSearchParams()
    if (params?.topN != null) search.set('topN', String(params.topN))
    if (params?.agentId) search.set('agentId', params.agentId)
    const q = search.toString()
    return api.get<TopValidationFailuresResponse>(`/analytics/validations/top-failures${q ? `?${q}` : ''}`)
  },
}
