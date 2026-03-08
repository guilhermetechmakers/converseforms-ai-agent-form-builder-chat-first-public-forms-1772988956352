import type { ReactNode } from 'react'

/**
 * Single section of Terms of Service (or other policy) content.
 * Used for data-driven rendering with optional subsections.
 */
export interface ToSSectionData {
  id: string
  title: string
  body: string | ReactNode
  depth?: number
  subsections?: ToSSectionData[]
}

/**
 * Policy content payload (e.g. from API or static data).
 * Consumer must use (sections ?? []) and Array.isArray checks.
 */
export interface PolicyContent {
  version: string
  lastUpdated: string
  sections: ToSSectionData[]
}

/**
 * API contract placeholder for GET /api/policies/tos
 * Response: { version, lastUpdated, sections } | { error }
 */
export interface TosPolicyApiResponse {
  version: string
  lastUpdated: string
  sections: ToSSectionData[]
}

/**
 * API contract placeholder for GET /api/policies/tos/latest
 * Response: { version, lastUpdated } | { error }
 */
export interface TosLatestApiResponse {
  version: string
  lastUpdated: string
}
