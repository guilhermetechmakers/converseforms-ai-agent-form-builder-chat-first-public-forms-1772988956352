import { cn } from '@/lib/utils'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth-utils'

export interface PasswordPolicyHintProps {
  /** Whether the password meets minimum length */
  hasMinLength?: boolean
  /** Whether the password has letters and numbers/symbols */
  hasComplexity?: boolean
  /** Whether confirm password matches (only relevant when both fields have value) */
  matches?: boolean
  /** Whether to show the match hint (e.g. when confirm field is in use) */
  showMatchHint?: boolean
  className?: string
}

/**
 * Displays password policy hints (min length, complexity, match).
 * Used on signup and password reset token form.
 */
export function PasswordPolicyHint({
  hasMinLength = false,
  hasComplexity = false,
  matches = false,
  showMatchHint = false,
  className,
}: PasswordPolicyHintProps) {
  const hints: { met: boolean; label: string }[] = [
    { met: hasMinLength, label: `At least ${MIN_PASSWORD_LENGTH} characters` },
    {
      met: hasComplexity,
      label: 'Letters and numbers or symbols',
    },
  ]
  if (showMatchHint) {
    hints.push({ met: matches, label: 'Passwords match' })
  }
  return (
    <ul
      className={cn('mt-2 space-y-1 text-xs text-muted-foreground', className)}
      role="list"
      aria-label="Password requirements"
    >
      {(hints ?? []).map((hint, i) => (
        <li
          key={i}
          className={cn(
            'flex items-center gap-2',
            hint.met ? 'text-[rgb(var(--success))]' : ''
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 shrink-0 rounded-full',
              hint.met ? 'bg-[rgb(var(--success))]' : 'bg-muted-foreground/50'
            )}
            aria-hidden
          />
          {hint.label}
        </li>
      ))}
    </ul>
  )
}
