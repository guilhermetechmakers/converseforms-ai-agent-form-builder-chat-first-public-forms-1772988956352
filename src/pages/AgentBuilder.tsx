import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ArrowLeft, Settings2, MessageSquare, Palette } from 'lucide-react'

export default function AgentBuilder() {
  const { id } = useParams()
  const isNew = id === 'new'

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/agents">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {isNew ? 'New agent' : 'Edit agent'}
                </h1>
                <p className="text-muted-foreground">
                  Configure fields, persona, and appearance.
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Tabs defaultValue="fields" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="fields" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  Fields
                </TabsTrigger>
                <TabsTrigger value="persona" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Persona
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fields">
                <Card>
                  <CardHeader>
                    <CardTitle>Form fields</CardTitle>
                    <CardDescription>
                      Define the fields your agent will collect. Drag to reorder.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No fields yet. Add fields from the palette or define them below.
                    </p>
                    <Button variant="outline" className="mt-4">
                      Add field
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="persona">
                <Card>
                  <CardHeader>
                    <CardTitle>Persona & instructions</CardTitle>
                    <CardDescription>
                      Set the tone and behavior of your agent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Tone</Label>
                      <Input placeholder="e.g. Friendly, professional" className="mt-1" />
                    </div>
                    <div>
                      <Label>Instructions</Label>
                      <Textarea
                        placeholder="How should the agent respond? What should it avoid?"
                        className="mt-1 min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize colors and welcome message.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Welcome message</Label>
                      <Textarea
                        placeholder="First message the user sees..."
                        className="mt-1 min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="mt-8 flex gap-3">
              <Button>Save draft</Button>
              <Button variant="outline" asChild>
                <Link to={isNew ? '/dashboard/agents' : `/dashboard/agents/${id}/publish`}>
                  {isNew ? 'Cancel' : 'Publish'}
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
