/**
 * Persona & instructions editor for Agent Builder.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Persona } from '@/types/agent'

export interface PersonaEditorProps {
  persona: Persona
  onChange: (persona: Persona) => void
  disabled?: boolean
  className?: string
}

export function PersonaEditor({
  persona,
  onChange,
  disabled = false,
  className,
}: PersonaEditorProps) {
  const value = persona ?? { tone: '', instructions: '', prohibitedTopics: [] }
  const prohibited = Array.isArray(value.prohibitedTopics) ? value.prohibitedTopics : []

  const update = (patch: Partial<Persona>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Persona & instructions</CardTitle>
        <CardDescription>
          Set the tone and behavior of your agent. Instructions guide how it responds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="persona-tone">Tone</Label>
          <Input
            id="persona-tone"
            value={value.tone ?? ''}
            onChange={(e) => update({ tone: e.target.value })}
            placeholder="e.g. Friendly, professional"
            disabled={disabled}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="persona-instructions">Instructions</Label>
          <Textarea
            id="persona-instructions"
            value={value.instructions ?? ''}
            onChange={(e) => update({ instructions: e.target.value })}
            placeholder="How should the agent respond? What should it avoid?"
            disabled={disabled}
            className="mt-1 min-h-[120px]"
          />
        </div>
        {prohibited.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Prohibited topics: {prohibited.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
