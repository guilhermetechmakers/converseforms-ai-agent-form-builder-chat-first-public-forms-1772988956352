/** Webhook and delivery log types for ConverseForms outbound integrations. */

export const WEBHOOK_EVENTS = [
  'session.completed',
  'session.updated',
  'session.started',
] as const

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number]

export interface RetryPolicy {
  maxRetries: number
  backoffMs: number
  backoffStrategy: 'fixed' | 'exponential'
  initialDelayMs?: number
}

export interface Webhook {
  id: string
  name: string
  url: string
  signingEnabled: boolean
  signingSecret?: string
  handshakeVerification?: boolean
  events: string[]
  headers: Record<string, string>
  retryPolicy: RetryPolicy
  dlqEnabled: boolean
  dlqEndpoint?: string
  lastDeliveryStatus?: 'success' | 'failure' | 'pending' | null
  lastDeliveryAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateWebhookInput {
  name: string
  url: string
  signingEnabled: boolean
  signingSecret?: string
  handshakeVerification?: boolean
  events: string[]
  headers: Record<string, string>
  retryPolicy: RetryPolicy
  dlqEnabled: boolean
  dlqEndpoint?: string
}

export interface UpdateWebhookInput extends Partial<CreateWebhookInput> {}

export interface DeliveryLog {
  id: string
  webhookId: string
  event: string
  timestamp: string
  statusCode: number
  durationMs: number
  requestBody: string
  responseBody: string
  retriedCount: number
  errorMessage?: string
}

export interface TestDeliveryResult {
  success: boolean
  statusCode?: number
  durationMs?: number
  responseBody?: string
  errorMessage?: string
}
