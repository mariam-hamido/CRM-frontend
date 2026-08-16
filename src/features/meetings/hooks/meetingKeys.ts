import type { MeetingListParams } from '@/features/meetings/types/meeting.types'

export const meetingsQueryKey = ['meetings'] as const

export function meetingsListQueryKey(params: MeetingListParams = {}) {
  return ['meetings', 'list', params] as const
}

export function meetingDetailQueryKey(id: string | undefined) {
  return ['meetings', 'detail', id] as const
}
