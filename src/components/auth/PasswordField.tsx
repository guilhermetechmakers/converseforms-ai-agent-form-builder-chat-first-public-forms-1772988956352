import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PasswordFieldProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'type'> {
  id: string
  showToggle?: boolean
  error?: string
}

type PasswordFieldPropsWithRef = PasswordFieldProps & { ref?: React.Ref<HTMLInputElement> }

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const { id, className, showToggle = true, error, ...rest } = props
    const restWithRef = rest as PasswordFieldPropsWithRef
    const { ref: _refProp, id: _id, ...inputProps } = restWithRef
    const resolvedRef = _refProp ?? ref
    const [visible, setVisible] = React.useState(false)
    return (
      <div className="relative">
        <Input
          ref={resolvedRef}
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={inputProps.autoComplete ?? 'current-password'}
          className={cn(showToggle && 'pr-10', className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {showToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none px-3 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-[#EF4444]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
PasswordField.displayName = 'PasswordField'

export { PasswordField }
