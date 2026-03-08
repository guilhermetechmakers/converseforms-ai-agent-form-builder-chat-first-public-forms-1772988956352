import type { Template } from '@/types/template'
import type { FormField } from '@/types/agent'

/** Default templates shown when API returns empty (Lead Capture, Demo Request, Support Triage) */
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    description:
      'Collect name, email, company, and role. Perfect for B2B lead generation and contact forms.',
    version: 1,
    defaultConfig: {
      fields: [
        { id: 'name', type: 'text', label: 'Full name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'company', type: 'text', label: 'Company', required: false },
        { id: 'role', type: 'text', label: 'Job role', required: false },
      ] as FormField[],
      persona: { tone: 'professional', instructions: 'Be concise and friendly.' },
    },
  },
  {
    id: 'demo-request',
    name: 'Demo Request',
    description:
      'Qualify demo requests with company size, use case, and timeline. Ideal for sales teams.',
    version: 1,
    defaultConfig: {
      fields: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Work email', required: true },
        { id: 'company', type: 'text', label: 'Company name', required: true },
        { id: 'company_size', type: 'select', label: 'Company size', required: false, options: [{ value: '1-10', label: '1–10' }, { value: '11-50', label: '11–50' }, { value: '51-200', label: '51–200' }, { value: '201+', label: '201+' }] },
        { id: 'use_case', type: 'textarea', label: 'What do you want to learn?', required: false },
      ] as FormField[],
      persona: { tone: 'helpful', instructions: 'Guide them to book a demo.' },
    },
  },
  {
    id: 'support-triage',
    name: 'Support Triage',
    description:
      'Qualify support tickets with issue type, priority, and description. Great for customer success.',
    version: 1,
    defaultConfig: {
      fields: [
        { id: 'name', type: 'text', label: 'Your name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'issue_type', type: 'select', label: 'Issue type', required: true, options: [{ value: 'bug', label: 'Bug' }, { value: 'question', label: 'Question' }, { value: 'feature', label: 'Feature request' }] },
        { id: 'description', type: 'textarea', label: 'Describe your issue', required: true },
      ] as FormField[],
      persona: { tone: 'empathetic', instructions: 'Acknowledge the issue and collect enough detail for support.' },
    },
  },
]
