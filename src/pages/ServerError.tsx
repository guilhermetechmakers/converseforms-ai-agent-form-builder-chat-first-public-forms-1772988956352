import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { AlertTriangle } from 'lucide-react'

interface ServerErrorProps {
  errorId?: string
}

export default function ServerError({ errorId }: ServerErrorProps) {
  return (
    <AnimatedPage>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-center text-muted-foreground">
          We're sorry. The server encountered an error. Please try again later.
        </p>
        {errorId && (
          <p className="mt-2 text-sm text-muted-foreground">Error ID: {errorId}</p>
        )}
        <Button className="mt-8" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </main>
    </AnimatedPage>
  )
}
