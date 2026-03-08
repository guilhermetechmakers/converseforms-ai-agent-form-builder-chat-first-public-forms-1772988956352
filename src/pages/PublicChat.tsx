import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PublicChat() {
  useParams()
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your conversational form assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages((m) => [...m, { role: 'user', content: input.trim() }])
    setInput('')
    // Simulate reply
    setMessages((m) => [
      ...m,
      { role: 'assistant', content: "Thanks for your message. I'll collect your details in this conversation." },
    ])
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-16 items-center border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-semibold text-foreground">ConverseForms</span>
          </div>
          <p className="ml-4 text-xs text-muted-foreground">Conversation is private and secure.</p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <Card
                  className={cn(
                    'max-w-[85%] px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </Card>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border p-4 md:p-6">
          <div className="mx-auto flex max-w-2xl gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && send()}
              className="flex-1"
            />
            <Button size="icon" onClick={send}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
