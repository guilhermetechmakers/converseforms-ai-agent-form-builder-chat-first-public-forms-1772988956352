import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { authApi } from '@/api/auth'

export type OAuthProvider = 'google' | 'microsoft' | 'github'

export interface OAuthButtonsProps {
  className?: string
  onError?: (message: string) => void
}

/** OAuth / SSO buttons with per-provider loading and error states. Placeholder redirect; wire to backend OAuth flow. */
export function OAuthButtons({ className, onError }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [errorProvider, setErrorProvider] = useState<OAuthProvider | null>(null)

  const handleOAuth = async (provider: OAuthProvider) => {
    setErrorProvider(null)
    setLoadingProvider(provider)
    try {
      const { redirectUrl } = await authApi.oauthRedirect(provider)
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        setErrorProvider(provider)
        onError?.(`Sign in with ${provider} is not configured yet.`)
      }
    } catch {
      setErrorProvider(provider)
      onError?.('Something went wrong. Please try again.')
    } finally {
      setLoadingProvider(null)
    }
  }

  const providers: { id: OAuthProvider; label: string }[] = [
    { id: 'google', label: 'Google' },
    { id: 'microsoft', label: 'Microsoft' },
    { id: 'github', label: 'GitHub' },
  ]

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-center text-xs text-muted-foreground">Or continue with</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(providers ?? []).map(({ id, label }) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            disabled={loadingProvider != null}
            onClick={() => handleOAuth(id)}
            aria-label={`Sign in with ${label}`}
            aria-busy={loadingProvider === id}
          >
            {loadingProvider === id ? '...' : label}
          </Button>
        ))}
      </div>
      {errorProvider != null && (
        <p className="text-center text-xs text-destructive" role="alert">
          Sign-in with {errorProvider} is not available yet.
        </p>
      )}
    </div>
  )
}

/** Alias for backward compatibility. */
export function SocialLoginButtons({ className }: { className?: string }) {
  return <OAuthButtons className={className} />
}
