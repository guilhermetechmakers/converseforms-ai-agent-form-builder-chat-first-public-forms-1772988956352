import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, Book, Mail } from 'lucide-react'

export default function Help() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">Help & FAQ</h1>
          <p className="mt-2 text-muted-foreground">Get started and find answers to common questions.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <HelpCircle className="h-10 w-10 text-primary" />
                <CardTitle>Getting started</CardTitle>
                <CardDescription>Create your first agent, add fields, set persona, and publish your chat link.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/agents/new">Create agent</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Book className="h-10 w-10 text-primary" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>API reference, webhooks, and embedding options for developers.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">View docs</Button>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-8">
            <CardHeader>
              <Mail className="h-10 w-10 text-primary" />
              <CardTitle>Contact support</CardTitle>
              <CardDescription>Need help? Send us a message and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Contact support</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
