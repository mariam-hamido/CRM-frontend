import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getNotification } from '@/features/notifications/api/notificationApi'
import { notificationDetailQueryKey } from '@/features/notifications/hooks/notificationKeys'
import type { Notification } from '@/features/notifications/types/notification.types'

export function useNotification(id: string | undefined) {
  return useQuery<Notification, ApiError>({
    queryKey: notificationDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Notification ID is required')
      const response = await getNotification(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}