import type { ApiResponse, Pagination } from '@/types/api'

export const MEETING_STATUSES = [
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
] as const
export type MeetingStatus = (typeof MEETING_STATUSES)[number]

export const MEETING_TYPES = ['in_person', 'phone', 'video'] as const
export type MeetingType = (typeof MEETING_TYPES)[number]

export const MEETING_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'meetingDate',
  'duration',
  'status',
] as const
export type MeetingSortField = (typeof MEETING_SORT_FIELDS)[number]

export const MEETING_SORT_ORDERS = ['asc', 'desc'] as const
export type MeetingSortOrder = (typeof MEETING_SORT_ORDERS)[number]

export interface Meeting {
  _id: string
  company: string
  customer: string
  organizer: string
  deal: string | null
  title: string
  description?: string
  meetingDate: string
  duration: number
  meetingType: MeetingType
  location?: string
  meetingLink?: string
  status: MeetingStatus
  notes?: string
  isDeleted: boolean
  isUpcoming: boolean
  createdAt: string
  updatedAt: string
}

export interface MeetingListParams {
  page?: number
  limit?: number
  search?: string
  status?: MeetingStatus
  meetingType?: MeetingType
  organizer?: string
  customer?: string
  deal?: string
  meetingDate?: string
  meetingFrom?: string
  meetingTo?: string
  sortBy?: MeetingSortField
  sortOrder?: MeetingSortOrder
}

export interface MeetingListData {
  meetings: Meeting[]
  pagination: Pagination
}

export interface CreateMeetingPayload {
  title: string
  customer: string
  meetingDate: string
  description?: string
  deal?: string
  duration?: number
  meetingType?: MeetingType
  location?: string
  meetingLink?: string
  notes?: string
}

export interface UpdateMeetingPayload {
  title?: string
  description?: string
  meetingDate?: string
  duration?: number
  meetingType?: MeetingType
  location?: string
  meetingLink?: string
  notes?: string
  customer?: string
  deal?: string
  status?: MeetingStatus
}

export type MeetingListResponse = ApiResponse<MeetingListData>
export type MeetingResponse = ApiResponse<Meeting>
export type DeleteMeetingResponse = ApiResponse<null>
export type CompleteMeetingResponse = ApiResponse<Meeting>
export type CancelMeetingResponse = ApiResponse<Meeting>
