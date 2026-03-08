import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ArrowLeft, Download, RefreshCw, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockMessages = [
  { role: 'assistant' as const, content: 'Hi! What\'s your email?', timestamp: '10:00' },
  { role: 'user' as const, content: 'john@example.com', timestamp: '10:01' },
  { role: 'assistant' as const, content: 'Thanks. And your name?', timestamp: '10:01' },
  { role: 'user' as const, content: 'John Doe', timestamp: '10:02' },
]

const mockFields = [
  { label: 'Email', value: 'john@example.com', validated: true },
  { label: 'Name', value: 'John Doe', validated: true },
]

export default function SessionViewer() {
  const { id } = useParams()

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/sessions">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Session {id ?? '—'}</h1>
                <p className="text-muted-foreground">Transcript and extracted fields.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 p-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>Full conversation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && <Bot className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Extracted fields</CardTitle>
                <CardDescription>Structured data from this session</CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Field</th>
                      <th className="pb-2 font-medium">Value</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFields.map((f) => (
                      <tr key={f.label} className="border-b border-border">
                        <td className="py-2">{f.label}</td>
                        <td className="py-2">{f.value}</td>
                        <td className="py-2">
                          <span className="text-success">{f.validated ? 'Valid' : '—'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
