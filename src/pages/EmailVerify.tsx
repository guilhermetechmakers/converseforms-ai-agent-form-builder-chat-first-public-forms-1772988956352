import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { CheckCircle, XCircle } from 'lucide-react'

export default function EmailVerify() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const status = searchParams.get('status') // success | error

  return (
    <AnimatedPage>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            {status === 'success' || token ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Email verified</CardTitle>
                <CardDescription>
                  Your email has been verified. You can now sign in to your account.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Verification failed</CardTitle>
                <CardDescription>
                  The verification link may have expired or is invalid. You can request a new one from your account.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Go to login</Link>
            </Button>
            {status !== 'success' && !token && (
              <Button variant="outline" className="mt-3 w-full" asChild>
                <Link to="/login">Resend verification</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
