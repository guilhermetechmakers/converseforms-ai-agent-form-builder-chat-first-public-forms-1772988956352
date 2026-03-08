/**
 * Inline tips: contextual best-practice suggestions that update in real time.
 * Supports tab-based tips (when activeTab is set) or field-context tips.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BuilderTab = 'fields' | 'persona' | 'appearance' | 'context'

export interface InlineTipsProps {
  /** When set, show tips for this tab. Otherwise use field-context tips. */
  activeTab?: BuilderTab
  /** For field-context tips when activeTab is not used */
  hasEmailField?: boolean
  fieldCount?: number
  hasRequiredFields?: boolean
  className?: string
}

const TAB_TIPS: Record<BuilderTab, string[]> = {
  fields: [
    'Ask for email early if you need it for follow-up.',
    'Keep the number of required fields minimal to improve completion rate.',
    'Use clear, short labels so visitors know what to enter.',
  ],
  persona: [
    'Set a consistent tone (e.g. professional, friendly) so the agent feels predictable.',
    'Add instructions for how to handle off-topic or unclear answers.',
  ],
  appearance: [
    'Use a primary color that matches your brand for the chat UI.',
    'A short welcome message helps visitors know what to expect.',
  ],
  context: [
    'Attach FAQs or product info so the agent can answer common questions.',
    'Keep knowledge snippets concise for better LLM responses.',
  ],
}

const FIELD_TIPS: { condition: (ctx: { hasEmailField?: boolean; fieldCount?: number; hasRequiredFields?: boolean }) => boolean; message: string }[] = [
  {
    condition: (ctx) => (ctx.fieldCount ?? 0) === 0,
    message: 'Add at least one field so your agent can collect information.',
  },
  {
    condition: (ctx) => (ctx.fieldCount ?? 0) > 0 && !ctx.hasEmailField,
    message: 'Consider adding an email field early in the flow for follow-up.',
  },
  {
    condition: (ctx): boolean => (ctx.fieldCount ?? 0) > 0 && Boolean(ctx.hasEmailField) && !Boolean(ctx.hasRequiredFields),
    message: 'Mark key fields as required to improve completion rates.',
  },
  {
    condition: (ctx): boolean => (ctx.fieldCount ?? 0) > 0 && Boolean(ctx.hasRequiredFields),
    message: 'Tip: Keep the field order logical (e.g. name → email → details).',
  },
]

export function InlineTips({
  activeTab,
  hasEmailField = false,
  fieldCount = 0,
  hasRequiredFields = false,
  className,
}: InlineTipsProps) {
  if (activeTab != null && activeTab in TAB_TIPS) {
    const tips = TAB_TIPS[activeTab] ?? []
    const list = Array.isArray(tips) ? tips : []
    if (list.length === 0) return null
    return (
      <Card className={cn('rounded-lg border-accent/20 bg-accent/5', className)}>
        <CardHeader className="pb-2">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lightbulb className="h-4 w-4 text-accent" aria-hidden />
            Tips
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {list.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  const ctx = { hasEmailField, fieldCount, hasRequiredFields }
  const tip = FIELD_TIPS.find((t) => t.condition(ctx)) ?? FIELD_TIPS[FIELD_TIPS.length - 1]
  const message = tip?.message ?? 'Configure fields, persona, and appearance to match your use case.'

  return (
    <Card className={cn('rounded-lg border-accent/30 bg-accent/5', className)}>
      <CardContent className="flex items-start gap-3 p-3">
        <Lightbulb className="h-5 w-5 shrink-0 text-accent" aria-hidden />
        <p className="text-sm text-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}
