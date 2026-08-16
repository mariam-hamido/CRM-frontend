import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getMeetings } from '@/features/meetings/api/meetingApi'
import { meetingsListQueryKey } from '@/features/meetings/hooks/meetingKeys'
import type {
  MeetingListData,
  MeetingListParams,
} from '@/features/meetings/types/meeting.types'

export function useMeetings(params: MeetingListParams = {}, enabled = true) {
  return useQuery<MeetingListData, ApiError>({
    queryKey: meetingsListQueryKey(params),
    queryFn: async () => {
      const response = await getMeetings(params)
      return response.data
    },
    enabled,
  })
}
