import { api } from '@/lib/api'
import type { PresignedUploadResponse, PresignedDownloadResponse } from '@/types/s3'

export const s3Api = {
  /** Get pre-signed URL for upload. Returns url, fields (for POST), and key. */
  getPresignedUpload: (params: {
    orgId: string
    type: 'avatars' | 'assets' | 'transcripts' | 'attachments' | 'pdfs' | 'images'
    filename: string
    contentType: string
    resourceId?: string
  }) =>
    api.post<PresignedUploadResponse>('/s3/presigned-upload', {
      orgId: params.orgId,
      type: params.type,
      filename: params.filename,
      contentType: params.contentType,
      resourceId: params.resourceId,
    }),

  /** Get pre-signed URL for download (expiry in seconds). */
  getPresignedDownload: (key: string, expiry?: number) => {
    const search = new URLSearchParams({ key })
    if (expiry != null) search.set('expiry', String(expiry))
    return api.get<PresignedDownloadResponse>(`/s3/presigned-download?${search.toString()}`)
  },
}
