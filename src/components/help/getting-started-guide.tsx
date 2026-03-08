import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GuideStep {
  id: string
  title: string
  description: string
  cta?: { label: string; to: string }
}

interface GettingStartedGuideProps {
  steps?: GuideStep[]
  className?: string
}

const DEFAULT_STEPS: GuideStep[] = [
  {
    id: '1',
    title: 'Create your agent',
    description:
      'In the dashboard, create a new AI agent. Give it a name and define the fields you want to collect (e.g. email, company, use case). The form-agent concept: your agent is both the conversational UI and the schema for submitted data.',
    cta: { label: 'Create agent', to: '/dashboard/agents/new' },
  },
  {
    id: '2',
    title: 'Configure persona and validations',
    description:
      'Set the agent’s system prompt and tone. Add validation rules (required fields, formats) so submissions are consistent. Optional: add conditional logic so questions adapt to previous answers.',
  },
  {
    id: '3',
    title: 'Publish and share your link',
    description:
      'Publish the agent to get a public chat URL. Share this link in campaigns, landing pages, or support flows. Submissions are stored in your account and can be sent to a webhook.',
    cta: { label: 'Go to dashboard', to: '/dashboard' },
  },
]

export function GettingStartedGuide({ steps, className }: GettingStartedGuideProps) {
  const list = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Getting started</CardTitle>
            <CardDescription>
              Create and publish an AI form-agent in a few steps.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ol className="divide-y divide-border">
          {(list ?? []).map((step, index) => (
            <li key={step.id} className="animate-fade-in-up p-6" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  {step.cta && (
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to={step.cta.to}>
                        {step.cta.label}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex justify-between border-t border-border px-6 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/agents/new">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/agents/new">
              Create agent
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
