import type { Template } from '@/types/template'
import type { FormField, Persona, Appearance } from '@/types/agent'

/** Built-in templates when API returns empty. Used for Templates Library (page_014). */
export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    description: 'Collect name, email, and company. Perfect for B2B lead generation.',
    tags: ['Sales', 'B2B'],
    defaultConfig: {
      name: 'Lead Capture',
      description: 'Collect contact details from visitors.',
      fields: [
        { id: 'field-name', type: 'text', label: 'Full name', required: true },
        { id: 'field-email', type: 'email', label: 'Email', required: true },
        { id: 'field-company', type: 'text', label: 'Company', required: false },
      ] as FormField[],
      persona: { tone: 'Friendly and professional', instructions: 'Keep the conversation brief. Collect name, email, and company.' } as Persona,
      appearance: { welcomeMessage: "Hi! I'd love to learn a bit about you." } as Appearance,
    },
  },
  {
    id: 'demo-request',
    name: 'Demo Request',
    description: 'Qualify demo requests with role, company size, and use case.',
    tags: ['Sales', 'Demo'],
    defaultConfig: {
      name: 'Demo Request',
      description: 'Schedule a product demo.',
      fields: [
        { id: 'field-name', type: 'text', label: 'Name', required: true },
        { id: 'field-email', type: 'email', label: 'Email', required: true },
        { id: 'field-role', type: 'select', label: 'Role', required: true, options: [
          { value: 'developer', label: 'Developer' },
          { value: 'manager', label: 'Manager' },
          { value: 'executive', label: 'Executive' },
          { value: 'other', label: 'Other' },
        ]},
        { id: 'field-company', type: 'text', label: 'Company name', required: true },
        { id: 'field-use-case', type: 'textarea', label: 'What do you want to use this for?', required: false },
      ] as FormField[],
      persona: { tone: 'Professional and helpful', instructions: 'Guide the user through demo request. Explain next steps.' } as Persona,
      appearance: { welcomeMessage: "Interested in a demo? I'll collect a few details." } as Appearance,
    },
  },
  {
    id: 'support-triage',
    name: 'Support Triage',
    description: 'Qualify support tickets with issue type, priority, and description.',
    tags: ['Support'],
    defaultConfig: {
      name: 'Support Triage',
      description: 'Submit and triage support requests.',
      fields: [
        { id: 'field-email', type: 'email', label: 'Email', required: true },
        { id: 'field-issue-type', type: 'select', label: 'Issue type', required: true, options: [
          { value: 'bug', label: 'Bug' },
          { value: 'question', label: 'Question' },
          { value: 'feature', label: 'Feature request' },
          { value: 'other', label: 'Other' },
        ]},
        { id: 'field-priority', type: 'select', label: 'Priority', required: true, options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]},
        { id: 'field-description', type: 'textarea', label: 'Describe your issue', required: true },
      ] as FormField[],
      persona: { tone: 'Empathetic and clear', instructions: 'Help users describe their issue. Set expectations for response time.' } as Persona,
      appearance: { welcomeMessage: "I'm here to help. Tell me what's going on." } as Appearance,
    },
  },
]
