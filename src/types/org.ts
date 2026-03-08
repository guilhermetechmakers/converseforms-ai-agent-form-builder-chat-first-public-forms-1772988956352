/** Organization settings (Settings & Preferences) */
export interface OrgSettings {
  orgId: string
  emailNotifications?: boolean
  marketingEmails?: boolean
  webhookEndpoints?: WebhookEndpoint[]
  defaultLlmModel?: string
  storageQuota?: number
  dataRetentionPolicyId?: string
  retentionDays?: number
  teamSettings?: Record<string, unknown>
  auditLogsEnabled?: boolean
  exportPreferences?: ExportPreferences
}

export interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  enabled: boolean
  secret?: string
}

export interface ExportPreferences {
  format?: 'csv' | 'json'
  frequency?: string
}

/** Pre-defined retention policy option */
export interface RetentionPolicyOption {
  id: string
  name: string
  ttlDays: number
  description?: string
}
