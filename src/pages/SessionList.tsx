import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { MessageSquare } from 'lucide-react'

export default function SessionList() {
  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <h1 className="text-2xl font-semibold text-foreground">Sessions</h1>
            <p className="text-muted-foreground">View and export conversation sessions.</p>
          </div>
          <div className="p-8">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <CardTitle>No sessions yet</CardTitle>
                <CardDescription>
                  When respondents complete a conversation with your agents, sessions will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <Link to="/dashboard/agents" className="text-accent hover:underline">Create an agent</Link> and share its link to start collecting sessions.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
