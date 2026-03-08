/**
 * Help page API: FAQs and contact submission.
 * Uses api from lib/api.ts. All responses guarded for null/undefined.
 */

import { api } from '@/lib/api'
import type {
  FaqsResponse,
  ContactSubmitResponse,
  ContactSubmitBody,
  FAQItem,
} from '@/types/help'

const FAQS_ENDPOINT = '/help/faqs'
const CONTACT_ENDPOINT = '/help/contact'

/**
 * Fetch FAQs. Returns empty array if endpoint fails or data is missing.
 * Callers must use: const faqs = (data ?? []); Array.isArray(faqs) ? faqs : []
 */
export async function getFaqs(): Promise<FAQItem[]> {
  try {
    const response = await api.get<FaqsResponse>(FAQS_ENDPOINT)
    const data = response?.data ?? null
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Submit contact form. Sends JSON body; attachment upload not implemented in stub.
 * Returns response with success flag; handle errors in UI.
 */
export async function submitContact(
  body: Omit<ContactSubmitBody, 'attachment'> & { attachment?: string | null }
): Promise<ContactSubmitResponse> {
  try {
    const response = await api.post<ContactSubmitResponse>(CONTACT_ENDPOINT, {
      name: body.name ?? undefined,
      email: body.email,
      subject: body.subject,
      message: body.message,
      priority: body.priority,
      attachmentUrl: body.attachment ?? undefined,
    })
    return {
      success: response?.success ?? false,
      message: response?.message,
      submission: response?.submission,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Submission failed',
    }
  }
}
