export type SessionStatus = 'active' | 'completed' | 'abandoned'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface ExtractedField {
  fieldId: string
  label: string
  value: string | number | string[]
  validated: boolean
  timestamp?: string
}

export interface SessionMetadata {
  ip?: string
  userAgent?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  device?: string
  consentStatus?: string
}

/** Respondent metadata (redact sensitive fields in UI) */
export interface RespondentMetadata {
  device?: string
  location?: string
  ip?: string
  consentStatus?: string
  [key: string]: unknown
}

export interface Session {
  id: string
  agentId: string
  status: SessionStatus
  messages: ChatMessage[]
  extractedFields: ExtractedField[]
  metadata?: SessionMetadata
  createdAt: string
  updatedAt: string
  completedAt?: string
}

/** Session list item for list/table views */
export interface SessionSummary {
  id: string
  agentId: string
  agentName?: string
  status: SessionStatus
  startedAt: string
  endedAt?: string
  duration?: number
  messageCount?: number
  lastMessageSnippet?: string
  createdAt: string
  updatedAt: string
}

/** Full session detail for Session Viewer (transcript, structured fields, attachments) */
export interface SessionDetail extends Session {
  agentName?: string
  orgId?: string
  startedAt?: string
  endedAt?: string
  duration?: number
  respondentMetadata?: RespondentMetadata
  structuredFields?: Record<string, string | number | boolean | null>
  attachments?: SessionAttachment[]
  tags?: string[]
  annotations?: string
  notes?: string
}

export interface SessionAttachment {
  id: string
  sessionId: string
  s3Key: string
  url?: string
  type: 'avatar' | 'pdf' | 'transcript' | 'image' | 'other'
  size?: number
  uploadedAt: string
  filename?: string
}

export interface ListSessionsParams {
  orgId?: string
  agentId?: string
  status?: SessionStatus | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
  sort?: 'startedAt' | 'endedAt' | 'createdAt' | 'duration'
  order?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface ListSessionsResponse {
  data: SessionSummary[]
  total: number
  page: number
  pageSize: number
}

export interface ExportJob {
  id: string
  orgId: string
  format: 'csv' | 'json'
  status: 'queued' | 'in_progress' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  fileUrl?: string
  progress?: number
}
