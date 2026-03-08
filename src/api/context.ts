/**
 * Knowledge Attachment & Retrieval API.
 * Endpoints: context upload, search, save-session, sessions, clear-context.
 * All responses normalized for null-safety (arrays default to []).
 */

import { api } from '@/lib/api'
import type {
  ContextUploadMetadata,
  ContextUploadResponse,
  ContextSearchParams,
  ContextSearchResponse,
  SaveSessionBody,
  SaveSessionResponse,
  ListSessionsResponse,
} from '@/types/context'

/**
 * Upload documents/FAQs for an agent. Extracts text, chunks, embeds, upserts to vector store.
 * POST /api/agents/:id/context/upload
 */
export async function uploadContext(
  agentId: string,
  files: File[],
  metadata?: ContextUploadMetadata
): Promise<ContextUploadResponse> {
  const form = new FormData()
  const fileList = Array.isArray(files) ? files : []
  for (let i = 0; i < fileList.length; i++) {
    form.append('files', fileList[i]!)
  }
  if (metadata?.docTitle) form.append('docTitle', metadata.docTitle)
  if (metadata?.language) form.append('language', metadata.language)
  if (metadata?.category) form.append('category', metadata.category)

  const res = await api.post<ContextUploadResponse>(
    `/agents/${agentId}/context/upload`,
    form
  )
  return res ?? { indexedChunks: 0, embeddingsCreated: 0, durationMs: 0 }
}

/**
 * Search agent context (vector similarity). Returns ordered chunks with scores.
 * GET /api/agents/:id/context/search?q=...&topK=10&threshold=0.7
 */
export async function searchContext(
  agentId: string,
  params: ContextSearchParams
): Promise<ContextSearchResponse> {
  const search = new URLSearchParams()
  search.set('q', params.q)
  if (params.topK != null) search.set('topK', String(params.topK))
  if (params.threshold != null) search.set('threshold', String(params.threshold))
  const query = search.toString()
  const res = await api.get<ContextSearchResponse>(
    `/agents/${agentId}/context/search?${query}`
  )
  const chunks = Array.isArray(res?.chunks) ? res.chunks : []
  return { chunks }
}

/**
 * Save or append to a chat session (transcript + field values).
 * POST /api/agents/:id/save-session
 */
export async function saveSession(
  agentId: string,
  body: SaveSessionBody
): Promise<SaveSessionResponse> {
  const res = await api.post<SaveSessionResponse>(
    `/agents/${agentId}/save-session`,
    body
  )
  return res ?? { success: false }
}

/**
 * List sessions for an agent.
 * GET /api/agents/:id/sessions
 */
export async function listSessions(agentId: string): Promise<ListSessionsResponse> {
  const res = await api.get<ListSessionsResponse>(`/agents/${agentId}/sessions`)
  const sessions = Array.isArray(res?.sessions) ? res.sessions : []
  return { sessions }
}

/**
 * Clear all context (chunks/embeddings) for an agent. Cache invalidated.
 * POST /api/agents/:id/clear-context
 */
export async function clearContext(agentId: string): Promise<{ success: boolean }> {
  const res = await api.post<{ success: boolean }>(
    `/agents/${agentId}/clear-context`,
    {}
  )
  return res ?? { success: false }
}
