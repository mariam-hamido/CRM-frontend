import { useEffect, useState } from 'react'
import { CheckCheck, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  NotificationDeleteDialog,
  NotificationEmpty,
  NotificationError,
  NotificationList,
  NotificationLoading,
} from '@/features/notifications/components'
import { useMarkAllNotificationsRead } from '@/features/notifications/hooks/useMarkAllNotificationsRead'
import { useMarkNotificationRead } from '@/features/notifications/hooks/useMarkNotificationRead'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount'
import type { Notification } from '@/features/notifications/types/notification.types'

const PAGE_SIZE = 10

type ReadFilter = '' | 'unread' | 'read'

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [readFilter, setReadFilter] = useState<ReadFilter>('')
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, readFilter])

  const notificationsQuery = useNotifications({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isRead:
      readFilter === 'unread' ? false : readFilter === 'read' ? true : undefined,
  })

  const unreadCountQuery = useUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = notificationsQuery.data?.notifications ?? []
  const pagination = notificationsQuery.data?.pagination
  const unreadCount = unreadCountQuery.data?.count ?? 0
  const hasActiveFilters = Boolean(search || readFilter)
  const hasNotifications = pagination
    ? pagination.total > 0
    : notifications.length > 0

  const clearFilters = () => {
    setSearchInput('')
    setReadFilter('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            View the notifications in your inbox.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </span>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck aria-hidden="true" />
              Mark all as read
            </Button>
          ) : null}
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by title or message…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search notifications"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="read-filter"
            aria-label="Filter by read status"
            className="w-40"
            value={readFilter}
            onChange={(event) =>
              setReadFilter(event.target.value as ReadFilter)
            }
          >
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </SelectField>
        </div>
      </div>

      {notificationsQuery.isPending ? (
        <NotificationLoading />
      ) : notificationsQuery.isError ? (
        <NotificationError
          message={
            notificationsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE
          }
          onRetry={() => void notificationsQuery.refetch()}
        />
      ) : notifications.length === 0 ? (
        <NotificationEmpty
          hasActiveFilters={hasActiveFilters}
          onClearFilters={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkRead={(notification) => markRead.mutate(notification._id)}
          onDelete={setNotificationToDelete}
        />
      )}

      {hasNotifications && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="notifications"
        />
      ) : null}

      <NotificationDeleteDialog
        open={Boolean(notificationToDelete)}
        onOpenChange={(open) => {
          if (!open) setNotificationToDelete(null)
        }}
        notification={notificationToDelete}
      />
    </div>
  )
}