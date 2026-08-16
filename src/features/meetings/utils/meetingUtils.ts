import type {
  MeetingCreateFormValues,
  MeetingUpdateFormValues,
} from '@/features/meetings/schemas/meeting.schema'
import type {
  CreateMeetingPayload,
  Meeting,
  UpdateMeetingPayload,
} from '@/features/meetings/types/meeting.types'

export const DEFAULT_MEETING_FORM_VALUES: MeetingCreateFormValues = {
  title: '',
  customer: '',
  meetingDate: '',
  description: '',
  deal: '',
  duration: '60',
  meetingType: 'in_person',
  location: '',
  meetingLink: '',
  notes: '',
}

export function formatMeetingDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatMeetingDuration(value?: number) {
  return value === undefined ? '—' : `${value} min`
}

function isoToDatetimeLocal(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (num: number) => String(num).padStart(2, '0')
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${day}T${time}`
}

export function meetingToFormValues(meeting: Meeting): MeetingUpdateFormValues {
  return {
    title: meeting.title,
    customer: meeting.customer,
    meetingDate: isoToDatetimeLocal(meeting.meetingDate),
    description: meeting.description ?? '',
    deal: meeting.deal ?? '',
    duration: String(meeting.duration),
    meetingType: meeting.meetingType,
    location: meeting.location ?? '',
    meetingLink: meeting.meetingLink ?? '',
    notes: meeting.notes ?? '',
    status: meeting.status,
  }
}

export function toCreateMeetingPayload(
  values: MeetingCreateFormValues
): CreateMeetingPayload {
  return {
    title: values.title,
    customer: values.customer,
    meetingDate: values.meetingDate,
    ...(values.description ? { description: values.description } : {}),
    ...(values.deal ? { deal: values.deal } : {}),
    ...(values.duration ? { duration: Number(values.duration) } : {}),
    ...(values.meetingType ? { meetingType: values.meetingType } : {}),
    ...(values.location ? { location: values.location } : {}),
    ...(values.meetingLink ? { meetingLink: values.meetingLink } : {}),
    ...(values.notes ? { notes: values.notes } : {}),
  }
}

export function toUpdateMeetingPayload(
  values: MeetingUpdateFormValues
): UpdateMeetingPayload {
  return {
    ...(values.title ? { title: values.title } : {}),
    ...(values.description ? { description: values.description } : {}),
    ...(values.meetingDate ? { meetingDate: values.meetingDate } : {}),
    ...(values.duration ? { duration: Number(values.duration) } : {}),
    ...(values.meetingType ? { meetingType: values.meetingType } : {}),
    ...(values.location ? { location: values.location } : {}),
    ...(values.meetingLink ? { meetingLink: values.meetingLink } : {}),
    ...(values.notes ? { notes: values.notes } : {}),
    ...(values.customer ? { customer: values.customer } : {}),
    ...(values.deal ? { deal: values.deal } : {}),
    ...(values.status ? { status: values.status } : {}),
  }
}
