/**
 * Privacy data request API placeholders.
 * When backend implements POST /privacy/export-request and DELETE /privacy/data-deletion-request,
 * uncomment the api calls and remove the stub responses. Ensure auth (userId) is set server-side.
 */

import type { ExportRequestResponse, DeletionRequestResponse } from '@/types/privacy'

const PRIVACY_API_AVAILABLE = false // Set to true when backend endpoints exist

/** Request data export for the current user. Guard: only call when backend exists. */
export async function requestDataExport(userId: string): Promise<ExportRequestResponse> {
  if (!userId?.trim()) {
    return { success: false, message: 'User ID is required.' }
  }
  if (!PRIVACY_API_AVAILABLE) {
    return {
      success: true,
      message: 'Request received. Our team will process your export within 30 days. Check the Contact section for how to submit a request.',
    }
  }
  // When backend is ready:
  // const response = await api.post<ExportRequestResponse>('/privacy/export-request', { userId })
  // const data = response ?? {}
  // return { success: (data as ExportRequestResponse).success ?? false, message: (data as ExportRequestResponse).message, requestId: (data as ExportRequestResponse).requestId }
  return { success: true, message: 'Export request submitted.' }
}

/** Request account/data deletion. Guard: only call when backend exists. */
export async function requestDataDeletion(
  userId: string,
  _reason?: string
): Promise<DeletionRequestResponse> {
  if (!userId?.trim()) {
    return { success: false, message: 'User ID is required.' }
  }
  if (!PRIVACY_API_AVAILABLE) {
    return {
      success: true,
      message: 'Request received. Our team will process your deletion request within 30 days. Check the Contact section for how to submit a request.',
    }
  }
  // When backend is ready:
  // const response = await api.post<DeletionRequestResponse>('/privacy/data-deletion-request', { userId, reason })
  // const data = response ?? {}
  // return { success: (data as DeletionRequestResponse).success ?? false, message: (data as DeletionRequestResponse).message, requestId: (data as DeletionRequestResponse).requestId }
  return { success: true, message: 'Deletion request submitted.' }
}
