import type { NotificationListParams } from '@/features/notifications/types/notification.types'

export const notificationsQueryKey = ['notifications'] as const

export function notificationsListQueryKey(
  params: NotificationListParams = {}
) {
  return ['notifications', 'list', params] as const
}

export function notificationDetailQueryKey(id: string | undefined) {
  return ['notifications', 'detail', id] as const
}

export function notificationsUnreadCountQueryKey() {
  return ['notifications', 'unread-count'] as const
}