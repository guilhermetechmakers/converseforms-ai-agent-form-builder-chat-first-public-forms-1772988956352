import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ArrowLeft, Copy, ExternalLink, QrCode } from 'lucide-react'
import { toast } from 'sonner'

export default function AgentPublish() {
  const { id } = useParams()
  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/chat/${id ?? 'demo'}`
    : ''

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && publicUrl) {
      navigator.clipboard.writeText(publicUrl)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/agents/${id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Publish agent</h1>
                <p className="text-muted-foreground">Share your public chat link.</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Public link</CardTitle>
                <CardDescription>
                  Anyone with this link can start a conversation with your agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input readOnly value={publicUrl} className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button asChild>
                    <Link to={`/chat/${id ?? 'demo'}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open chat
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" title="Show QR code">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6 max-w-2xl">
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Sessions and completion stats for this agent.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No sessions yet.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
