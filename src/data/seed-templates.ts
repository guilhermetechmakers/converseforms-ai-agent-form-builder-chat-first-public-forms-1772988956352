import type { Template } from '@/types/template'
import type { FormField } from '@/types/agent'

/** Default templates shown when API returns empty or for fallback (Lead Capture, Demo Request, Support Triage). */
export const SEED_TEMPLATES: Template[] = [
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    description: 'Collect name, email, and company. Perfect for B2B and landing pages.',
    defaultConfig: {
      fields: [
        { id: 'field-1', type: 'text', label: 'Full name', required: true },
        { id: 'field-2', type: 'email', label: 'Email', required: true },
        { id: 'field-3', type: 'text', label: 'Company', required: false },
      ] as FormField[],
      persona: { tone: 'Friendly, professional', instructions: 'Collect contact details for follow-up.' },
    },
    version: 1,
  },
  {
    id: 'demo-request',
    name: 'Demo Request',
    description: 'Qualify leads and schedule demos with a short conversational form.',
    defaultConfig: {
      fields: [
        { id: 'field-1', type: 'text', label: 'Name', required: true },
        { id: 'field-2', type: 'email', label: 'Work email', required: true },
        { id: 'field-3', type: 'select', label: 'Company size', required: true, options: [
          { value: '1-10', label: '1–10' },
          { value: '11-50', label: '11–50' },
          { value: '51-200', label: '51–200' },
          { value: '200+', label: '200+' },
        ]},
        { id: 'field-4', type: 'textarea', label: 'What are you looking to solve?', required: false },
      ] as FormField[],
      persona: { tone: 'Consultative', instructions: 'Help qualify interest and book a demo.' },
    },
    version: 1,
  },
  {
    id: 'support-triage',
    name: 'Support Triage',
    description: 'Qualify support tickets with a short conversation and route to the right team.',
    defaultConfig: {
      fields: [
        { id: 'field-1', type: 'email', label: 'Email', required: true },
        { id: 'field-2', type: 'select', label: 'Category', required: true, options: [
          { value: 'technical', label: 'Technical issue' },
          { value: 'billing', label: 'Billing' },
          { value: 'feature', label: 'Feature request' },
          { value: 'other', label: 'Other' },
        ]},
        { id: 'field-3', type: 'textarea', label: 'Describe your issue', required: true },
      ] as FormField[],
      persona: { tone: 'Helpful, empathetic', instructions: 'Triage support requests and set expectations.' },
    },
    version: 1,
  },
]
