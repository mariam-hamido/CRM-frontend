import { Badge, type BadgeProps } from '@/components/ui/badge'
import { TASK_PRIORITY_LABELS } from '@/features/tasks/constants/taskLabels'
import type { TaskPriority } from '@/features/tasks/types/task.types'

const PRIORITY_VARIANTS: Record<
  TaskPriority,
  NonNullable<BadgeProps['variant']>
> = {
  low: 'outline',
  medium: 'secondary',
  high: 'default',
  urgent: 'destructive',
}

export function TaskPriorityBadge({
  priority,
}: {
  priority?: TaskPriority
}) {
  const value = priority ?? 'medium'

  return (
    <Badge variant={PRIORITY_VARIANTS[value]}>
      {TASK_PRIORITY_LABELS[value]}
    </Badge>
  )
}
