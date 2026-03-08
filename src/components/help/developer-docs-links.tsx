import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileJson, Code2, Webhook } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeveloperDocsLink } from '@/types/help'

interface DeveloperDocsLinksProps {
  links?: DeveloperDocsLink[] | null
  className?: string
}

const DEFAULT_LINKS: DeveloperDocsLink[] = [
  {
    id: 'webhook-payloads',
    title: 'Webhook payloads',
    description: 'Schema and fields sent when a session is submitted to your webhook URL.',
    url: '/help#webhook-payloads',
  },
  {
    id: 'session-json',
    title: 'Session JSON structure',
    description: 'Full session object shape for transcripts and server-side processing.',
    url: '/help#session-json',
  },
  {
    id: 'api-specs',
    title: 'API reference',
    description: 'REST API for agents, sessions, and submissions (when available).',
    url: '/help#api-specs',
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'webhook-payloads': Webhook,
  'session-json': FileJson,
  'api-specs': Code2,
}

export function DeveloperDocsLinks({ links, className }: DeveloperDocsLinksProps) {
  const list = Array.isArray(links) && links.length > 0 ? links : DEFAULT_LINKS
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-xl">Developer documentation</CardTitle>
        <CardDescription>
          Quick links to webhook payloads, session structure, and API specs for integration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(list ?? []).map((link) => {
            const Icon = iconMap[link.id] ?? FileJson
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all duration-200',
                  'hover:-translate-y-0.5 hover:shadow-card hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-foreground">{link.title ?? ''}</span>
                <span className="text-sm text-muted-foreground">
                  {link.description ?? ''}
                </span>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
