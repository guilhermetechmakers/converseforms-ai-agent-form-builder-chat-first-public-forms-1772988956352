/**
 * Safe CSV/JSON export for admin tables.
 * Handles null/undefined and missing fields without throwing.
 */

function escapeCsvCell(value: unknown): string {
  if (value == null) return ''
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const safeRows = Array.isArray(rows) ? rows : []
  const header = columns.map((c) => escapeCsvCell(c.label)).join(',')
  const body = safeRows
    .map((row) =>
      columns.map((c) => escapeCsvCell(row[c.key])).join(',')
    )
    .join('\n')
  return `${header}\n${body}`
}

export function exportToJson<T>(rows: T[]): string {
  const safeRows = Array.isArray(rows) ? rows : []
  return JSON.stringify(safeRows, null, 2)
}
