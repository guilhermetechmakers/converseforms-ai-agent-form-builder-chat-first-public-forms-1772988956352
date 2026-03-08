/**
 * Field list for Agent Builder. Add, edit, reorder form fields.
 * Runtime-safe: guards all array access.
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ValidationEditor } from './ValidationEditor'
import { ConditionalLogicEditor } from './ConditionalLogicEditor'
import type { FormField, FieldValidation } from '@/types/agent'
import { cn } from '@/lib/utils'

const FIELD_TYPES: FormField['type'][] = [
  'text',
  'email',
  'phone',
  'number',
  'select',
  'multiselect',
  'date',
  'textarea',
  'checkbox',
]

export interface FieldListProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
  disabled?: boolean
  className?: string
}

function generateId(): string {
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function FieldList({
  fields,
  onChange,
  disabled = false,
  className,
}: FieldListProps) {
  const list = Array.isArray(fields) ? fields : []
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const updateAt = (index: number, patch: Partial<FormField>) => {
    const next = [...list]
    const current = next[index]
    if (!current) return
    next[index] = { ...current, ...patch }
    onChange(next)
  }

  const removeAt = (index: number) => {
    const next = list.filter((_, i) => i !== index)
    onChange(next)
  }

  const addField = () => {
    onChange([
      ...list,
      {
        id: generateId(),
        type: 'text',
        label: 'New field',
        required: false,
      },
    ])
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return
    const next = [...list]
    const [item] = next.splice(from, 1)
    if (!item) return
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Form fields</CardTitle>
        <CardDescription>
          Define the fields your agent will collect. Order determines flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No fields yet. Add a field to get started.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={addField}
              disabled={disabled}
              aria-label="Add field"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add field
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {list.map((field, index) => (
                <li
                  key={field.id}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-card"
                >
                  <div className="flex shrink-0 items-center gap-1 pt-2">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={disabled || index === 0}
                      onClick={() => move(index, index - 1)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`field-label-${field.id}`}>Label</Label>
                        <Input
                          id={`field-label-${field.id}`}
                          value={field.label ?? ''}
                          onChange={(e) => updateAt(index, { label: e.target.value })}
                          placeholder="Field label"
                          disabled={disabled}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`field-type-${field.id}`}>Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(v) =>
                            updateAt(index, { type: v as FormField['type'] })
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger id={`field-type-${field.id}`} className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={field.required ?? false}
                          onChange={(e) => updateAt(index, { required: e.target.checked })}
                          disabled={disabled}
                          className="h-4 w-4 rounded border-border"
                        />
                        Required
                      </label>
                    </div>
                    <Collapsible
                      open={expandedId === field.id}
                      onOpenChange={(open) => setExpandedId(open ? field.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          aria-expanded={expandedId === field.id}
                        >
                          {expandedId === field.id ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          Validation &amp; conditions
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 space-y-3 border-t border-border pt-3">
                        <ValidationEditor
                          field={field}
                          onChange={(validations: FieldValidation[]) => updateAt(index, { validations })}
                          disabled={disabled}
                        />
                        <ConditionalLogicEditor
                          field={field}
                          allFields={list}
                          onChange={(conditionalLogic) => updateAt(index, { conditionalLogic })}
                          disabled={disabled}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeAt(index)}
                    disabled={disabled}
                    aria-label="Remove field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              onClick={addField}
              disabled={disabled}
              className="w-full transition-all hover:scale-[1.01]"
              aria-label="Add another field"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add field
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
