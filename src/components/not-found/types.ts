/**
 * Types for 404 Not Found page. Used for quick links and optional search results.
 * All array usage is guarded with (data ?? []) or Array.isArray() for runtime safety.
 */

export interface QuickLink {
  id: string
  label: string
  href: string
}

export interface SearchResult {
  id: string
  title: string
  snippet?: string
  href: string
}

/** Static quick links for the 404 page. No API required. */
export const QUICK_LINKS: QuickLink[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'help', label: 'Help', href: '/help' },
  { id: 'contact', label: 'Contact Support', href: '/help#contact' },
]

/** Static pages for client-side search suggestions. Guard with Array.isArray when consuming. */
export const SEARCH_INDEX: SearchResult[] = [
  { id: '1', title: 'Home', snippet: 'Landing page', href: '/' },
  { id: '2', title: 'Dashboard', snippet: 'Your agents and sessions', href: '/dashboard' },
  { id: '3', title: 'Help', snippet: 'FAQs and support', href: '/help' },
  { id: '4', title: 'Templates', snippet: 'Form templates', href: '/templates' },
  { id: '5', title: 'Privacy', snippet: 'Privacy policy', href: '/privacy' },
  { id: '6', title: 'Terms', snippet: 'Terms of service', href: '/terms' },
]
