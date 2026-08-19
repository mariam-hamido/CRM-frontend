import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getUnreadCount } from '@/features/notifications/api/notificationApi'
import { notificationsUnreadCountQueryKey } from '@/features/notifications/hooks/notificationKeys'
import type { UnreadCountData } from '@/features/notifications/types/notification.types'

export function useUnreadCount() {
  return useQuery<UnreadCountData, ApiError>({
    queryKey: notificationsUnreadCountQueryKey(),
    queryFn: async () => {
      const response = await getUnreadCount()
      return response.data
    },
  })
}