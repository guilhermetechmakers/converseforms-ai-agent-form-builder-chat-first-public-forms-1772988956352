/**
 * Privacy policy and data request types.
 * Used for policy sections (static or future dynamic loading) and API placeholders.
 */

export interface PolicySection {
  id: string
  title: string
  body: string
  subpoints?: string[]
}

/** Placeholder shape for future export request API */
export interface ExportRequest {
  userId: string
  requestedAt: string
  status: 'pending' | 'completed' | 'rejected'
}

/** Placeholder shape for future deletion request API */
export interface DeletionRequest {
  userId: string
  reason?: string
  requestedAt: string
  status: 'pending' | 'completed' | 'rejected'
}

/**
 * API contract placeholders (for future integration):
 *
 * POST /privacy/export-request
 *   Body: { userId: string }
 *   Response: { success: boolean; message?: string; requestId?: string }
 *
 * DELETE /privacy/data-deletion-request
 *   Body: { userId: string; reason?: string }
 *   Response: { success: boolean; message?: string; requestId?: string }
 */

export type ExportRequestResponse = {
  success: boolean
  message?: string
  requestId?: string
}

export type DeletionRequestResponse = {
  success: boolean
  message?: string
  requestId?: string
}
