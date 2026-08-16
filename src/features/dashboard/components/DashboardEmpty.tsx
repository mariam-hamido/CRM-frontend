import { Inbox, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DashboardEmpty({
  title,
  description,
  icon: Icon = Inbox,
  className,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
