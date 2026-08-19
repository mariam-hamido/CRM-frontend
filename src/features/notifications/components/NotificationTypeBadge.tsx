import { Badge, type BadgeProps } from '@/components/ui/badge'
import { NOTIFICATION_TYPE_LABELS } from '@/features/notifications/constants/notificationLabels'
import type { NotificationType } from '@/features/notifications/types/notification.types'

const TYPE_VARIANTS: Record<
  NotificationType,
  NonNullable<BadgeProps['variant']>
> = {
  system: 'outline',
  task: 'secondary',
  meeting: 'secondary',
  customer: 'secondary',
  lead: 'secondary',
  deal: 'secondary',
  reminder: 'secondary',
  success: 'default',
  warning: 'outline',
  error: 'destructive',
}

export function NotificationTypeBadge({
  type,
}: {
  type: NotificationType
}) {
  return (
    <Badge variant={TYPE_VARIANTS[type]}>
      {NOTIFICATION_TYPE_LABELS[type]}
    </Badge>
  )
}