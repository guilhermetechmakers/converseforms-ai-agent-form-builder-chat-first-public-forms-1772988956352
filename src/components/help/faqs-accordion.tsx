import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Search, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQItem } from '@/types/help'

interface FAQsAccordionProps {
  faqs?: FAQItem[] | null
  className?: string
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'What is an AI form-agent?',
    answer:
      'An AI form-agent is a conversational interface that collects structured data (like a form) through natural dialogue. You define fields and validations; the agent asks questions, validates answers, and produces a structured submission. It combines the flexibility of chat with the reliability of form data.',
  },
  {
    id: '2',
    question: 'How do I get a public link for my agent?',
    answer:
      'After creating your agent and configuring its fields and persona, go to the Publish step in the dashboard. Click Publish to generate a unique public URL (e.g. /chat/your-agent-slug). Share this link anywhere; no login is required for respondents.',
  },
  {
    id: '3',
    question: 'What data is collected and where is it stored?',
    answer:
      'We store the field values you define (e.g. name, email, company), the conversation transcript for the session, and metadata (timestamps, IP if enabled). Data is stored securely and can be exported or sent to your systems via webhooks. See our Privacy Policy for full details.',
  },
  {
    id: '4',
    question: 'Can I send submissions to my own system (webhook)?',
    answer:
      'Yes. In the agent settings you can configure a webhook URL. When a user completes the conversation, we POST a JSON payload to your URL with the submitted fields and session data. Webhooks support retries and optional signing. See Developer docs for payload schema.',
  },
  {
    id: '5',
    question: 'How is session data structured for webhooks?',
    answer:
      'Each webhook delivery includes a JSON body with: submitted field key-value pairs, session id, timestamps, and optionally the full session transcript. The exact schema is documented in the Webhook Payload and Session JSON docs linked below.',
  },
  {
    id: '6',
    question: 'What happens if my webhook fails?',
    answer:
      'We retry failed deliveries with exponential backoff. You can view delivery status and logs in the Webhooks section of the dashboard. Failed deliveries can be retried manually. Ensure your endpoint returns 2xx for success.',
  },
]

export function FAQsAccordion({ faqs, className }: FAQsAccordionProps) {
  const [search, setSearch] = useState('')
  const list = Array.isArray(faqs) && faqs.length > 0 ? faqs : DEFAULT_FAQS
  const filtered = useMemo(() => {
    const q = (search ?? '').trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (item) =>
        (item?.question ?? '').toLowerCase().includes(q) ||
        (item?.answer ?? '').toLowerCase().includes(q)
    )
  }, [list, search])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Frequently asked questions</h2>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label="Search FAQs"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No questions match your search.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full" defaultValue={filtered[0]?.id}>
          {(filtered ?? []).map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-medium text-foreground">
                {item.question ?? ''}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer ?? ''}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
