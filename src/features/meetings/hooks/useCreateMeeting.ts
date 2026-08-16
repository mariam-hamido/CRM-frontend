import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createMeeting } from '@/features/meetings/api/meetingApi'
import { meetingsQueryKey } from '@/features/meetings/hooks/meetingKeys'
import type {
  CreateMeetingPayload,
  Meeting,
} from '@/features/meetings/types/meeting.types'

export function useCreateMeeting() {
  const queryClient = useQueryClient()

  return useMutation<Meeting, ApiError, CreateMeetingPayload>({
    mutationFn: async (payload) => {
      const response = await createMeeting(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKey })
      toast.success('Meeting created successfully.')
    },
  })
}
