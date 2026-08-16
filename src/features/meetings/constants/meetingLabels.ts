import type {
  MeetingStatus,
  MeetingType,
} from '@/features/meetings/types/meeting.types'

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
}

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  in_person: 'In person',
  phone: 'Phone',
  video: 'Video',
}
