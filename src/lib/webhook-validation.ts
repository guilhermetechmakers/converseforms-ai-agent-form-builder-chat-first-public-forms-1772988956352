/** Validation and sanitization helpers for webhook configuration. */

const HEADER_KEY_REGEX = /^[a-zA-Z0-9_-]+$/
const MAX_HEADER_KEY_LENGTH = 256
const MAX_HEADER_VALUE_LENGTH = 4096
const MIN_SECRET_LENGTH = 16
const MAX_RETRIES = 100
const MIN_BACKOFF_MS = 100
const MAX_BACKOFF_MS = 300_000

export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isTruthyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

export function sanitizeHeaders(
  headers: Record<string, string> | null | undefined
): Record<string, string> {
  const raw = headers ?? {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw)) {
    if (typeof k !== 'string' || typeof v !== 'string') continue
    const key = k.trim()
    const val = v.trim()
    if (key.startsWith('__new_')) continue
    if (key && val && key.length <= MAX_HEADER_KEY_LENGTH && val.length <= MAX_HEADER_VALUE_LENGTH) {
      out[key] = val
    }
  }
  return out
}

export function validateHeaderKeys(keys: string[]): string[] {
  const errors: string[] = []
  for (const k of keys) {
    if (!HEADER_KEY_REGEX.test(k)) {
      errors.push(`Invalid header key: ${k}`)
    }
    if (k.length > MAX_HEADER_KEY_LENGTH) {
      errors.push(`Header key too long: ${k}`)
    }
  }
  return errors
}

export interface WebhookFormErrors {
  name?: string
  url?: string
  signingSecret?: string
  events?: string
  headers?: string
  maxRetries?: string
  backoffMs?: string
  initialDelayMs?: string
  dlqEndpoint?: string
}

export function validateWebhookForm(values: {
  name?: string
  url?: string
  signingEnabled?: boolean
  signingSecret?: string
  events?: string[]
  headers?: Record<string, string>
  retryPolicy?: { maxRetries?: number; backoffMs?: number; initialDelayMs?: number }
  dlqEnabled?: boolean
  dlqEndpoint?: string
}): WebhookFormErrors {
  const errors: WebhookFormErrors = {}

  if (typeof values.name !== 'string' || !values.name.trim()) {
    errors.name = 'Name is required'
  }

  if (typeof values.url !== 'string' || !values.url.trim()) {
    errors.url = 'URL is required'
  } else if (!isValidUrl(values.url.trim())) {
    errors.url = 'Enter a valid HTTP or HTTPS URL'
  }

  if (values.signingEnabled && typeof values.signingSecret === 'string') {
    const secret = values.signingSecret.trim()
    if (secret.length > 0 && secret.length < MIN_SECRET_LENGTH) {
      errors.signingSecret = `Secret must be at least ${MIN_SECRET_LENGTH} characters when signing is enabled`
    }
  }

  const events = values.events ?? []
  if (!Array.isArray(events) || events.length === 0) {
    errors.events = 'Select at least one event'
  }

  const headerKeys = Object.keys(values.headers ?? {})
  const headerErrors = validateHeaderKeys(headerKeys)
  if (headerErrors.length > 0) {
    errors.headers = headerErrors.join('; ')
  }

  const rp = values.retryPolicy ?? {}
  const maxRetries = typeof rp.maxRetries === 'number' ? rp.maxRetries : 3
  if (maxRetries < 0 || maxRetries > MAX_RETRIES) {
    errors.maxRetries = `Max retries must be between 0 and ${MAX_RETRIES}`
  }

  const backoffMs = typeof rp.backoffMs === 'number' ? rp.backoffMs : 1000
  if (backoffMs < MIN_BACKOFF_MS || backoffMs > MAX_BACKOFF_MS) {
    errors.backoffMs = `Backoff must be between ${MIN_BACKOFF_MS} and ${MAX_BACKOFF_MS} ms`
  }

  if (typeof rp.initialDelayMs === 'number' && rp.initialDelayMs < 0) {
    errors.initialDelayMs = 'Initial delay must be non-negative'
  }

  if (values.dlqEnabled && typeof values.dlqEndpoint === 'string') {
    const ep = values.dlqEndpoint.trim()
    if (ep.length > 0 && !isValidUrl(ep)) {
      errors.dlqEndpoint = 'DLQ endpoint must be a valid URL'
    }
  }

  return errors
}
