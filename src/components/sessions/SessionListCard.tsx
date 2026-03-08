import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageSquare, MoreHorizontal, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionSummary } from '@/types/session'
import { formatDistanceToNow } from 'date-fns'

export interface SessionListCardProps {
  session: SessionSummary
  onView?: (id: string) => void
  className?: string
}

/** Compact card for a session in list/grid. Shows status, agent, last activity, link to viewer. */
export function SessionListCard({ session, onView, className }: SessionListCardProps) {
  const lastActivity = session.updatedAt ?? session.createdAt ?? session.startedAt
  const displayTime = lastActivity
    ? formatDistanceToNow(new Date(lastActivity), { addSuffix: true })
    : '—'

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden
            >
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground truncate">
                  {session.agentName ?? `Session ${session.id.slice(0, 8)}`}
                </span>
                <Badge
                  variant={
                    session.status === 'completed'
                      ? 'success'
                      : session.status === 'active'
                        ? 'default'
                        : 'secondary'
                  }
                  className="shrink-0"
                >
                  {session.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {session.lastMessageSnippet ?? `Updated ${displayTime}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {displayTime}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                aria-label="Session actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/sessions/${session.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View session
                </Link>
              </DropdownMenuItem>
              {onView && (
                <DropdownMenuItem onClick={() => onView(session.id)}>
                  Open in viewer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {session.messageCount != null && (
            <span>{session.messageCount} messages</span>
          )}
          {session.duration != null && (
            <span>{Math.round(session.duration / 60)}m duration</span>
          )}
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/dashboard/sessions/${session.id}`}>
              View transcript
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
