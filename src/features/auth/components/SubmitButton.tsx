import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

export interface SubmitButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
}

export function SubmitButton({
  isLoading = false,
  loadingText = 'Please wait…',
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
