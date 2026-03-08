/**
 * Conditional logic: show/hide field based on another field's value.
 * Runtime-safe: guards optional fields.
 */

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FormField } from '@/types/agent'

export interface ConditionalLogicEditorProps {
  field: FormField
  allFields: FormField[]
  onChange: (conditionalLogic: FormField['conditionalLogic']) => void
  disabled?: boolean
  className?: string
}

const OPERATORS: { value: 'equals' | 'notEquals' | 'contains'; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
]

export function ConditionalLogicEditor({
  field,
  allFields,
  onChange,
  disabled = false,
  className,
}: ConditionalLogicEditorProps) {
  const logic = field?.conditionalLogic ?? null
  const otherFields = (allFields ?? []).filter((f) => f?.id && f.id !== field?.id)

  const setFieldId = (fieldId: string) => {
    onChange(logic ? { ...logic, fieldId } : { fieldId, operator: 'equals', value: '' })
  }
  const setOperator = (operator: 'equals' | 'notEquals' | 'contains') => {
    onChange(logic ? { ...logic, operator } : { fieldId: '', operator, value: '' })
  }
  const setValue = (value: string) => {
    onChange(logic ? { ...logic, value } : { fieldId: '', operator: 'equals', value })
  }
  const clear = () => onChange(undefined)

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Conditional visibility</CardTitle>
        <CardDescription>
          Show this field only when another field matches a value.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {otherFields.length === 0 ? (
          <p className="text-xs text-muted-foreground">Add at least one other field to use conditions.</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <Label className="text-xs">When field</Label>
                <Select
                  value={logic?.fieldId ?? ''}
                  onValueChange={setFieldId}
                  disabled={disabled}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherFields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label ?? f.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Operator</Label>
                <Select
                  value={logic?.operator ?? 'equals'}
                  onValueChange={(v) => setOperator(v as 'equals' | 'notEquals' | 'contains')}
                  disabled={disabled}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Value</Label>
                <Input
                  value={logic?.value ?? ''}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Value"
                  className="mt-1 h-8"
                  disabled={disabled}
                />
              </div>
            </div>
            {logic?.fieldId && (
              <button
                type="button"
                onClick={clear}
                disabled={disabled}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear condition
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
