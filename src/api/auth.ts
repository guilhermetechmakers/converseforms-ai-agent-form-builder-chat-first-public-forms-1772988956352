import { api } from '@/lib/api'
import type {
  AuthResponse,
  SignInInput,
  SignUpInput,
  SignUpResponse,
  PasswordResetRequestResponse,
  PasswordResetConfirmResponse,
  VerifyEmailResponse,
} from '@/types/auth'

function storeToken(token: string | null | undefined): void {
  if (typeof token === 'string' && token.length > 0 && typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export const authApi = {
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const raw = await api.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? false,
    })
    const token = raw?.token ?? null
    storeToken(token)
    return {
      user: raw?.user ?? { id: '', email: credentials.email, createdAt: '', updatedAt: '' },
      token: token ?? '',
      refreshToken: raw?.refreshToken ?? undefined,
      expiresIn: raw?.expiresIn ?? undefined,
    }
  },

  signUp: async (credentials: SignUpInput): Promise<SignUpResponse> => {
    const raw = await api.post<SignUpResponse & { token?: string }>('/auth/signup', credentials)
    const token = raw?.sessionToken ?? raw?.token ?? null
    storeToken(token)
    return {
      user: raw?.user ?? { id: '', email: credentials.email, createdAt: '', updatedAt: '' },
      emailVerified: raw?.emailVerified ?? false,
      sessionToken: token ?? undefined,
    }
  },

  signOut: async (): Promise<void> => {
    await api.post('/auth/logout', {}).catch(() => {})
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token')
  },

  resetPasswordRequest: async (email: string): Promise<PasswordResetRequestResponse> => {
    const raw = await api.post<PasswordResetRequestResponse>('/auth/password-reset/request', { email })
    return { success: raw?.success === true }
  },

  resetPasswordConfirm: async (token: string, newPassword: string): Promise<PasswordResetConfirmResponse> => {
    const raw = await api.post<PasswordResetConfirmResponse>('/auth/password-reset/confirm', {
      token,
      newPassword,
    })
    return { success: raw?.success === true }
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const raw = await api.get<VerifyEmailResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`)
    return {
      success: raw?.success === true,
      user: raw?.user ?? undefined,
    }
  },

  /** Initiate OAuth flow; returns redirect URL. Placeholder for backend. */
  oauthRedirect: async (_provider: 'google' | 'microsoft' | 'github'): Promise<{ redirectUrl: string }> => {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
    return { redirectUrl: `${base}/auth/oauth/${_provider}` }
  },
}
