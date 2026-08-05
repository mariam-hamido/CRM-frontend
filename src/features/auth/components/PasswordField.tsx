import * as React from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FormErrorMessage } from './FormErrorMessage'

export interface PasswordFieldProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string
  error?: string
}

export function PasswordField({
  label,
  error,
  id,
  className,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id ?? props.name
  const errorId = inputId ? `${inputId}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}

      <div className="relative">
        <Input
          {...props}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>

      <FormErrorMessage message={error} id={errorId} />
    </div>
  )
}
