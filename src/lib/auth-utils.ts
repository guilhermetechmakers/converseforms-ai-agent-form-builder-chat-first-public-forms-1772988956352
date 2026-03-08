/**
 * Auth utilities: email validation, password strength estimation.
 * Used for client-side validation and UI feedback only; server must enforce as well.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate email format. Returns true if valid.
 */
export function isValidEmail(value: string): boolean {
  if (typeof value !== 'string' || value.trim().length === 0) return false
  return EMAIL_REGEX.test(value.trim())
}

/**
 * Password strength: 0 (none) to 4 (strong).
 * Based on length, variety (upper, lower, digit, symbol).
 */
export function getPasswordStrength(password: string): number {
  if (!password || password.length === 0) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  return Math.min(score, 4)
}

/**
 * Password strength label for UI.
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels: Record<number, string> = {
    0: 'None',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  }
  return labels[strength] ?? 'None'
}

/**
 * Minimum password length enforced in signup.
 */
export const MIN_PASSWORD_LENGTH = 8
