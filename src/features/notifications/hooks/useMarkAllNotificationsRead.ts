import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { markAllNotificationsRead } from '@/features/notifications/api/notificationApi'
import {
  notificationsQueryKey,
  notificationsUnreadCountQueryKey,
} from '@/features/notifications/hooks/notificationKeys'
import type { MarkAllReadData } from '@/features/notifications/types/notification.types'

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation<MarkAllReadData, ApiError, void>({
    mutationFn: async () => {
      const response = await markAllNotificationsRead()
      return response.data
    },
    onSuccess: () => {
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