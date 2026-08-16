import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DashboardError({
  message,
  onRetry,
  className,
}: {
  message?: string
  onRetry: () => void
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertTriangle
          className="size-6 text-destructive"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <p className="font-medium">Unable to load dashboard</p>
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
