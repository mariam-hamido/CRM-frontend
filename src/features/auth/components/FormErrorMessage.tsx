import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FormErrorMessage({
  message,
  id,
  className,
}: {
  message?: string
  id?: string
  className?: string
}) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium text-destructive',
        className
      )}
    >
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}
