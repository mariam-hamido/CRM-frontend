import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getMeeting } from '@/features/meetings/api/meetingApi'
import { meetingDetailQueryKey } from '@/features/meetings/hooks/meetingKeys'
import type { Meeting } from '@/features/meetings/types/meeting.types'

export function useMeeting(id: string | undefined) {
  return useQuery<Meeting, ApiError>({
    queryKey: meetingDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Meeting ID is required')
      const response = await getMeeting(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
