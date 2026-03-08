/**
 * Live preview: simulates how the agent will interact in the chat.
 * Shows welcome message and sample field prompts.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FormField, Persona, Appearance } from '@/types/agent'
import { MessageSquare } from 'lucide-react'

export interface LiveChatPreviewProps {
  agentName: string
  fields: FormField[]
  persona: Persona
  appearance?: Appearance
  className?: string
}

const SAMPLE_USER = 'Visitor'

export function LiveChatPreview({
  agentName,
  fields,
  persona,
  appearance,
  className,
}: LiveChatPreviewProps) {
  const name = agentName?.trim() || 'Agent'
  const welcomeMessage = appearance?.welcomeMessage ?? persona?.instructions?.slice(0, 80) ?? `Hi! I'm ${name}. How can I help?`
  const list = Array.isArray(fields) ? fields : []
  const firstFew = list.slice(0, 3)

  return (
    <Card className={cn('rounded-[10px] border border-border bg-card', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Chat preview
        </CardTitle>
        <CardDescription>
          How your agent will appear in the chat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <p className="font-medium text-muted-foreground mb-1">{name}</p>
          <p className="text-foreground">{welcomeMessage}</p>
        </div>
        {firstFew.length > 0 && (
          <>
            {(firstFew ?? []).map((f, i) => (
              <div key={f?.id ?? i} className="rounded-lg border border-border bg-background p-3 text-sm">
                <p className="font-medium text-muted-foreground mb-1">{SAMPLE_USER}</p>
                <p className="text-foreground italic">[Answer for: {f?.label ?? 'Field'}]</p>
              </div>
            ))}
            {list.length > 3 && (
              <p className="text-xs text-muted-foreground">+{list.length - 3} more fields</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
