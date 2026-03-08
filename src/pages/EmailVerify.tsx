import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthenticationLayout } from '@/components/auth'
import { authApi } from '@/api/auth'
import { toast } from 'sonner'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

type VerifyState = 'idle' | 'loading' | 'success' | 'error'

export default function EmailVerify() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'idle')

  useEffect(() => {
    if (!token.trim()) {
      setState('error')
      return
    }
    let cancelled = false
    authApi
      .verifyEmail(token)
      .then((result) => {
        if (cancelled) return
        if (result?.success === true) {
          setState('success')
          toast.success('Email verified. Welcome!')
          navigate('/dashboard', { replace: true })
        } else {
          setState('error')
        }
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [token, navigate])

  const isSuccess = state === 'success'
  const isError = state === 'error' || (state === 'idle' && !token.trim())
  const isLoading = state === 'loading'

  return (
    <AuthenticationLayout
      title="Email verification"
      description={isLoading ? 'Verifying your email...' : undefined}
    >
      <Card className="w-full shadow-card">
        <CardHeader className="text-center">
          {isLoading && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
              </div>
              <CardTitle className="text-xl">Verifying...</CardTitle>
              <CardDescription>
                Please wait while we confirm your email address.
              </CardDescription>
            </>
          )}
          {isSuccess && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle className="h-6 w-6" aria-hidden />
              </div>
              <CardTitle className="text-xl">Email verified</CardTitle>
              <CardDescription>
                Your email has been verified. Redirecting you to the dashboard.
              </CardDescription>
            </>
          )}
          {isError && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-6 w-6" aria-hidden />
              </div>
              <CardTitle className="text-xl">Verification failed</CardTitle>
              <CardDescription>
                The verification link may have expired or is invalid. You can request a new one from your account or sign in to resend.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          {isError && (
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </AuthenticationLayout>
  )
}
