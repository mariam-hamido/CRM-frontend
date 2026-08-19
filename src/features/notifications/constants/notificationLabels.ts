import type {
  NotificationEntityType,
  NotificationType,
} from '@/features/notifications/types/notification.types'

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  system: 'System',
  task: 'Task',
  meeting: 'Meeting',
  customer: 'Customer',
  lead: 'Lead',
  deal: 'Deal',
  reminder: 'Reminder',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
}

export const NOTIFICATION_ENTITY_TYPE_LABELS: Record<
  NotificationEntityType,
  string
> = {
  customer: 'Customer',
  lead: 'Lead',
  deal: 'Deal',
  task: 'Task',
  meeting: 'Meeting',
  note: 'Note',
  attachment: 'Attachment',
  user: 'User',
  company: 'Company',
}