import { apiClient } from '@/api/client'
import { MEETINGS } from '@/api/endpoints'
import type {
  CancelMeetingResponse,
  CompleteMeetingResponse,
  CreateMeetingPayload,
  DeleteMeetingResponse,
  MeetingListParams,
  MeetingListResponse,
  MeetingResponse,
  UpdateMeetingPayload,
} from '@/features/meetings/types/meeting.types'

export async function getMeetings(
  params: MeetingListParams = {}
): Promise<MeetingListResponse> {
  const response = await apiClient.get<MeetingListResponse>(MEETINGS.BASE, {
    params,
  })
  return response.data
}

export async function getMeeting(id: string): Promise<MeetingResponse> {
  const response = await apiClient.get<MeetingResponse>(MEETINGS.DETAIL(id))
  return response.data
}

export async function createMeeting(
  data: CreateMeetingPayload
): Promise<MeetingResponse> {
  const response = await apiClient.post<MeetingResponse>(MEETINGS.BASE, data)
  return response.data
}

export async function updateMeeting(
  id: string,
  data: UpdateMeetingPayload
): Promise<MeetingResponse> {
  const response = await apiClient.put<MeetingResponse>(
    MEETINGS.DETAIL(id),
    data
  )
  return response.data
}

export async function deleteMeeting(
  id: string
): Promise<DeleteMeetingResponse> {
  const response = await apiClient.delete<DeleteMeetingResponse>(
    MEETINGS.DETAIL(id)
  )
  return response.data
}

export async function completeMeeting(
  id: string
): Promise<CompleteMeetingResponse> {
  const response = await apiClient.patch<CompleteMeetingResponse>(
    MEETINGS.COMPLETE(id)
  )
  return response.data
}

export async function cancelMeeting(
  id: string
): Promise<CancelMeetingResponse> {
  const response = await apiClient.patch<CancelMeetingResponse>(
    MEETINGS.CANCEL(id)
  )
  return response.data
}
