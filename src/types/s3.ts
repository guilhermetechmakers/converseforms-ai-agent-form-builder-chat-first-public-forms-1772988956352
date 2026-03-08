/** Pre-signed upload response from backend */
export interface PresignedUploadResponse {
  url: string
  fields?: Record<string, string>
  key: string
  expiresIn?: number
}

/** Pre-signed download response */
export interface PresignedDownloadResponse {
  url: string
  expiresIn?: number
}
