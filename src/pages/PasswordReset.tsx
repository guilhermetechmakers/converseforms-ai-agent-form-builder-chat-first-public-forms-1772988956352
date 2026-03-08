import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthenticationLayout } from '@/components/auth'
import { authApi } from '@/api/auth'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

const INLINE_ERROR_CLASS = 'mt-1 text-sm text-[#EF4444]'

export default function PasswordReset() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.resetPasswordRequest(data.email)
      toast.success('Check your email for a reset link.')
    } catch {
      toast.error('Failed to send reset email.')
    }
  }

  return (
    <AuthenticationLayout
      title="Reset password"
      description="Enter your email and we'll send you a link to reset your password."
    >
      <Card className="w-full shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">Forgot password?</CardTitle>
          <CardDescription>
            We'll send you a link to set a new password. Check your inbox (and spam).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password-reset-email">Email</Label>
              <Input
                id="password-reset-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-1"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className={INLINE_ERROR_CLASS} role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-accent hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthenticationLayout>
  )
}
