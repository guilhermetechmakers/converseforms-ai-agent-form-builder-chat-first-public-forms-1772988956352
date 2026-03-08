import type { Template, TemplateDefaultConfig } from '@/types/template'

/**
 * Fallback templates when GET /api/templates returns empty.
 * Matches spec: Lead Capture, Demo Request, Support Triage.
 */
const leadCaptureConfig: TemplateDefaultConfig = {
  name: 'Lead Capture',
  description: 'Collect name, email, and company for B2B leads.',
  fields: [
    { id: 'field-name', type: 'text', label: 'Full name', required: true },
    { id: 'field-email', type: 'email', label: 'Email', required: true },
    { id: 'field-company', type: 'text', label: 'Company', required: false },
  ],
  persona: { tone: 'professional', instructions: 'Collect lead info politely and concisely.' },
  appearance: {},
}

const demoRequestConfig: TemplateDefaultConfig = {
  name: 'Demo Request',
  description: 'Schedule a product demo with qualified leads.',
  fields: [
    { id: 'field-name', type: 'text', label: 'Name', required: true },
    { id: 'field-email', type: 'email', label: 'Email', required: true },
    { id: 'field-company', type: 'text', label: 'Company', required: true },
    { id: 'field-date', type: 'date', label: 'Preferred demo date', required: false },
  ],
  persona: { tone: 'friendly', instructions: 'Help schedule a demo and answer basic product questions.' },
  appearance: {},
}

const supportTriageConfig: TemplateDefaultConfig = {
  name: 'Support Triage',
  description: 'Qualify support tickets with a short conversation.',
  fields: [
    { id: 'field-issue', type: 'textarea', label: 'Describe your issue', required: true },
    { id: 'field-email', type: 'email', label: 'Contact email', required: true },
    { id: 'field-priority', type: 'select', label: 'Urgency', required: false, options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ]},
  ],
  persona: { tone: 'helpful', instructions: 'Triage support requests and gather essential details.' },
  appearance: {},
}

export const defaultTemplates: Template[] = [
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    description: 'Collect name, email, and company. Perfect for B2B lead generation.',
    tags: ['Sales', 'B2B'],
    defaultConfig: leadCaptureConfig,
    version: 1,
    category: 'Sales',
  },
  {
    id: 'demo-request',
    name: 'Demo Request',
    description: 'Let visitors request a product demo. Capture contact and preference.',
    tags: ['Sales', 'Demo'],
    defaultConfig: demoRequestConfig,
    version: 1,
    category: 'Sales',
  },
  {
    id: 'support-triage',
    name: 'Support Triage',
    description: 'Qualify support tickets with a short conversation before routing.',
    tags: ['Support'],
    defaultConfig: supportTriageConfig,
    version: 1,
    category: 'Support',
  },
]
