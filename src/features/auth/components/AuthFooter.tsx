import type { ReactNode } from 'react'

export function AuthFooter({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-sm text-muted-foreground">{children}</div>
  )
}
