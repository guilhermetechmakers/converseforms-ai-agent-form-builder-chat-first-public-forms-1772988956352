import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Placeholder SSO buttons – wired to mock/auth later. */
export function SocialLoginButtons({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-center text-xs text-muted-foreground">Or continue with</p>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" disabled aria-label="Sign in with Google (coming soon)">
          Google
        </Button>
        <Button type="button" variant="outline" disabled aria-label="Sign in with GitHub (coming soon)">
          GitHub
        </Button>
      </div>
    </div>
  )
}
