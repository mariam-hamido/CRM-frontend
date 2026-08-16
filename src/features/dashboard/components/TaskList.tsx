import { Clock } from 'lucide-react'
import type { BadgeProps } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  TaskItem,
  TaskPriority,
} from '@/features/dashboard/constants/mockData'
import { cn } from '@/lib/utils'

const PRIORITY_VARIANT: Record<TaskPriority, BadgeProps['variant']> = {
  high: 'destructive',
  medium: 'outline',
  low: 'secondary',
  urgent: 'destructive',
}

export function TaskList({
  tasks,
  className,
}: {
  tasks: TaskItem[]
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  Due {task.dueDate}
                </p>
              </div>
              <Badge variant={PRIORITY_VARIANT[task.priority]} className="capitalize">
                {task.priority}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
