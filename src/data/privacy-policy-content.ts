import type { PolicySection } from '@/types/privacy'

/**
 * Static privacy policy sections for the Privacy Policy page.
 * Safe to replace with CMS/API data later; consumer must use (sections ?? []).map and Array.isArray checks.
 */
export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'data-collection',
    title: 'Data we collect',
    body:
      'ConverseForms collects the following categories of data to operate and improve the service:',
    subpoints: [
      'Account data: email address, name, and authentication credentials you provide when signing up or updating your profile.',
      'Form and agent data: form definitions, field configurations, AI agent settings, and published form metadata you create.',
      'Session and message data: conversation transcripts, user messages, and extracted form responses from chat sessions.',
      'Usage and analytics: product usage events, feature adoption, and aggregated metrics to improve reliability and UX.',
      'Cookies and similar technologies: session and preference cookies as described in the Cookies section.',
    ],
  },
  {
    id: 'how-we-use-data',
    title: 'How we use data',
    body: 'We use the data we collect to:',
    subpoints: [
      'Provide, operate, and maintain the ConverseForms platform and your forms and agents.',
      'Process conversations and extract structured form data in line with your configuration.',
      'Send you service-related notifications, security alerts, and support responses.',
      'Improve our product, fix issues, and develop new features using aggregated and anonymized insights.',
      'Comply with legal obligations and enforce our terms and policies.',
    ],
  },
  {
    id: 'data-sharing-processors',
    title: 'Data sharing and third-party processors',
    body:
      'We do not sell your personal data. We may share data with service providers who process it on our behalf (e.g., hosting, analytics, email delivery). These processors are bound by data processing agreements and use data only as we instruct. We may disclose data when required by law or to protect rights and safety.',
  },
  {
    id: 'data-retention',
    title: 'Data retention',
    body:
      'We retain your data for as long as your account is active and as needed to provide the service. Session and message data are retained according to your plan settings. You may request deletion of your account and associated data at any time; we will process deletion requests within 30 days unless a longer retention is required by law.',
  },
  {
    id: 'data-security',
    title: 'Data security',
    body:
      'We implement technical and organizational measures to protect your data, including encryption in transit and at rest, access controls, and regular security assessments. No method of transmission or storage is 100% secure; we encourage you to use strong credentials and keep them confidential.',
  },
  {
    id: 'user-rights',
    title: 'Your rights',
    body:
      'Depending on your location, you may have the right to access, correct, export, or delete your personal data, object to or restrict certain processing, and withdraw consent where applicable. To exercise these rights, use the Request Data Export or Request Data Deletion actions below or contact us as set out in the Contact section.',
    subpoints: [
      'Access: request a copy of the personal data we hold about you.',
      'Correction: request correction of inaccurate or incomplete data.',
      'Export: request a portable copy of your data (see Data Export Procedure).',
      'Deletion: request erasure of your data and account (see Data Deletion Procedure).',
    ],
  },
  {
    id: 'opt-out',
    title: 'Opt-out options',
    body:
      'You can opt out of non-essential processing in the following ways:',
    subpoints: [
      'Marketing communications: use the unsubscribe link in any marketing email or adjust preferences in your account.',
      'Analytics and non-essential cookies: use our cookie preferences or browser settings to limit tracking where we offer that choice.',
      'Other non-essential data use: contact us using the details in the Contact section to state your preferences.',
    ],
  },
  {
    id: 'export-procedure',
    title: 'Data export procedure',
    body:
      'Account owners may request a copy of their data. To do so: (1) Click "Request Data Export" below or contact the Data Protection Officer. (2) We will verify your identity (e.g., via the email associated with your account). (3) We will provide a portable copy of your data within 30 days, subject to applicable law. For large volumes we may extend this period and will inform you.',
  },
  {
    id: 'deletion-procedure',
    title: 'Data deletion procedure',
    body:
      'Account owners may request deletion of their account and associated data. To do so: (1) Click "Request Data Deletion" below or contact the Data Protection Officer. (2) We will verify your identity. (3) We will process the deletion within 30 days and confirm when complete. Some data may be retained where required by law (e.g., tax, legal claims).',
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body:
      'We use session cookies to keep you logged in and preference cookies to remember your settings. We may use analytics cookies to understand how the product is used; you can control non-essential cookies via your browser or our cookie preferences when available.',
  },
  {
    id: 'policy-changes',
    title: 'Changes to this policy',
    body:
      'We may update this privacy policy from time to time. We will post the updated policy on this page and update the "Last updated" date. For material changes, we may notify you by email or through the product. Continued use of the service after the effective date constitutes acceptance of the updated policy.',
  },
]

export const PRIVACY_POLICY_LAST_UPDATED = '2025-03-01'

export const PRIVACY_CONTACT = {
  contactName: 'Privacy / Data Protection Officer',
  email: 'privacy@converseforms.example.com',
  phone: null as string | null,
  address: null as string | null,
}
