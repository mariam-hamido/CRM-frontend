import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { markNotificationRead } from '@/features/notifications/api/notificationApi'
import {
  notificationDetailQueryKey,
  notificationsQueryKey,
  notificationsUnreadCountQueryKey,
} from '@/features/notifications/hooks/notificationKeys'
import type { Notification } from '@/features/notifications/types/notification.types'

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation<Notification, ApiError, string>({
    mutationFn: async (id) => {
      const response = await markNotificationRead(id)
      return response.data
    },
    onSuccess: (notification) => {
      queryClient.setQueryData<Notification>(
        notificationDetailQueryKey(notification._id),
        notification
      )
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: notificationsUnreadCountQueryKey(),
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}