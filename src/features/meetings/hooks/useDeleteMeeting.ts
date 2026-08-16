import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteMeeting } from '@/features/meetings/api/meetingApi'
import {
  meetingDetailQueryKey,
  meetingsQueryKey,
} from '@/features/meetings/hooks/meetingKeys'

export function useDeleteMeeting() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteMeeting(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: meetingDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKey })
      toast.success('Meeting deleted successfully.')
    },
  })
}
