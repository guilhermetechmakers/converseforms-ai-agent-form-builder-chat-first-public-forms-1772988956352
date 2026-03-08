import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExtractedField, FieldDefinitionWithValue } from '@/types/session'

type FieldSource = 'user' | 'extracted' | 'validated'
type ValidationStatus = 'valid' | 'invalid' | 'pending' | 'error'

interface FieldRow {
  key: string
  value: string
  validated?: boolean
  source?: FieldSource
  timestamp?: string
  validationStatus?: ValidationStatus
  errorCode?: string
  message?: string
}

export interface StructuredFieldsPanelProps {
  /** From session.extractedFields, session.structuredFields, or FieldDefinitionWithValue[] */
  fields?:
    | ExtractedField[]
    | FieldDefinitionWithValue[]
    | Record<string, string | number | boolean | null>
  editable?: boolean
  onSaveAnnotation?: (fieldId: string, value: string) => void
  /** Show filter/sort controls for validation status */
  showFilterSort?: boolean
  className?: string
}

function isExtractedFieldArray(
  f: ExtractedField[] | FieldDefinitionWithValue[] | Record<string, string | number | boolean | null>
): f is ExtractedField[] {
  return Array.isArray(f)
}

function isFieldDefinitionArray(
  f: ExtractedField[] | FieldDefinitionWithValue[] | Record<string, string | number | boolean | null>
): f is FieldDefinitionWithValue[] {
  return Array.isArray(f) && f.length > 0 && 'validationStatus' in (f[0] ?? {})
}

/** Key-value grid for extracted/structured fields. Optional inline edit, status badges, filter/sort. */
export function StructuredFieldsPanel({
  fields,
  editable = false,
  onSaveAnnotation,
  showFilterSort = false,
  className,
}: StructuredFieldsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'key' | 'timestamp' | 'status'>('key')

  const rows: FieldRow[] = useMemo(() => {
    const out: FieldRow[] = []
    if (fields == null) return out
    if (isFieldDefinitionArray(fields)) {
      const list = (fields as FieldDefinitionWithValue[]) ?? []
      list.forEach((item) => {
        out.push({
          key: item.label ?? item.fieldId ?? '—',
          value: Array.isArray(item.value) ? item.value.join(', ') : String(item.value ?? ''),
          validated: item.validationStatus === 'valid',
          source: item.source,
          timestamp: item.timestamp,
          validationStatus: item.validationStatus,
        })
      })
    } else if (isExtractedFieldArray(fields)) {
      const list = (fields as ExtractedField[]) ?? []
      list.forEach((item) => {
        out.push({
          key: item.label ?? item.fieldId ?? '—',
          value: Array.isArray(item.value) ? item.value.join(', ') : String(item.value ?? ''),
          validated: item.validated,
          source: item.source,
          timestamp: item.timestamp,
          validationStatus: item.validationStatus,
          errorCode: item.errorCode,
          message: item.message,
        })
      })
    } else {
      const obj = fields as Record<string, string | number | boolean | null>
      Object.entries(obj).forEach(([k, v]) => {
        out.push({
          key: k,
          value: v == null ? '' : String(v),
        })
      })
    }
    return out
  }, [fields])

  const handleStartEdit = (key: string, value: string) => {
    setEditingId(key)
    setEditValue(value)
  }

  const handleSave = () => {
    if (editingId && onSaveAnnotation) {
      onSaveAnnotation(editingId, editValue)
      setEditingId(null)
      setEditValue('')
    }
  }

  const filteredAndSortedRows = useMemo(() => {
    let list = [...rows]
    if (statusFilter !== 'all') {
      list = list.filter((r) => (r.validationStatus ?? (r.validated ? 'valid' : undefined)) === statusFilter)
    }
    if (sortBy === 'timestamp') {
      list.sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''))
    } else if (sortBy === 'status') {
      const order = { valid: 0, pending: 1, invalid: 2, error: 3 }
      list.sort(
        (a, b) =>
          (order[(a.validationStatus as keyof typeof order) ?? 'pending'] ?? 4) -
          (order[(b.validationStatus as keyof typeof order) ?? 'pending'] ?? 4)
      )
    } else {
      list.sort((a, b) => a.key.localeCompare(b.key))
    }
    return list
  }, [rows, statusFilter, sortBy])

  const statusBadgeVariant = (s?: ValidationStatus) => {
    switch (s) {
      case 'valid':
        return 'success'
      case 'invalid':
      case 'error':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">Extracted fields</CardTitle>
        <CardDescription>Structured data from this session with validation status</CardDescription>
        {showFilterSort && filteredAndSortedRows.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="invalid">Invalid</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'key' | 'timestamp' | 'status')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="key">Field name</SelectItem>
                <SelectItem value="timestamp">Timestamp</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredAndSortedRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No structured fields collected.</p>
        ) : (
          <div className="space-y-2">
            {(filteredAndSortedRows ?? []).map((row) => (
              <div
                key={row.key}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2 transition-shadow hover:shadow-sm"
              >
                <span className="text-sm font-medium text-foreground w-24 shrink-0">
                  {row.key}
                </span>
                {editable && editingId === row.key ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                      aria-label={`Edit ${row.key}`}
                    />
                    <Button size="icon" variant="ghost" onClick={handleSave} aria-label="Save">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground flex-1 break-all">
                      {row.value || '—'}
                    </span>
                    {(row.validationStatus ?? (row.validated !== undefined ? (row.validated ? 'valid' : 'invalid') : undefined)) && (
                      <Badge
                        variant={statusBadgeVariant(
                          (row.validationStatus ?? (row.validated ? 'valid' : 'invalid')) as ValidationStatus
                        )}
                        className="shrink-0 text-xs"
                      >
                        {row.validationStatus === 'valid' || (row.validated === true && !row.validationStatus)
                          ? 'Valid'
                          : row.validationStatus === 'invalid'
                            ? 'Invalid'
                            : row.validationStatus === 'error'
                              ? 'Error'
                              : row.validationStatus === 'pending'
                                ? 'Pending'
                                : row.validated === false
                                  ? 'Invalid'
                                  : '—'}
                      </Badge>
                    )}
                    {row.source && (
                      <span className="text-xs text-muted-foreground shrink-0" title="Source">
                        {row.source}
                      </span>
                    )}
                    {row.timestamp && (
                      <span className="text-xs text-muted-foreground shrink-0">{row.timestamp}</span>
                    )}
                    {(row.message ?? row.errorCode) && (
                      <p className="w-full text-xs text-muted-foreground mt-1" title={row.errorCode}>
                        {row.message ?? row.errorCode}
                      </p>
                    )}
                    {editable && onSaveAnnotation && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(row.key, row.value)}
                        aria-label={`Edit ${row.key}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
