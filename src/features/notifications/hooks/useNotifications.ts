import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getNotifications } from '@/features/notifications/api/notificationApi'
import { notificationsListQueryKey } from '@/features/notifications/hooks/notificationKeys'
import type {
  NotificationListData,
  NotificationListParams,
} from '@/features/notifications/types/notification.types'

export function useNotifications(
  params: NotificationListParams = {},
  enabled = true
) {
  return useQuery<NotificationListData, ApiError>({
    queryKey: notificationsListQueryKey(params),
    queryFn: async () => {
      const response = await getNotifications(params)
      return response.data
    },
    enabled,
  })
}