/**
 * Help page data models and API contracts.
 * All array usage must be guarded with data ?? [] and Array.isArray().
 */

export interface FAQItem {
  id: string
  question: string
  answer: string
  createdAt?: string
}

export type ContactPriority = 'Low' | 'Medium' | 'High'

export interface ContactSubmission {
  id: string
  name?: string
  email: string
  subject: string
  message: string
  priority: ContactPriority
  attachmentUrl?: string
  createdAt: string
}

export interface DeveloperDocsLink {
  id: string
  title: string
  description: string
  url: string
}

export interface FaqsResponse {
  data?: FAQItem[] | null
}

export interface ContactSubmitResponse {
  success: boolean
  message?: string
  submission?: ContactSubmission
}

export interface ContactSubmitBody {
  name?: string
  email: string
  subject: string
  message: string
  priority: ContactPriority
  attachment?: File | null
}
