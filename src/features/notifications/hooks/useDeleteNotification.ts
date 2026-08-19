import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteNotification } from '@/features/notifications/api/notificationApi'
import {
  notificationDetailQueryKey,
  notificationsQueryKey,
  notificationsUnreadCountQueryKey,
} from '@/features/notifications/hooks/notificationKeys'

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteNotification(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: notificationDetailQueryKey(id),
      })
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: notificationsUnreadCountQueryKey(),
      })
      toast.success('Notification deleted successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}