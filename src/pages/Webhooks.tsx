import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Webhook as WebhookIcon, Plus } from 'lucide-react'

export default function Webhooks() {
  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Webhooks</h1>
                <p className="text-muted-foreground">Send session events to your endpoints.</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add webhook
              </Button>
            </div>
          </div>
          <div className="p-8">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WebhookIcon className="h-5 w-5" />
                </div>
                <CardTitle>No webhooks</CardTitle>
                <CardDescription>
                  Create a webhook to receive session.completed and other events. We'll sign payloads and retry on failure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Add webhook</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
