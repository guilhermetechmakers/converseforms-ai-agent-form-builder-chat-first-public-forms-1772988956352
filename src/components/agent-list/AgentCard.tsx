import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Bot,
  MoreHorizontal,
  Pencil,
  Copy,
  Upload,
  Archive,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'
import type { Agent } from '@/types/agent'
import { formatDistanceToNow } from 'date-fns'

export interface AgentCardProps {
  agent: Agent
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  onEdit?: (id: string) => void
  onDuplicate?: (id: string) => void
  onPublishToggle?: (id: string) => void
  onArchive?: (id: string) => void
  onViewAnalytics?: (id: string) => void
  isPublishing?: boolean
  isArchiving?: boolean
  isDuplicating?: boolean
  className?: string
}

/**
 * Card for a single agent: avatar, name, status, session count, last activity, actions.
 * All array/nested access is guarded for runtime safety.
 */
export function AgentCard({
  agent,
  selected = false,
  onSelect,
  onEdit,
  onDuplicate,
  onPublishToggle,
  onArchive,
  onViewAnalytics,
  isPublishing = false,
  isArchiving = false,
  isDuplicating = false,
  className,
}: AgentCardProps) {
  const sessionCount = agent?.sessionCount ?? 0
  const lastActivityAt = agent?.lastActivityAt
  const canEdit = agent?.canEdit !== false
  const status = agent?.status ?? 'draft'

  const lastActivityLabel = lastActivityAt
    ? formatDistanceToNow(new Date(lastActivityAt), { addSuffix: true })
    : 'No activity'

  return (
    <Card
      className={cn(
        'group flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {onSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) =>
                onSelect(agent.id, checked === true)
              }
              aria-label={`Select ${agent.name}`}
              className="mt-1 shrink-0"
            />
          )}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
            {agent?.avatarUrl ? (
              <img
                src={agent.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Bot className="h-5 w-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
            </div>
            <h3 className="mt-1 truncate text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {agent?.name ?? 'Unnamed agent'}
            </h3>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label="Open actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canEdit && onEdit && (
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/agents/${agent.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem
                onClick={() => onDuplicate(agent.id)}
                disabled={isDuplicating}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            {canEdit && onPublishToggle && status !== 'archived' && (
              <DropdownMenuItem
                onClick={() => onPublishToggle(agent.id)}
                disabled={isPublishing}
              >
                <Upload className="mr-2 h-4 w-4" />
                {status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownMenuItem>
            )}
            {onViewAnalytics && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View analytics
                </Link>
              </DropdownMenuItem>
            )}
            {canEdit && onArchive && status !== 'archived' && (
              <DropdownMenuItem
                onClick={() => onArchive(agent.id)}
                disabled={isArchiving}
                className="text-destructive focus:text-destructive"
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span title="Session count">
            {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
          </span>
          <span title="Last activity">{lastActivityLabel}</span>
        </div>
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full transition-all hover:scale-[1.02]"
            asChild
          >
            <Link to={`/dashboard/agents/${agent.id}`}>Edit agent</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
