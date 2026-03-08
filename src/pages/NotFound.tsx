import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-center text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
