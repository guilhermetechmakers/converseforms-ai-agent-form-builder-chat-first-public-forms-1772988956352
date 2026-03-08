/**
 * Public Chat Page: agent by slug, transcript, required-field progress, session persistence.
 * Runtime-safe: guards all array and optional access.
 */

import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAgentBySlug } from '@/hooks/useAgents'
import { useSaveSession } from '@/hooks/useContext'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FormField } from '@/types/agent'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export default function PublicChat() {
  const { slug } = useParams<{ slug: string }>()
  const { data: agent, isLoading: agentLoading, isError: agentError } = useAgentBySlug(slug)
  const saveSession = useSaveSession(agent?.id)

  const requiredFields = (agent?.fields ?? []).filter(
    (f: FormField) => f?.required === true
  ) as FormField[]
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [collectedFields] = useState<Record<string, string | number | string[]>>({})
  const [isSending, setIsSending] = useState(false)

  const welcomeMessage =
    agent?.appearance?.welcomeMessage?.trim() ||
    "Hi! I'm your conversational assistant. How can I help you today?"
  const hasWelcome = messages.length === 0

  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text || isSending) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...(prev ?? []), userMsg])
    setInput('')
    setIsSending(true)

    if (!agent?.id) {
      setMessages((prev) => [
        ...(prev ?? []),
        {
          role: 'assistant',
          content: "I'm not connected yet. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ])
      setIsSending(false)
      return
    }

    saveSession.mutate(
      {
        sessionId: sessionId ?? undefined,
        transcriptChunk: { role: 'user', content: text },
        fieldValues: Object.keys(collectedFields).length > 0 ? collectedFields : undefined,
      },
      {
        onSuccess: (res) => {
          if (res?.sessionId) setSessionId(res.sessionId)
          const reply =
            res?.nextPrompt?.trim() ||
            "Thanks for your message. I'll use the knowledge I have to help you."
          setMessages((prev) => [
            ...(prev ?? []),
            {
              role: 'assistant',
              content: reply,
              timestamp: new Date().toISOString(),
            },
          ])
        },
        onError: () => {
          setMessages((prev) => [
            ...(prev ?? []),
            {
              role: 'assistant',
              content: "Sorry, I couldn't process that. Please try again.",
              timestamp: new Date().toISOString(),
            },
          ])
        },
        onSettled: () => setIsSending(false),
      }
    )
  }, [input, isSending, agent?.id, sessionId, collectedFields, saveSession])

  const collectedCount = Object.keys(collectedFields).length
  const progressValue =
    requiredFields.length > 0
      ? Math.min(100, (collectedCount / requiredFields.length) * 100)
      : 100

  if (agentLoading && !agent) {
    return (
      <AnimatedPage>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading conversation…</p>
        </div>
      </AnimatedPage>
    )
  }

  if (agentError || !agent) {
    return (
      <AnimatedPage>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-4">
          <p className="text-center text-muted-foreground">
            This agent could not be found or is not available.
          </p>
          <Button variant="outline" asChild>
            <a href="/">Go home</a>
          </Button>
        </div>
      </AnimatedPage>
    )
  }

  const displayName = agent?.name ?? 'ConverseForms'
  const avatarUrl = agent?.appearance?.avatarUrl ?? agent?.avatarUrl

  return (
    <AnimatedPage>
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-16 shrink-0 items-center border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Bot className="h-5 w-5" aria-hidden />
              )}
            </div>
            <span className="font-semibold text-foreground">{displayName}</span>
          </div>
          <p className="ml-4 text-xs text-muted-foreground">
            Conversation is private and secure.
          </p>
        </header>

        {requiredFields.length > 0 && (
          <div className="shrink-0 border-b border-border px-4 py-2 md:px-6">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Required fields</span>
                <span>
                  {collectedCount} / {requiredFields.length} collected
                </span>
              </div>
              <Progress
                value={progressValue}
                className="h-2 mt-1"
                aria-label="Required fields progress"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {hasWelcome && (
              <div className="flex gap-3 animate-fade-in-up">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" aria-hidden />
                </div>
                <Card className="max-w-[85%] px-4 py-3 bg-muted">
                  <p className="text-sm">{welcomeMessage}</p>
                </Card>
              </div>
            )}
            {(messages ?? []).map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" aria-hidden />
                  </div>
                )}
                <Card
                  className={cn(
                    'max-w-[85%] px-4 py-3 transition-shadow',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </Card>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" aria-hidden />
                </div>
                <Card className="max-w-[85%] px-4 py-3 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-border p-4 md:p-6">
          <div className="mx-auto flex max-w-2xl gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === 'Enter' && !e.shiftKey && sendMessage()
              }
              disabled={isSending}
              className="flex-1"
              aria-label="Message input"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
              className="shrink-0 transition-transform hover:scale-105"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
