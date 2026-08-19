import { Card } from '@/components/ui/card'
import {
  NOTIFICATION_COLUMNS,
  NotificationRow,
} from '@/features/notifications/components/NotificationRow'
import type { Notification } from '@/features/notifications/types/notification.types'

export function NotificationList({
  notifications,
  onMarkRead,
  onDelete,
}: {
  notifications: Notification[]
  onMarkRead?: (notification: Notification) => void
  onDelete: (notification: Notification) => void
}) {
  return (
    <Card>
      <div
        className={`hidden items-center gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${NOTIFICATION_COLUMNS}`}
      >
        <span>Notification</span>
        <span>Type</span>
        <span>Status</span>
        <span className="hidden lg:block">Related</span>
        <span className="hidden md:block">Received</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {notifications.map((notification) => (
          <NotificationRow
            key={notification._id}
            notification={notification}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}