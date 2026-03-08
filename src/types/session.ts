export type SessionStatus = 'active' | 'completed' | 'abandoned'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
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
