import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { MessageSquare, Zap, Shield, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Conversational capture',
    description: 'Collect leads through natural dialogue instead of rigid forms. Higher completion and richer data.',
  },
  {
    icon: Zap,
    title: 'No-code agent builder',
    description: 'Define fields, validations, persona, and appearance. Publish to a public URL in minutes.',
  },
  {
    icon: Shield,
    title: 'Server-side validation',
    description: 'Deterministic validation engine ensures data integrity. No hallucinations, no invalid submissions.',
  },
  {
    icon: BarChart3,
    title: 'Webhooks & analytics',
    description: 'Reliable delivery to CRMs with retries and signing. Session analytics and completion rates.',
  },
]

export default function Landing() {
  return (
    <AnimatedPage>
      <Navbar />
      <main>
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
          <div className="mx-auto max-w-container text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
              Turn forms into conversations
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              ConverseForms turns static forms into AI agents that collect leads through natural chat.
              Deploy in minutes. Higher conversion, better data.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Get started free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/chat/demo">Try demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/20 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-container">
            <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
              Why conversational capture
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              Product, marketing, and sales teams use ConverseForms to capture and qualify leads without custom engineering.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-container text-center">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Simple pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free. Scale as you grow.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <Link to="/pricing">View plans</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
