import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AuthenticationLayout,
  PasswordField,
  PasswordStrengthMeter,
  SocialLoginButtons,
} from '@/components/auth'
import { authApi } from '@/api/auth'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth-utils'
import { toast } from 'sonner'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    fullName: z.string().optional(),
    acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the Terms and Privacy Policy'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

const INLINE_ERROR_CLASS = 'mt-1 text-sm text-[#EF4444]'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const isSignUp = location.pathname === '/signup'

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      acceptTerms: false,
    },
  })

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const id = isSignUp ? 'signup-email' : 'signin-email'
      document.getElementById(id)?.focus()
    })
    return () => cancelAnimationFrame(timer)
  }, [isSignUp])

  const onSignIn = async (data: SignInFormValues) => {
    try {
      await authApi.signIn({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      })
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed. Check your credentials.')
    }
  }

  const onSignUp = async (data: SignUpFormValues) => {
    try {
      await authApi.signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName ?? undefined,
      })
      toast.success('Account created. Check your email to verify.')
      navigate('/dashboard')
    } catch {
      toast.error('Sign up failed. Please try again.')
    }
  }

  return (
    <AuthenticationLayout
      title="Welcome to ConverseForms"
      description="Sign in or create an account to get started."
    >
      <Card className="w-full shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="sr-only">Sign in or Sign up</CardTitle>
          <CardDescription className="sr-only">
            Use the tabs below to switch between sign in and sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isSignUp ? 'signup' : 'signin'} value={isSignUp ? 'signup' : 'signin'} className="w-full">
            <TabsList className="grid w-full grid-cols-2" aria-label="Auth mode">
              <TabsTrigger value="signin" asChild>
                <Link to="/login">Log in</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link to="/signup">Sign up</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="mt-1"
                    aria-invalid={!!signInForm.formState.errors.email}
                    {...signInForm.register('email')}
                  />
                  {signInForm.formState.errors.email && (
                    <p className={INLINE_ERROR_CLASS} role="alert">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <PasswordField
                    id="signin-password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="mt-1"
                    error={signInForm.formState.errors.password?.message}
                    {...signInForm.register('password')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="signin-remember"
                    aria-describedby="signin-remember-desc"
                    checked={signInForm.watch('rememberMe') ?? false}
                    onCheckedChange={(checked) =>
                      signInForm.setValue('rememberMe', checked === true)
                    }
                  />
                  <Label
                    id="signin-remember-desc"
                    htmlFor="signin-remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <SocialLoginButtons className="pt-2" />
                <div>
                  <Link
                    to="/password-reset"
                    className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInForm.formState.isSubmitting}
                  aria-busy={signInForm.formState.isSubmitting}
                >
                  {signInForm.formState.isSubmitting ? 'Signing in...' : 'Log in'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <div>
                  <Label htmlFor="signup-fullName">Full name (optional)</Label>
                  <Input
                    id="signup-fullName"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="mt-1"
                    {...signUpForm.register('fullName')}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="mt-1"
                    aria-invalid={!!signUpForm.formState.errors.email}
                    {...signUpForm.register('email')}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className={INLINE_ERROR_CLASS} role="alert">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <PasswordField
                    id="signup-password"
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    autoComplete="new-password"
                    className="mt-1"
                    error={signUpForm.formState.errors.password?.message}
                    {...signUpForm.register('password')}
                  />
                  <PasswordStrengthMeter
                    password={signUpForm.watch('password') ?? ''}
                    className="mt-2"
                    showLabel
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirmPassword">Confirm password</Label>
                  <PasswordField
                    id="signup-confirmPassword"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="mt-1"
                    error={signUpForm.formState.errors.confirmPassword?.message}
                    {...signUpForm.register('confirmPassword')}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="signup-terms"
                    className="mt-0.5"
                    aria-describedby="signup-terms-desc signup-terms-error"
                    checked={signUpForm.watch('acceptTerms') ?? false}
                    onCheckedChange={(checked) =>
                      signUpForm.setValue('acceptTerms', checked === true)
                    }
                  />
                  <div className="grid gap-1">
                    <Label
                      id="signup-terms-desc"
                      htmlFor="signup-terms"
                      className="text-sm font-normal cursor-pointer leading-tight"
                    >
                      I agree to the{' '}
                      <Link to="/terms" className="text-accent hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-accent hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    {signUpForm.formState.errors.acceptTerms && (
                      <p id="signup-terms-error" className={INLINE_ERROR_CLASS} role="alert">
                        {signUpForm.formState.errors.acceptTerms.message}
                      </p>
                    )}
                  </div>
                </div>
                <SocialLoginButtons className="pt-2" />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpForm.formState.isSubmitting}
                  aria-busy={signUpForm.formState.isSubmitting}
                >
                  {signUpForm.formState.isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AuthenticationLayout>
  )
}
