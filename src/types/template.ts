import type { Agent } from './agent'

export interface Template {
  id: string
  name: string
  description: string
  tags: string[]
  previewImageUrl?: string
  agentSnapshot: Partial<Agent>
  category?: string
}
