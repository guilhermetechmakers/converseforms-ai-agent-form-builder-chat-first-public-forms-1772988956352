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
