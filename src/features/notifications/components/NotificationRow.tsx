import { Link } from 'react-router-dom'
import { CircleCheck, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { NotificationStatusBadge } from '@/features/notifications/components/NotificationStatusBadge'
import { NotificationTypeBadge } from '@/features/notifications/components/NotificationTypeBadge'
import { NOTIFICATION_ENTITY_TYPE_LABELS } from '@/features/notifications/constants/notificationLabels'
import type { Notification } from '@/features/notifications/types/notification.types'
import { formatNotificationDate } from '@/features/notifications/utils/notificationUtils'

export const NOTIFICATION_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_auto_auto_minmax(0,1.2fr)_minmax(0,1fr)_auto]'

function NotificationActions({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  onMarkRead?: (notification: Notification) => void
  onDelete: (notification: Notification) => void
}) {
  const showMarkRead = !notification.isRead && Boolean(onMarkRead)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${notification.title}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {showMarkRead ? (
          <DropdownMenuItem onSelect={() => onMarkRead?.(notification)}>
            <CircleCheck aria-hidden="true" />
            Mark as read
          </DropdownMenuItem>
        ) : null}
        {showMarkRead ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(notification)}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationTitle({
  notification,
}: {
  notification: Notification
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      {!notification.isRead ? (
        <span
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
          aria-hidden="true"
        />
      ) : null}
      <div className="min-w-0">
        <p
          className={`truncate ${
            notification.isRead
              ? 'font-normal text-muted-foreground'
              : 'font-medium'
          }`}
        >
          {notification.title}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {notification.message}
        </p>
      </div>
    </div>
  )
}

function NotificationRelated({
  notification,
}: {
  notification: Notification
}) {
  const entityLabel =
    notification.entityType === null
      ? undefined
      : NOTIFICATION_ENTITY_TYPE_LABELS[notification.entityType]
  const actionUrl = notification.actionUrl?.startsWith('/')
    ? notification.actionUrl
    : undefined

  if (!entityLabel && !actionUrl) return null

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {entityLabel ? (
        <span className="truncate text-sm">{entityLabel}</span>
      ) : null}
      {actionUrl ? (
        <Link
          to={actionUrl}
          className="w-fit text-sm text-primary hover:underline"
        >
          View
        </Link>
      ) : null}
    </div>
  )
}

export function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  onMarkRead?: (notification: Notification) => void
  onDelete: (notification: Notification) => void
}) {
  const rowBackground = notification.isRead ? '' : 'bg-muted/30'

  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${NOTIFICATION_COLUMNS} ${rowBackground}`}
      >
        <div className="min-w-0">
          <NotificationTitle notification={notification} />
        </div>
        <div>
          <NotificationTypeBadge type={notification.type} />
        </div>
        <div>
          <NotificationStatusBadge isRead={notification.isRead} />
        </div>
        <div className="hidden min-w-0 lg:block">
          <NotificationRelated notification={notification} />
        </div>
        <div className="hidden tabular-nums text-muted-foreground md:block">
          {formatNotificationDate(notification.createdAt)}
        </div>
        <div className="flex justify-end">
          <NotificationActions
            notification={notification}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div
        className={`flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden ${rowBackground}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <NotificationTitle notification={notification} />
          </div>
          <NotificationActions
            notification={notification}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NotificationTypeBadge type={notification.type} />
          <NotificationStatusBadge isRead={notification.isRead} />
        </div>
        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
          <p className="tabular-nums">
            {formatNotificationDate(notification.createdAt)}
          </p>
          <NotificationRelated notification={notification} />
        </div>
      </div>
    </li>
  )
}