import type { SessionSummary } from '@/types/session'

/** Dashboard summary metrics */
export interface DashboardSummary {
  totalAgents: number
  publishedAgents: number
  totalSessions: number
  sessionsThisMonth: number
  leadsCount: number
  completionRate: number | null
  retentionRate?: number | null
  exportQueueLength?: number
}

/** Recent session row for dashboard */
export interface RecentSessionItem extends Pick<SessionSummary, 'id' | 'agentId' | 'agentName' | 'status' | 'startedAt' | 'updatedAt'> {
  lastMessageSnippet?: string
}

/** System alert for dashboard banner */
export interface DashboardAlert {
  id: string
  type: 'retention' | 'storage' | 'export' | 'webhook' | 'info' | 'warning' | 'error'
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  createdAt: string
  dismissed?: boolean
}
