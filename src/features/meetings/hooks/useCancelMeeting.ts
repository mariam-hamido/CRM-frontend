import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { cancelMeeting } from '@/features/meetings/api/meetingApi'
import {
  meetingDetailQueryKey,
  meetingsQueryKey,
} from '@/features/meetings/hooks/meetingKeys'
import type { Meeting } from '@/features/meetings/types/meeting.types'

export function useCancelMeeting() {
  const queryClient = useQueryClient()

  return useMutation<Meeting, ApiError, string>({
    mutationFn: async (id) => {
      const response = await cancelMeeting(id)
      return response.data
    },
    onSuccess: (meeting) => {
      queryClient.setQueryData<Meeting>(
        meetingDetailQueryKey(meeting._id),
        meeting
      )
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKey })
      toast.success('Meeting cancelled successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
