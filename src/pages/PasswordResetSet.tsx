import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthenticationLayout, PasswordField, PasswordStrengthMeter } from '@/components/auth'
import { authApi } from '@/api/auth'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth-utils'
import { toast } from 'sonner'

const schema = z
  .object({
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function PasswordResetSet() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data: FormValues) => {
    if (!token.trim()) {
      toast.error('Invalid or missing reset link.')
      return
    }
    try {
      await authApi.resetPasswordConfirm(token, data.newPassword)
      toast.success('Password updated. You can sign in now.')
      navigate('/login')
    } catch {
      toast.error('Failed to reset password. The link may have expired.')
    }
  }

  if (!token.trim()) {
    return (
      <AuthenticationLayout title="Invalid reset link" description="The link is missing or invalid.">
        <Card className="w-full shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Cannot reset password</CardTitle>
            <CardDescription>
              Please request a new password reset link from the login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/password-reset">Request new link</Link>
            </Button>
            <Button variant="outline" asChild className="mt-3 w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </AuthenticationLayout>
    )
  }

  return (
    <AuthenticationLayout
      title="Set new password"
      description="Enter your new password below."
    >
      <Card className="w-full shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">New password</CardTitle>
          <CardDescription>
            Choose a strong password. You will use it to sign in after this.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <PasswordField
                id="newPassword"
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                autoComplete="new-password"
                className="mt-1"
                error={form.formState.errors.newPassword?.message}
                {...form.register('newPassword')}
              />
              <PasswordStrengthMeter
                password={form.watch('newPassword') ?? ''}
                className="mt-2"
                showLabel
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordField
                id="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="mt-1"
                error={form.formState.errors.confirmPassword?.message}
                {...form.register('confirmPassword')}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
              aria-busy={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-accent hover:underline">
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthenticationLayout>
  )
}
