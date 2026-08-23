import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  notificationDetailQueryKey,
  notificationsListQueryKey,
  notificationsUnreadCountQueryKey,
} from '@/features/notifications/hooks/notificationKeys'
import type {
  Notification,
  NotificationListData,
  NotificationListParams,
  UnreadCountData,
} from '@/features/notifications/types/notification.types'
import {
  selectIsAuthenticated,
  selectToken,
  useAuthStore,
} from '@/features/auth/store/authStore'
import {
  disconnectRealtime,
  ensureRealtimeConnection,
} from '@/lib/realtime/socketClient'

export const NOTIFICATION_NEW_EVENT = 'notification:new'

function isNotificationPayload(payload: unknown): payload is Notification {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as Notification)._id === 'string'
  )
}

function matchesListFilters(
  params: NotificationListParams | undefined,
  notification: Notification
): boolean {
  if (!params) {
    return true
  }

  // Never insert into cached lists whose filters the event cannot be
  // verified against; those lists stay consistent via normal refetches.
  if (params.isRead !== undefined && params.isRead !== notification.isRead) {
    return false
  }
  if (params.type && params.type !== notification.type) {
    return false
  }
  if (params.entityType && params.entityType !== notification.entityType) {
    return false
  }
  if (params.entityId && params.entityId !== notification.entityId) {
    return false
  }
  if (params.search) {
    return false
  }

  return true
}

function mergeNotificationIntoList(
  data: NotificationListData,
  notification: Notification
): NotificationListData {
  const exists = data.notifications.some(
    (item) => item._id === notification._id
  )

  if (exists) {
    return data
  }

  const { limit } = data.pagination
  const notifications = [notification, ...data.notifications]

  if (notifications.length > limit) {
    notifications.length = limit
  }

  const total = data.pagination.total + 1

  return {
    notifications,
    pagination: {
      ...data.pagination,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const token = useAuthStore(selectToken)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectRealtime()
      return
    }

    const socket = ensureRealtimeConnection(token)

    const handleNotificationNew = (payload: unknown) => {
      if (!isNotificationPayload(payload)) {
        return
      }

      const notification = payload

      queryClient.setQueryData<Notification>(
        notificationDetailQueryKey(notification._id),
        notification
      )

      for (const query of queryClient
        .getQueryCache()
        .findAll({ queryKey: notificationsListQueryKey().slice(0, 2) })) {
        const params = query.queryKey[2] as NotificationListParams | undefined

        if (!matchesListFilters(params, notification)) {
          continue
        }

        queryClient.setQueryData<NotificationListData>(
          query.queryKey,
          (cached) =>
            cached ? mergeNotificationIntoList(cached, notification) : cached
        )
      }

      if (!notification.isRead) {
        queryClient.setQueryData<UnreadCountData>(
          notificationsUnreadCountQueryKey(),
          (cached) => (cached ? { count: cached.count + 1 } : cached)
        )
      }
    }

    socket.on(NOTIFICATION_NEW_EVENT, handleNotificationNew)

    return () => {
      socket.off(NOTIFICATION_NEW_EVENT, handleNotificationNew)
    }
  }, [isAuthenticated, token, queryClient])
}
