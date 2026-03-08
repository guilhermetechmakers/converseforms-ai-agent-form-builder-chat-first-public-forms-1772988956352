import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { s3Api } from '@/api/s3'

interface UseS3UploadOptions {
  orgId: string
  type: 'avatars' | 'assets' | 'transcripts' | 'attachments' | 'pdfs' | 'images'
  resourceId?: string
}

/**
 * Request a pre-signed URL and upload a file to S3.
 * Returns the S3 key on success. Use for avatars, PDFs, session attachments.
 */
export function useS3Upload(options: UseS3UploadOptions) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      setUploading(true)
      setError(null)
      try {
        const { url, fields, key } = await s3Api.getPresignedUpload({
          orgId: options.orgId,
          type: options.type,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          resourceId: options.resourceId,
        })
        const formData = new FormData()
        if (fields && typeof fields === 'object') {
          Object.entries(fields).forEach(([k, v]) => formData.append(k, v))
        }
        formData.append('file', file)
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`)
        }
        toast.success('File uploaded.')
        return key
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setError(message)
        toast.error(message)
        return null
      } finally {
        setUploading(false)
      }
    },
    [options.orgId, options.type, options.resourceId]
  )

  return { upload, uploading, error }
}
