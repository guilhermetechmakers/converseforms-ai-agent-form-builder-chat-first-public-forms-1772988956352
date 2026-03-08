import { useSearchParams, useNavigate } from 'react-router-dom'
import { AuthenticationLayout, PasswordResetRequestForm, PasswordResetTokenForm } from '@/components/auth'

/**
 * Unified password reset page.
 * - Without token: show request form (email → reset link).
 * - With token: show set-new-password form.
 * - Invalid/missing token when token expected: show error card with link to request new link.
 */
export default function AuthPasswordReset() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const hasToken = token.trim().length > 0

  if (!hasToken) {
    return (
      <AuthenticationLayout
        title="Reset password"
        description="Enter your email to receive a reset link."
      >
        <PasswordResetRequestForm />
      </AuthenticationLayout>
    )
  }

  return (
    <PasswordResetTokenForm
      token={token}
      onResetComplete={() => navigate('/login', { replace: true })}
    />
  )
}
