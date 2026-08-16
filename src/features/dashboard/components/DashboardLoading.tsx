import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DashboardLoading({
  label = 'Loading dashboard…',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {label}
      </CardContent>
    </Card>
  )
}
