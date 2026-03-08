import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title?: string
  description?: string
  className?: string
}

/**
 * Empty state when no agents exist: illustration, message, and CTA to create first agent.
 */
export function EmptyState({
  title = 'No agents yet',
  description = 'Create your first agent to start collecting leads via conversation. Configure fields, persona, and appearance in the Agent Builder.',
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center border-dashed py-12 text-center animate-fade-in-up',
        className
      )}
    >
      <CardContent className="flex flex-col items-center gap-4 p-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-8 w-8" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="max-w-md text-muted-foreground">{description}</p>
        </div>
        <Button asChild className="mt-2 transition-all hover:scale-[1.02]">
          <Link to="/dashboard/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            Create agent
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
