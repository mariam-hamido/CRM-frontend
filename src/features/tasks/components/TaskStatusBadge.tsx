import { Badge, type BadgeProps } from '@/components/ui/badge'
import { TASK_STATUS_LABELS } from '@/features/tasks/constants/taskLabels'
import type { TaskStatus } from '@/features/tasks/types/task.types'

const STATUS_VARIANTS: Record<
  TaskStatus,
  NonNullable<BadgeProps['variant']>
> = {
  pending: 'outline',
  in_progress: 'secondary',
  completed: 'default',
  cancelled: 'outline',
  overdue: 'destructive',
}

export function TaskStatusBadge({
  status,
  isOverdue,
}: {
  status?: TaskStatus
  isOverdue?: boolean
}) {
  const value = status ?? 'pending'
  const variant = isOverdue ? 'destructive' : STATUS_VARIANTS[value]

  return (
    <Badge variant={variant}>
      {TASK_STATUS_LABELS[value]}
    </Badge>
  )
}
