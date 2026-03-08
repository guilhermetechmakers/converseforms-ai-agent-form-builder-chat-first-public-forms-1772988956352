import type { ToSSectionData } from '@/types/tos'

/**
 * Static Terms of Service sections for the ToS page.
 * Safe to replace with CMS/API data later; consumer must use (sections ?? []).map and Array.isArray checks.
 */
export const TOS_SECTIONS: ToSSectionData[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body:
      'Welcome to ConverseForms. These Terms of Service ("Terms") govern your access to and use of the ConverseForms platform, including our website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.',
  },
  {
    id: 'definitions',
    title: 'Definitions',
    body:
      'In these Terms: "ConverseForms," "we," "us," and "our" refer to the operator of the Service. "You" and "your" refer to the individual or entity using the Service. "Content" means any data, text, forms, configurations, or materials you submit or that are generated through the Service. "User" means any person or system that interacts with your published forms or agents.',
  },
  {
    id: 'usage-restrictions',
    title: 'Usage Restrictions',
    body:
      'You agree not to use the Service in any way that: (a) violates applicable laws or regulations; (b) infringes the rights of others; (c) involves spam, phishing, or deceptive practices; (d) attempts to gain unauthorized access to our systems or other accounts; (e) disrupts or degrades the Service; or (f) collects or processes personal data in violation of privacy laws. We may suspend or terminate access for breach of these restrictions.',
  },
  {
    id: 'billing-terms',
    title: 'Billing Terms',
    body:
      'Paid plans are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law or as stated in our billing policy. You are responsible for any taxes applicable to your use of the Service. We may change pricing with reasonable notice; continued use after the effective date constitutes acceptance. Failure to pay may result in suspension or termination of your account.',
  },
  {
    id: 'sla',
    title: 'SLA and Uptime',
    body:
      'We strive for high availability but do not guarantee uninterrupted access. Uptime targets, if any, are described in your plan or in a separate SLA document. The Service is provided "as is" and we disclaim warranties to the fullest extent permitted by law. Scheduled maintenance will be communicated where practicable.',
  },
  {
    id: 'liability',
    title: 'Liability Limitations',
    body:
      'To the maximum extent permitted by law, ConverseForms and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill. Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim. Some jurisdictions do not allow certain limitations; in such cases our liability is limited to the greatest extent permitted by law.',
  },
  {
    id: 'data-privacy',
    title: 'Data & Privacy',
    body:
      'Your use of the Service is also governed by our Privacy Policy. You are responsible for ensuring that your collection and processing of end-user data via the Service complies with applicable data protection laws. We process personal data as described in our Privacy Policy and in our data processing agreements where applicable.',
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    body:
      'We retain all rights in the Service, including our branding, software, and documentation. You retain ownership of your Content. By using the Service, you grant us a limited license to host, process, and display your Content as necessary to provide and improve the Service. You represent that you have the rights to provide such Content.',
  },
  {
    id: 'termination',
    title: 'Termination',
    body:
      'You may stop using the Service at any time. We may suspend or terminate your account or access for breach of these Terms, non-payment, or for any other reason with notice where practicable. Upon termination, your right to use the Service ceases. Provisions that by their nature should survive (e.g., liability limitations, indemnity) will survive.',
  },
  {
    id: 'modifications',
    title: 'Modifications',
    body:
      'We may modify these Terms from time to time. We will post the updated Terms on this page and update the "Last updated" date. For material changes, we may notify you by email or through the product. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms. If you do not agree, you must stop using the Service.',
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    body:
      'These Terms are governed by the laws of the jurisdiction in which ConverseForms operates, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction, except where prohibited.',
  },
  {
    id: 'acceptance-effective',
    title: 'Acceptance & Effective Date',
    body:
      'By creating an account, completing checkout, or otherwise using the Service, you indicate your acceptance of these Terms. The effective date of the current version is indicated in the version badge on this page. Acceptance may be required explicitly during signup or checkout where indicated.',
  },
  {
    id: 'contact',
    title: 'Contact Information',
    body:
      'For questions about these Terms of Service, please contact us at: legal@converseforms.example.com. For privacy-related inquiries, see our Privacy Policy and contact details there. For general support, visit our Help page or contact support@converseforms.example.com.',
  },
]

export const TOS_VERSION = '1.0'
export const TOS_LAST_UPDATED = '2025-03-01'
