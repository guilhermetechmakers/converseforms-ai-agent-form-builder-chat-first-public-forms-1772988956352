/**
 * Analytics React Query hooks with safe data handling.
 * All list data normalized to arrays; use data ?? [] in UI.
 */

import { useQuery } from '@tanstack/react-query'
import { analyticsApi, type AnalyticsMetricsParams } from '@/api/analytics'
import type {
  TimeSeriesPoint,
  AgentAnalyticsSummary,
  ValidationFailureItem,
} from '@/types/analytics'

export const analyticsKeys = {
  all: ['analytics'] as const,
  metrics: (params?: AnalyticsMetricsParams) => [...analyticsKeys.all, 'metrics', params ?? {}] as const,
  agentSummary: (agentId: string) => [...analyticsKeys.all, 'agent', agentId] as const,
  topFailures: (params?: { topN?: number; agentId?: string }) =>
    [...analyticsKeys.all, 'top-failures', params ?? {}] as const,
}

function safeMetricsResponse(data: unknown): TimeSeriesPoint[] {
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
    return (data as { data: TimeSeriesPoint[] }).data
  return []
}

function safeAgentSummary(data: unknown): AgentAnalyticsSummary | null {
  if (data && typeof data === 'object') return data as AgentAnalyticsSummary
  return null
}

function safeTopFailures(data: unknown): ValidationFailureItem[] {
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
    return (data as { data: ValidationFailureItem[] }).data
  return []
}

export function useAnalyticsMetrics(params?: AnalyticsMetricsParams) {
  return useQuery({
    queryKey: analyticsKeys.metrics(params),
    queryFn: async () => {
      const res = await analyticsApi.getMetrics(params)
      return safeMetricsResponse(res)
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAgentAnalyticsSummary(agentId: string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.agentSummary(agentId ?? ''),
    queryFn: async () => {
      if (!agentId) return null
      const res = await analyticsApi.getAgentSummary(agentId)
      return safeAgentSummary(res)
    },
    enabled: !!agentId,
    staleTime: 1000 * 60,
  })
}

export function useTopValidationFailures(params?: { topN?: number; agentId?: string }) {
  return useQuery({
    queryKey: analyticsKeys.topFailures(params),
    queryFn: async () => {
      const res = await analyticsApi.getTopValidationFailures(params)
      return safeTopFailures(res)
    },
    staleTime: 1000 * 60 * 2,
  })
}

export { useBillingUsage } from '@/hooks/useBilling'
