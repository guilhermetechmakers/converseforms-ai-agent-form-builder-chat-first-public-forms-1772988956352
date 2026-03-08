import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RetryButtonProps {
  onClick: (() => void) | undefined
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Primary CTA pill for retry. Disabled when onClick is absent or disabled is true.
 * Accessible labels and focus ring.
 */
export function RetryButton({
  onClick,
  disabled = false,
  className,
  children = 'Try again',
}: RetryButtonProps) {
  const isDisabled = disabled || typeof onClick !== 'function'

  const handleClick = () => {
    if (typeof onClick === 'function' && !isDisabled) onClick()
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn('rounded-full px-6 py-2.5 text-sm font-semibold', className)}
      aria-label={isDisabled ? 'Retry is not available' : 'Try again'}
    >
      <RefreshCw className="mr-2 h-4 w-4 shrink-0" aria-hidden />
      {children}
    </Button>
  )
}
