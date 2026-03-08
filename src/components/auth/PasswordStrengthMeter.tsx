import { cn } from '@/lib/utils'
import { getPasswordStrength, getPasswordStrengthLabel } from '@/lib/auth-utils'

interface PasswordStrengthMeterProps {
  password: string
  className?: string
  showLabel?: boolean
}

export function PasswordStrengthMeter({ password, className, showLabel = false }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password ?? '')
  const segments = 4
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={strength}
        aria-valuemin={0}
        aria-valuemax={segments}
        aria-label="Password strength"
      >
        {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors duration-200',
            i < strength ? 'bg-accent' : 'bg-muted'
          )}
        />
      ))}
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{getPasswordStrengthLabel(strength)}</span>
      )}
    </div>
  )
}
