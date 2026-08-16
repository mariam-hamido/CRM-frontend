import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateMeeting } from '@/features/meetings/api/meetingApi'
import {
  meetingDetailQueryKey,
  meetingsQueryKey,
} from '@/features/meetings/hooks/meetingKeys'
import type {
  Meeting,
  UpdateMeetingPayload,
} from '@/features/meetings/types/meeting.types'

export function useUpdateMeeting() {
  const queryClient = useQueryClient()

  return useMutation<
    Meeting,
    ApiError,
    { id: string; payload: UpdateMeetingPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await updateMeeting(id, payload)
      return response.data
    },
    onSuccess: (meeting) => {
      queryClient.setQueryData<Meeting>(
        meetingDetailQueryKey(meeting._id),
        meeting
      )
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKey })
      toast.success('Meeting updated successfully.')
    },
  })
}
