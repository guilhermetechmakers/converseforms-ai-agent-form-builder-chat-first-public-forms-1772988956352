import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/api/auth'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export type PasswordResetRequestFormData = z.infer<typeof schema>

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

const INLINE_ERROR_CLASS = 'mt-1 text-sm text-[#EF4444]'

export interface PasswordResetRequestFormProps {
  onSubmitted?: () => void
  statusState?: { status: RequestStatus; setStatus: (s: RequestStatus) => void }
}

function useRequestStatus(statusState?: PasswordResetRequestFormProps['statusState']) {
  const [internalStatus, setInternalStatus] = useState<RequestStatus>('idle')
  const status = statusState ? statusState.status : internalStatus
  const setStatus = (s: RequestStatus) => {
    setInternalStatus(s)
    statusState?.setStatus?.(s)
  }
  return [status, setStatus] as const
}

/**
 * Form to request a password reset email. Shows privacy-respecting success message.
 */
export function PasswordResetRequestForm({
  onSubmitted,
  statusState,
}: PasswordResetRequestFormProps) {
  const [status, setStatus] = useRequestStatus(statusState)

  const form = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    setStatus('loading')
    try {
      await authApi.resetPasswordRequest(data.email)
      setStatus('success')
      onSubmitted?.()
    } catch {
      setStatus('error')
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <Card className="w-full shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            If this email is registered, a reset link has been sent. Check your
            inbox and spam folder. For privacy we don&apos;t confirm whether an
            account exists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full rounded-full font-medium" size="lg">
            <Link to="/login">Back to login</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              onClick={() => setStatus('idle')}
            >
              Send another reset link
            </button>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your
          password. Check your inbox and spam folder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="password-reset-email">Email</Label>
            <Input
              id="password-reset-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1 rounded-lg border-[rgb(var(--input))]"
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? 'password-reset-email-error' : undefined}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p
                id="password-reset-email-error"
                className={INLINE_ERROR_CLASS}
                role="alert"
              >
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full font-medium transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? 'Sending…' : 'Send reset email'}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
