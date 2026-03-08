/**
 * Appearance settings editor for Agent Builder (avatar, colors, welcome message).
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Appearance } from '@/types/agent'

export interface AppearanceEditorProps {
  appearance: Appearance
  onChange: (appearance: Appearance) => void
  disabled?: boolean
  className?: string
}

export function AppearanceEditor({
  appearance,
  onChange,
  disabled = false,
  className,
}: AppearanceEditorProps) {
  const value = appearance ?? {}

  const update = (patch: Partial<Appearance>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize colors, avatar, and welcome message for the chat experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="appearance-primaryColor">Primary color</Label>
          <div className="mt-1 flex gap-2">
            <input
              id="appearance-primaryColor"
              type="color"
              value={value.primaryColor ?? '#2563eb'}
              onChange={(e) => update({ primaryColor: e.target.value })}
              disabled={disabled}
              className="h-10 w-14 cursor-pointer rounded border border-border"
              aria-label="Primary color"
            />
            <Input
              value={value.primaryColor ?? ''}
              onChange={(e) => update({ primaryColor: e.target.value })}
              placeholder="#2563eb"
              disabled={disabled}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="appearance-avatarUrl">Avatar URL</Label>
          <Input
            id="appearance-avatarUrl"
            value={value.avatarUrl ?? ''}
            onChange={(e) => update({ avatarUrl: e.target.value })}
            placeholder="https://..."
            disabled={disabled}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="appearance-welcomeMessage">Welcome message</Label>
          <Textarea
            id="appearance-welcomeMessage"
            value={value.welcomeMessage ?? ''}
            onChange={(e) => update({ welcomeMessage: e.target.value })}
            placeholder="First message the user sees..."
            disabled={disabled}
            className="mt-1 min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}
