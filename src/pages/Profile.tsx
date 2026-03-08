import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Profile() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and security.</p>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your display name and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Display name</Label>
                <Input id="name" placeholder="Your name" className="mt-1" />
              </div>
              <Button>Save</Button>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Danger zone</CardTitle>
              <CardDescription>Permanently delete your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete account</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
