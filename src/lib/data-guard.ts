/**
 * DataGuard utilities: normalize API responses and guard against null/undefined.
 * Use data ?? [], Array.isArray checks, and safe defaults for all list/object access.
 */

/**
 * Safe array from API response. Returns empty array if data is null, undefined, or not an array.
 */
export function asArray<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : []
}

/**
 * Safe value with default.
 */
export function asString(value: string | null | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

/**
 * Safe number with default.
 */
export function asNumber(value: number | null | undefined, fallback = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback
}

/**
 * Normalize paginated/array API response: { data: T[] } -> T[]
 */
export function normalizeListResponse<T>(response: { data?: T[] | null } | null | undefined): T[] {
  const data = response?.data
  return Array.isArray(data) ? data : []
}

/**
 * Normalize single-object API response: { data: T } -> T | null
 */
export function normalizeDataResponse<T>(response: { data?: T | null } | null | undefined): T | null {
  const data = response?.data
  return data != null ? data : null
}

/**
 * Destructure with safe defaults for response shape.
 */
export function withDefaults<T extends Record<string, unknown>>(
  response: T | null | undefined,
  defaults: Partial<T> = {}
): T {
  const base = response ?? ({} as T)
  return { ...defaults, ...base } as T
}
