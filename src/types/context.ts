/**
 * Knowledge Attachment & Retrieval types.
 * Used for context upload, vector search, and session persistence.
 */

export type ContextAttachmentType = 'faq' | 'doc' | 'productCopy'

export interface ContextAttachment {
  id: string
  agentId: string
  docId: string
  source: string
  type: ContextAttachmentType
  language: string
  createdAt: string
  /** Optional display metadata */
  title?: string
  size?: number
  status?: 'indexing' | 'ready' | 'error'
}

export interface DocChunk {
  id: string
  agentId: string
  docId: string
  chunkIndex: number
  text: string
  embeddingId?: string
  source: string
  language: string
  metadata?: Record<string, unknown>
  createdAt?: string
}

export interface RetrievalChunk {
  text: string
  score: number
  docId: string
  chunkIndex: number
  source: string
  language?: string
  metadata?: Record<string, unknown>
}

export interface ContextUploadMetadata {
  docTitle?: string
  language?: string
  category?: string
}

export interface ContextUploadResponse {
  indexedChunks: number
  embeddingsCreated: number
  durationMs: number
  docId?: string
}

export interface ContextSearchParams {
  q: string
  topK?: number
  threshold?: number
}

export interface ContextSearchResponse {
  chunks: RetrievalChunk[]
}

export interface SaveSessionBody {
  sessionId?: string
  transcriptChunk?: { role: 'user' | 'assistant'; content: string }
  fieldValues?: Record<string, string | number | string[]>
}

export interface SaveSessionResponse {
  success: boolean
  nextPrompt?: string
  sessionId?: string
}

export interface SessionSummary {
  id: string
  agentId: string
  startTime: string
  endTime?: string
  status: string
  collectedFields?: Record<string, unknown>
  messageCount?: number
}

export interface ListSessionsResponse {
  sessions: SessionSummary[]
}
