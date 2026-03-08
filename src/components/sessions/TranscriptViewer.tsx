import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, User, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/session'

export interface TranscriptViewerProps {
  messages: ChatMessage[]
  searchQuery?: string
  onSearchChange?: (value: string) => void
  className?: string
  /** Max height before scroll */
  maxHeight?: string
}

const COLLAPSED_LENGTH = 200

/** Renders chronological transcript with role, content, timestamp. Collapsible long messages. */
export function TranscriptViewer({
  messages,
  searchQuery = '',
  onSearchChange,
  className,
  maxHeight = '400px',
}: TranscriptViewerProps) {
  const safeMessages = Array.isArray(messages) ? messages : []
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const highlightQuery = searchQuery.trim().toLowerCase()
  const highlight = (text: string) => {
    if (!highlightQuery) return text
    const parts = text.split(new RegExp(`(${highlightQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlightQuery ? (
        <mark key={i} className="bg-warning/30 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
        <CardDescription>Full conversation</CardDescription>
        {onSearchChange && (
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search in transcript…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              aria-label="Search in transcript"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="space-y-3 overflow-y-auto pr-1"
          style={{ maxHeight }}
          role="log"
          aria-label="Conversation transcript"
        >
          {safeMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No messages in this session.</p>
          ) : (
            (safeMessages as ChatMessage[]).map((msg) => {
              const isUser = msg.role === 'user'
              const isLong = (msg.content?.length ?? 0) > COLLAPSED_LENGTH
              const id = msg.id ?? `msg-${msg.timestamp}`
              const isExpanded = expandedIds.has(id)
              const content = msg.content ?? ''
              const showContent = !isLong || isExpanded ? content : `${content.slice(0, COLLAPSED_LENGTH)}…`

              return (
                <div
                  key={id}
                  className={cn(
                    'flex gap-3 animate-fade-in',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <Bot
                      className="h-4 w-4 shrink-0 text-muted-foreground mt-1"
                      aria-hidden
                    />
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-sm border border-border',
                      isUser
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted'
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {highlight(showContent)}
                    </div>
                    {isLong && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs text-muted-foreground"
                        onClick={() => toggleExpand(id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="mr-1 h-3 w-3" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-3 w-3" />
                            Show more
                          </>
                        )}
                      </Button>
                    )}
                    <div className="text-xs opacity-80 mt-1">
                      {msg.timestamp}
                    </div>
                  </div>
                  {isUser && (
                    <User
                      className="h-4 w-4 shrink-0 text-muted-foreground mt-1"
                      aria-hidden
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
