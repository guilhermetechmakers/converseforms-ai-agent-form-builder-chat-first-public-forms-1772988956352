import { api } from '@/lib/api'
import type { Template } from '@/types/template'

export const templatesApi = {
  getAll: () => api.get<Template[]>('/templates'),
  getById: (id: string) => api.get<Template>(`/templates/${id}`),
  clone: (templateId: string) => api.post<{ id: string }>(`/agents/clone`, { templateId }),
}
