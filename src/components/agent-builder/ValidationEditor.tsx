/**
 * Validation rules editor per field. Attach required, min/max length, regex, email, custom.
 * Runtime-safe: guards all array access.
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FormField, FieldValidation } from '@/types/agent'

const VALIDATION_TYPES: FieldValidation['type'][] = [
  'required',
  'email',
  'minLength',
  'maxLength',
  'pattern',
  'custom',
]

export interface ValidationEditorProps {
  field: FormField
  onChange: (validations: FieldValidation[]) => void
  disabled?: boolean
  className?: string
}

export function ValidationEditor({
  field,
  onChange,
  disabled = false,
  className,
}: ValidationEditorProps) {
  const list = Array.isArray(field?.validations) ? field.validations : []

  const updateAt = (index: number, patch: Partial<FieldValidation>) => {
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

  const addRule = () => {
    onChange([
      ...list,
      { type: 'required', message: 'This field is required' },
    ])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Validation rules</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRule}
          disabled={disabled}
          className="h-8 gap-1"
          aria-label="Add validation rule"
        >
          <Plus className="h-3 w-3" />
          Add rule
        </Button>
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground">No validation rules. Add one to enforce format or length.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((v, index) => (
            <li
              key={`${v.type}-${index}`}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/30 p-2"
            >
              <Select
                value={v.type}
                onValueChange={(val) => updateAt(index, { type: val as FieldValidation['type'] })}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALIDATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(v.type === 'minLength' || v.type === 'maxLength' || v.type === 'pattern') && (
                <Input
                  value={typeof v.value === 'string' || typeof v.value === 'number' ? String(v.value) : ''}
                  onChange={(e) => updateAt(index, { value: v.type === 'pattern' ? e.target.value : (e.target.value ? Number(e.target.value) : undefined) })}
                  placeholder={v.type === 'pattern' ? 'Regex' : 'Value'}
                  className="h-8 w-24"
                  disabled={disabled}
                />
              )}
              <Input
                value={v.message ?? ''}
                onChange={(e) => updateAt(index, { message: e.target.value })}
                placeholder="Error message"
                className="h-8 flex-1 min-w-0"
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeAt(index)}
                disabled={disabled}
                aria-label="Remove rule"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
