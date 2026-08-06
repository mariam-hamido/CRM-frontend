import {
  CheckCircle2,
  Handshake,
  ListChecks,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import type {
  ActivityItem,
  ActivityType,
} from '@/features/dashboard/constants/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ACTIVITY_TYPE_STYLES: Record<
  ActivityType,
  { icon: LucideIcon; className: string }
> = {
  customer: { icon: UserPlus, className: 'bg-primary/10 text-primary' },
  lead: { icon: Handshake, className: 'bg-secondary text-secondary-foreground' },
  deal: { icon: ListChecks, className: 'bg-destructive/10 text-destructive' },
  task: { icon: CheckCircle2, className: 'bg-muted text-muted-foreground' },
}

export function ActivityList({
  activities,
  className,
}: {
  activities: ActivityItem[]
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {activities.map((activity) => {
            const { icon: Icon, className: iconClassName } =
              ACTIVITY_TYPE_STYLES[activity.type]
            return (
              <li
                key={activity.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                    iconClassName
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activity.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <time className="shrink-0 pt-1 text-xs text-muted-foreground">
                  {activity.timestamp}
                </time>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
