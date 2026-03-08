import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Bot, Plus, Search } from 'lucide-react'

export default function AgentList() {
  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Agents</h1>
                <p className="text-muted-foreground">Create and manage your conversational agents.</p>
              </div>
              <Button asChild>
                <Link to="/dashboard/agents/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create agent
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search agents..." className="pl-9" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardTitle className="text-lg">No agents yet</CardTitle>
                  <CardDescription className="mt-1">
                    Create your first agent to start collecting leads via conversation.
                  </CardDescription>
                  <Button asChild className="mt-4 w-full">
                    <Link to="/dashboard/agents/new">Create agent</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
