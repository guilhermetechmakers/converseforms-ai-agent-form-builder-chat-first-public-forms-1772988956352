/**
 * Analytics & reporting types.
 * Aligns with GET /api/analytics/* and POST /api/events/ingest contracts.
 * Use safe defaults: data ?? [], (items ?? []).map(...)
 */

export type PublishStatus = 'draft' | 'published' | 'unpublished' | 'suspended'

/** Time-series data point for charts */
export interface TimeSeriesPoint {
  timestamp: string
  value: number
  agentId?: string
  metricType?: string
}

/** Response for GET /api/analytics/metrics */
export interface AnalyticsMetricsResponse {
  data: TimeSeriesPoint[]
  interval?: 'hour' | 'day'
}

/** Per-agent aggregate summary */
export interface AgentAnalyticsSummary {
  agentId: string
  agentName?: string
  sessions: number
  completions: number
  avgDurationSeconds: number | null
  completionRate: number | null
  validationsFailRate: number | null
  leadsCaptured?: number
  publishedAt?: string | null
  publicUrl?: string | null
  status?: PublishStatus
}

/** Single validation failure record for top-failures */
export interface ValidationFailureItem {
  id: string
  agentId: string
  agentName?: string
  fieldName: string
  result: 'fail'
  errorCode?: string
  message?: string
  count: number
  timestamp?: string
}

/** Response for GET /api/analytics/validations/top-failures */
export interface TopValidationFailuresResponse {
  data: ValidationFailureItem[]
  total?: number
}

/** Billing/usage summary */
export interface BillingUsageSummary {
  userId?: string
  plan: string
  quota: number
  usage: number
  overage: number
  periodStart: string
  periodEnd: string
}

/** Response for GET /api/billing/usage */
export interface BillingUsageResponse {
  usage: BillingUsageSummary
  byAgent?: { agentId: string; agentName?: string; sessions: number; costEstimate?: number }[]
}

/** Ingest event payload (POST /api/events/ingest) */
export interface IngestEventPayload {
  id?: string
  agentId: string
  sessionId: string
  eventType: string
  timestamp: string
  payload?: Record<string, unknown>
}

export interface IngestEventsResponse {
  accepted: number
  rejected?: number
  errors?: string[]
}
