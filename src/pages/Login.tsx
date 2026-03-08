import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage } from '@/components/AnimatedPage'
import { PasswordStrengthMeter, SocialLoginButtons } from '@/components/auth'
import { toast } from 'sonner'

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export default function Login() {
  const navigate = useNavigate()

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', fullName: '' },
  })

  const onSignIn = async (_data: SignInForm) => {
    try {
      // TODO: authApi.signIn(data)
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed. Check your credentials.')
    }
  }

  const onSignUp = async (_data: SignUpForm) => {
    try {
      // TODO: authApi.signUp(data)
      toast.success('Account created. Check your email to verify.')
      navigate('/dashboard')
    } catch {
      toast.error('Sign up failed. Please try again.')
    }
  }

  return (
    <AnimatedPage>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to ConverseForms</CardTitle>
            <CardDescription>Sign in or create an account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Log in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1"
                      {...signInForm.register('email')}
                    />
                    {signInForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-[#EF4444]">
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      className="mt-1"
                      {...signInForm.register('password')}
                    />
                    {signInForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-[#EF4444]">
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <SocialLoginButtons className="mt-4" />
                  <Link
                    to="/password-reset"
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                  <Button type="submit" className="w-full" disabled={signInForm.formState.isSubmitting}>
                    {signInForm.formState.isSubmitting ? 'Signing in...' : 'Log in'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="signup-fullName">Full name (optional)</Label>
                    <Input
                      id="signup-fullName"
                      placeholder="Jane Doe"
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
                      className="mt-1"
                      {...signUpForm.register('email')}
                    />
                    {signUpForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-[#EF4444]">
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min. 8 characters"
                      className="mt-1"
                      {...signUpForm.register('password')}
                    />
                    <PasswordStrengthMeter password={signUpForm.watch('password')} className="mt-2" />
                    {signUpForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-[#EF4444]">
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <SocialLoginButtons className="mt-2" />
                  <p className="text-xs text-muted-foreground">
                    By signing up you agree to our{' '}
                    <Link to="/terms" className="text-accent hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
                  </p>
                  <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>
                    {signUpForm.formState.isSubmitting ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-accent hover:underline">Back to home</Link>
        </p>
      </div>
    </AnimatedPage>
  )
}
