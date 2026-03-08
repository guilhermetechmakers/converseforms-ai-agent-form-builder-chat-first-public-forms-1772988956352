/**
 * Admin Dashboard data models and API contracts.
 * All types align with backend contracts; frontend must validate and use safe defaults.
 */

export type UserStatus = 'active' | 'inactive'
export type LogSeverity = 'info' | 'warning' | 'error'

export interface AdminUser {
  id: string
  email: string
  name?: string
  orgId: string
  role: string
  status: UserStatus
  lastLogin?: string
  impersonationToken?: string
  createdAt: string
}

export interface AdminOrg {
  id: string
  name: string
  defaultPlan: string
  quotas: Record<string, number>
  rateLimits: Record<string, number>
  createdAt: string
  updatedAt: string
}

export interface AdminQuota {
  orgId: string
  metricName: string
  limit: number
  currentUsage: number
  windowStart: string
  windowEnd: string
}

export interface AdminInvoice {
  id: string
  orgId: string
  userId?: string
  amount: number
  currency: string
  status: string
  dueDate: string
  periodStart: string
  periodEnd: string
  planId?: string
  items?: unknown[]
}

export interface AdminPlan {
  id: string
  name: string
  price: number
  features: string[]
  quotas: Record<string, number>
  maxUsers?: number
}

export interface AdminLog {
  id: string
  orgId?: string
  type: string
  severity: LogSeverity
  message: string
  payload?: unknown
  createdAt: string
}

export interface AdminFlag {
  id: string
  orgId?: string
  key: string
  enabled: boolean
  rolloutPercentage?: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface AdminMetric {
  name: string
  value: number
  timestamp: string
  breakdown?: Array<{ label: string; value: number }>
}

export interface AdminDashboardStats {
  totalUsers: number
  activeAgents: number
  llmUsageCosts: number
  pendingInvoices: number
}

export interface OrgDefaultsInput {
  defaultPlan?: string
  rateLimits?: Record<string, number>
  maxSessions?: number
  quotas?: Record<string, number>
}

export interface CreateUserInput {
  email: string
  name?: string
  orgId: string
  role: string
  password?: string
}

export interface UpdateUserInput {
  name?: string
  orgId?: string
  role?: string
  status?: UserStatus
}

export interface UpdateFlagInput {
  enabled?: boolean
  rolloutPercentage?: number
  description?: string
}
