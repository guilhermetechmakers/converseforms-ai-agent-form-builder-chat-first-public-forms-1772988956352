import { api } from '@/lib/api'
import type {
  Webhook,
  CreateWebhookInput,
  UpdateWebhookInput,
  DeliveryLog,
  TestDeliveryResult,
} from '@/types/webhook'

export const webhooksApi = {
  getAll: () => api.get<Webhook[]>('/webhooks'),
  getById: (id: string) => api.get<Webhook>(`/webhooks/${id}`),
  create: (data: CreateWebhookInput) => api.post<Webhook>('/webhooks', data),
  update: (id: string, data: UpdateWebhookInput) =>
    api.put<Webhook>(`/webhooks/${id}`, data),
  delete: (id: string) => api.delete<void>(`/webhooks/${id}`),
  test: (id: string, event?: string) =>
    api.post<TestDeliveryResult>(`/webhooks/${id}/test`, { event: event ?? 'session.completed' }),
  getLogs: (id: string, params?: { from?: string; to?: string; statusCode?: number; event?: string; page?: number; limit?: number }) => {
    const search = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const query = search ? `?${search}` : ''
    return api.get<DeliveryLog[]>(`/webhooks/${id}/logs${query}`)
  },
}
