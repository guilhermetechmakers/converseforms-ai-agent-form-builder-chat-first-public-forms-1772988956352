import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExtractedField } from '@/types/session'

export interface StructuredFieldsPanelProps {
  /** From session.extractedFields or session.structuredFields (key-value) */
  fields?: ExtractedField[] | Record<string, string | number | boolean | null>
  editable?: boolean
  onSaveAnnotation?: (fieldId: string, value: string) => void
  className?: string
}

function isExtractedFieldArray(
  f: ExtractedField[] | Record<string, string | number | boolean | null>
): f is ExtractedField[] {
  return Array.isArray(f)
}

/** Key-value grid for extracted/structured fields. Optional inline edit with audit. */
export function StructuredFieldsPanel({
  fields,
  editable = false,
  onSaveAnnotation,
  className,
}: StructuredFieldsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const rows: { key: string; value: string; validated?: boolean }[] = []
  if (fields == null) {
    // no-op
  } else if (isExtractedFieldArray(fields)) {
    const list = (fields as ExtractedField[]) ?? []
    list.forEach((item) => {
      rows.push({
        key: item.label ?? item.fieldId ?? '—',
        value: Array.isArray(item.value) ? item.value.join(', ') : String(item.value ?? ''),
        validated: item.validated,
      })
    })
  } else {
    const obj = fields as Record<string, string | number | boolean | null>
    Object.entries(obj).forEach(([k, v]) => {
      rows.push({
        key: k,
        value: v == null ? '' : String(v),
      })
    })
  }

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

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Structured fields</CardTitle>
        <CardDescription>Extracted data from this session</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No structured fields collected.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2"
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
                    {row.validated !== undefined && (
                      <span
                        className={cn(
                          'text-xs',
                          row.validated ? 'text-success' : 'text-muted-foreground'
                        )}
                      >
                        {row.validated ? 'Valid' : '—'}
                      </span>
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
