import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AcceptancePanelProps {
  onAccept: (accepted: boolean) => void
  isAccepted?: boolean
  showConfirmationStep?: boolean
  className?: string
}

/**
 * Optional acceptance UI for onboarding/checkout: checkbox + confirm.
 * Accessible and keyboard-navigable.
 */
export function AcceptancePanel({
  onAccept,
  isAccepted = false,
  showConfirmationStep = false,
  className,
}: AcceptancePanelProps) {
  const [checked, setChecked] = useState(isAccepted)
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (showConfirmationStep) {
      setConfirmed(true)
      onAccept(checked)
    } else {
      onAccept(checked)
    }
  }

  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-muted/30 p-6',
        className
      )}
      aria-labelledby="acceptance-heading"
    >
      <h2 id="acceptance-heading" className="text-foreground text-lg font-semibold">
        Accept Terms of Service
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        To continue, you must read and accept our Terms of Service.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="tos-accept"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            aria-describedby="tos-accept-desc"
            className="h-4 w-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <label
            id="tos-accept-desc"
            htmlFor="tos-accept"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I have read and accept the Terms of Service
          </label>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={!checked}
          onClick={handleConfirm}
          aria-label="Confirm acceptance"
        >
          {showConfirmationStep && !confirmed ? 'Confirm' : 'Continue'}
        </Button>
      </div>
    </section>
  )
}
