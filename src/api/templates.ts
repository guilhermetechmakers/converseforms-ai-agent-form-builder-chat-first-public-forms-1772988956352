import { api } from '@/lib/api'
import type {
  Template,
  TemplatesListResponse,
  CloneTemplateRequest,
  CloneTemplateResponse,
} from '@/types/template'
export const templatesApi = {
  /** Get list of available templates (data ?? [] safe) */
  getList: () => api.get<TemplatesListResponse>('/templates'),

  /** Clone a template into a new agent for the current user */
  clone: (body: CloneTemplateRequest) =>
    api.post<CloneTemplateResponse>('/agents/clone', body),
}

/** Normalize templates response to always return an array */
export function normalizeTemplatesResponse(
  res: TemplatesListResponse | Template[] | { data?: Template[] } | null | undefined
): Template[] {
  if (Array.isArray(res)) return res
  const data = (res as { data?: Template[] })?.data
  return Array.isArray(data) ? data : []
}

/** Normalize clone response to get agent or null */
export function normalizeCloneResponse(
  res: CloneTemplateResponse | null | undefined
): { id: string; name: string; status: string } | null {
  const agent = res?.agent
  if (!agent || typeof agent.id !== 'string') return null
  return {
    id: agent.id,
    name: typeof agent.name === 'string' ? agent.name : 'Untitled',
    status: typeof agent.status === 'string' ? agent.status : 'draft',
  }
}
