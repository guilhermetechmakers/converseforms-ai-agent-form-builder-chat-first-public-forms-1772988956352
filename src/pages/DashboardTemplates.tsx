import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { FileText } from 'lucide-react'

const mockTemplates = [
  { id: '1', name: 'Lead Capture', description: 'Collect name, email, company.', tags: ['Sales'] },
  { id: '2', name: 'Event Registration', description: 'Register attendees.', tags: ['Events'] },
]

export default function DashboardTemplates() {
  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
            <p className="text-muted-foreground">Clone a template to create a new agent.</p>
          </div>
          <div className="p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((t) => (
                <Card key={t.id} className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to={`/dashboard/agents/new?template=${t.id}`}>Use template</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
