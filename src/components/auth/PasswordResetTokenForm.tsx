import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthenticationLayout } from './AuthenticationLayout'
import { PasswordField } from './PasswordField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { PasswordPolicyHint } from './PasswordPolicyHint'
import { authApi } from '@/api/auth'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth-utils'
import { toast } from 'sonner'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordResetTokenFormData = z.infer<typeof schema>

const INLINE_ERROR_CLASS = 'mt-1 text-sm text-[#EF4444]'

function hasComplexity(password: string): boolean {
  if (!password || password.length < MIN_PASSWORD_LENGTH) return false
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumberOrSymbol = /\d/.test(password) || /[^a-zA-Z0-9]/.test(password)
  return hasLetter && !!hasNumberOrSymbol
}

export interface PasswordResetTokenFormProps {
  token: string
  onResetComplete?: () => void
}

/**
 * Form to set a new password using the token from the reset link.
 * Validates token presence, password policy, and confirmation match.
 */
export function PasswordResetTokenForm({
  token,
  onResetComplete,
}: PasswordResetTokenFormProps) {
  const form = useForm<PasswordResetTokenFormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const newPassword = form.watch('newPassword') ?? ''
  const confirmPassword = form.watch('confirmPassword') ?? ''

  const onSubmit = async (data: PasswordResetTokenFormData) => {
    const trimmedToken = token.trim()
    if (!trimmedToken) {
      toast.error('Invalid or missing reset link.')
      return
    }
    try {
      await authApi.resetPasswordConfirm(trimmedToken, data.newPassword)
      toast.success('Password updated. You can sign in now.')
      onResetComplete?.()
    } catch {
      toast.error(
        'Failed to reset password. The link may have expired or already been used. Request a new link below.'
      )
    }
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
                className="mt-1 rounded-lg border-[rgb(var(--input))]"
                error={form.formState.errors.newPassword?.message}
                aria-invalid={!!form.formState.errors.newPassword}
                {...form.register('newPassword')}
              />
              <PasswordPolicyHint
                hasMinLength={newPassword.length >= MIN_PASSWORD_LENGTH}
                hasComplexity={hasComplexity(newPassword)}
                showMatchHint={!!confirmPassword}
                matches={!!newPassword && newPassword === confirmPassword}
                className="mb-1"
              />
              <PasswordStrengthMeter
                password={newPassword}
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
                className="mt-1 rounded-lg border-[rgb(var(--input))]"
                error={form.formState.errors.confirmPassword?.message}
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className={INLINE_ERROR_CLASS} role="alert">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full font-medium transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={form.formState.isSubmitting}
              aria-busy={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Updating…' : 'Reset password'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              to="/auth/password-reset"
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Request a new reset link
            </Link>
            <span className="mx-2">·</span>
            <Link
              to="/login"
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthenticationLayout>
  )
}
