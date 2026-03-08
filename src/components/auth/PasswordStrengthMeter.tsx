import { cn } from '@/lib/utils'

/** Mock password strength: 0–3 segments based on length. For real use, integrate a proper strength algorithm. */
function getStrength(password: string): number {
  if (!password || password.length === 0) return 0
  if (password.length < 6) return 1
  if (password.length < 10) return 2
  return 3
}

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = getStrength(password ?? '')
  return (
    <div className={cn('flex gap-1', className)} role="meter" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={3} aria-label="Password strength">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors',
            i < strength ? 'bg-accent' : 'bg-muted'
          )}
        />
      ))}
    </div>
  )
}
