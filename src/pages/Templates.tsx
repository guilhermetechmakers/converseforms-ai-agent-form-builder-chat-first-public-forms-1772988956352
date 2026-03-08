import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { FileText, Search } from 'lucide-react'

const mockTemplates = [
  { id: '1', name: 'Lead Capture', description: 'Collect name, email, and company. Perfect for B2B.', tags: ['Sales', 'B2B'] },
  { id: '2', name: 'Event Registration', description: 'Register attendees with custom questions.', tags: ['Events'] },
  { id: '3', name: 'Support Qualifier', description: 'Qualify support tickets with a short conversation.', tags: ['Support'] },
]

export default function Templates() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-border bg-muted/20 px-6 py-16">
          <div className="mx-auto max-w-container">
            <h1 className="text-3xl font-bold text-foreground">Templates</h1>
            <p className="mt-2 text-muted-foreground">
              Start from a template and customize your agent in minutes.
            </p>
            <div className="mt-6 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-9" />
              </div>
            </div>
          </div>
        </section>
        <section className="px-6 py-12">
          <div className="mx-auto max-w-container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((t) => (
                <Card key={t.id} className="flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button asChild className="w-full">
                      <Link to={`/dashboard/agents/new?template=${t.id}`}>Use template</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
