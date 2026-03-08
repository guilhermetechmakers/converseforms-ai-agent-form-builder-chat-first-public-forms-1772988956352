export type SessionStatus = 'active' | 'completed' | 'abandoned'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
  /** Optional: model used for assistant messages */
  model?: string
  /** Optional: prompt identifier or snippet */
  prompt?: string | null
  /** Optional: token count */
  tokens?: number
}

/** Transcript message with LLM metadata for Session Viewer */
export interface TranscriptMessage extends ChatMessage {
  model?: string
  prompt?: string | null
  tokens?: number
}

export interface ExtractedField {
  fieldId: string
  label: string
  value: string | number | string[]
  validated: boolean
  timestamp?: string
  /** Source of the value: user input, auto-extraction, or validated */
  source?: 'user' | 'extracted' | 'validated'
  /** Validation status for display */
  validationStatus?: 'valid' | 'invalid' | 'pending' | 'error'
}

/** Field with value and validation metadata for Session Viewer */
export interface FieldDefinitionWithValue {
  fieldId: string
  label: string
  value: string | number | string[] | boolean | null
  source?: 'user' | 'extracted' | 'validated'
  timestamp?: string
  validationStatus?: 'valid' | 'invalid' | 'pending' | 'error'
  notes?: string | null
}

export interface SessionMetadata {
  ip?: string
  userAgent?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  device?: string
  os?: string
  browser?: string
  geo?: string
  consentStatus?: string
  /** Timestamps when data was collected */
  collectionTimestamps?: Record<string, string>
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

/** Webhook delivery record for Session Viewer */
export interface WebhookDelivery {
  id: string
  sessionId: string
  url: string
  attempt: number
  status: 'pending' | 'success' | 'failed' | 'dlq'
  responseCode?: number | null
  response?: string | null
  signedPayload?: string | null
  dlqFlag?: boolean
  createdAt?: string
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
  /** Marked as reviewed by operator */
  reviewedAt?: string | null
  reviewedBy?: string | null
  /** Last webhook delivery attempts for this session */
  webhookDeliveries?: WebhookDelivery[]
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
