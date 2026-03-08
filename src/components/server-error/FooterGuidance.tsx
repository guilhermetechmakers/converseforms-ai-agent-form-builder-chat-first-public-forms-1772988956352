import { Clock, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const GUIDANCE_ITEMS: { icon: React.ReactNode; text: string }[] = [
  { icon: <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />, text: 'Try again in a moment.' },
  {
    icon: <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />,
    text: 'If the issue persists, contact support.',
  },
]

export interface FooterGuidanceProps {
  className?: string
}

/**
 * Minimal secondary guidance: retry hint and support hint.
 */
export function FooterGuidance({ className }: FooterGuidanceProps) {
  const items = Array.isArray(GUIDANCE_ITEMS) ? GUIDANCE_ITEMS : []

  return (
    <ul
      className={cn('flex flex-col gap-2 text-sm text-muted-foreground', className)}
      role="list"
      aria-label="What to do next"
    >
      {(items ?? []).map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          {item?.icon}
          <span>{item?.text ?? ''}</span>
        </li>
      ))}
    </ul>
  )
}
