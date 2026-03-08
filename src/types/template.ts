import type { FormField, Persona, Appearance } from '@/types/agent'

/** Default config for template (fields, persona, appearance, etc.) */
export interface TemplateDefaultConfig {
  name?: string
  description?: string
  fields?: FormField[]
  persona?: Partial<Persona>
  appearance?: Partial<Appearance>
}

/** Pre-built agent template with default configuration */
export interface Template {
  id: string
  name: string
  description: string
  tags?: string[]
  /** Default form fields for the template */
  defaultConfig?: TemplateDefaultConfig
  version?: number
  createdAt?: string
  updatedAt?: string
  category?: string
}

/** Response from GET /api/templates */
export interface TemplatesListResponse {
  data: Template[]
}

/** Request body for POST /api/agents/clone */
export interface CloneTemplateRequest {
  templateId: string
  userId?: string
  overrides?: {
    name?: string
    description?: string
  }
}

/** Response from POST /api/agents/clone */
export interface CloneTemplateResponse {
  agent: {
    id: string
    name: string
    status: string
    [key: string]: unknown
  }
}
