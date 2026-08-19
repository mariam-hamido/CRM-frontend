import { apiClient } from '@/api/client'
import { NOTIFICATIONS } from '@/api/endpoints'
import type {
  DeleteNotificationResponse,
  MarkAllReadResponse,
  MarkReadResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from '@/features/notifications/types/notification.types'

export async function getNotifications(
  params: NotificationListParams = {}
): Promise<NotificationListResponse> {
  const response = await apiClient.get<NotificationListResponse>(
    NOTIFICATIONS.BASE,
    { params }
  )
  return response.data
}

export async function getNotification(
  id: string
): Promise<NotificationResponse> {
  const response = await apiClient.get<NotificationResponse>(
    NOTIFICATIONS.DETAIL(id)
  )
  return response.data
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await apiClient.get<UnreadCountResponse>(
    NOTIFICATIONS.UNREAD_COUNT
  )
  return response.data
}

export async function markNotificationRead(
  id: string
): Promise<MarkReadResponse> {
  const response = await apiClient.patch<MarkReadResponse>(
    NOTIFICATIONS.READ(id)
  )
  return response.data
}

export async function markAllNotificationsRead(): Promise<MarkAllReadResponse> {
  const response = await apiClient.patch<MarkAllReadResponse>(
    NOTIFICATIONS.READ_ALL
  )
  return response.data
}

export async function deleteNotification(
  id: string
): Promise<DeleteNotificationResponse> {
  const response = await apiClient.delete<DeleteNotificationResponse>(
    NOTIFICATIONS.DETAIL(id)
  )
  return response.data
}