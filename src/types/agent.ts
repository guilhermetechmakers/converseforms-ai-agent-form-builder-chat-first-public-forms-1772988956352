export type AgentStatus = 'draft' | 'published' | 'archived'

export interface FieldValidation {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: string | number
  message?: string
}

export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'multiselect' | 'date' | 'textarea'
  label: string
  placeholder?: string
  required: boolean
  validations?: FieldValidation[]
  options?: { value: string; label: string }[]
  conditionalLogic?: {
    fieldId: string
    operator: 'equals' | 'notEquals' | 'contains'
    value: string
  }
}

export interface Persona {
  tone: string
  instructions: string
  prohibitedTopics?: string[]
}

export interface Appearance {
  primaryColor?: string
  avatarUrl?: string
  welcomeMessage?: string
}

export interface Agent {
  id: string
  name: string
  description?: string
  fields: FormField[]
  persona: Persona
  appearance: Appearance
  status: AgentStatus
  publicSlug?: string
  createdAt: string
  updatedAt: string
  userId: string
  /** Owner user id (alias for list APIs) */
  ownerId?: string
  /** Organization id when scoped to org */
  orgId?: string
  /** Avatar/thumbnail URL */
  avatarUrl?: string
  /** Number of sessions for this agent */
  sessionCount?: number
  /** Last activity timestamp (ISO) */
  lastActivityAt?: string
  /** Whether current user can edit */
  canEdit?: boolean
}

/** Query params for listing agents */
export interface AgentListParams {
  ownerId?: string
  orgId?: string
  status?: 'draft' | 'published' | 'archived' | 'all'
  search?: string
  sort?: 'lastActivity' | 'sessionCount' | 'name'
  page?: number
  pageSize?: number
}

/** Paginated list response */
export interface AgentListResponse {
  data: Agent[]
  total: number
}

export interface CreateAgentInput {
  name: string
  description?: string
  fields?: FormField[]
  persona?: Persona
  appearance?: Appearance
}

export interface UpdateAgentInput {
  name?: string
  description?: string
  fields?: FormField[]
  persona?: Persona
  appearance?: Appearance
  status?: AgentStatus
}
