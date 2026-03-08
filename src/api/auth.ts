import { api } from '@/lib/api'
import type { AuthResponse, SignInInput, SignUpInput } from '@/types/auth'

export const authApi = {
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>('/auth/login', credentials)
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
    }
    return data
  },
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>('/auth/signup', credentials)
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
    }
    return data
  },
  signOut: async (): Promise<void> => {
    await api.post('/auth/logout', {}).catch(() => {})
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token')
  },
  resetPasswordRequest: (email: string) =>
    api.post<void>('/auth/password-reset/request', { email }),
  resetPasswordConfirm: (token: string, password: string) =>
    api.post<void>('/auth/password-reset/confirm', { token, password }),
  verifyEmail: (token: string) => api.post<void>('/auth/verify-email', { token }),
}
