export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn?: number
}

export interface SignInInput {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  fullName?: string
}

export interface SignUpResponse {
  user: User
  emailVerified: boolean
  sessionToken?: string
}

export interface PasswordResetRequestResponse {
  success: boolean
}

export interface PasswordResetConfirmResponse {
  success: boolean
}

export interface VerifyEmailResponse {
  success: boolean
  user?: User
}
