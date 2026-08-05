import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardContent className="flex flex-col gap-6">{children}</CardContent>
    </Card>
  )
}
