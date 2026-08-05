import type { FormEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AuthForm({
  children,
  onSubmit,
  className,
}: {
  children: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  className?: string
}) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', className)}
    >
      {children}
    </form>
  )
}
