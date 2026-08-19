import type { ApiResponse, Pagination } from '@/types/api'

export const NOTIFICATION_TYPES = [
  'system',
  'task',
  'meeting',
  'customer',
  'lead',
  'deal',
  'reminder',
  'success',
  'warning',
  'error',
] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const NOTIFICATION_ENTITY_TYPES = [
  'customer',
  'lead',
  'deal',
  'task',
  'meeting',
  'note',
  'attachment',
  'user',
  'company',
] as const
export type NotificationEntityType =
  (typeof NOTIFICATION_ENTITY_TYPES)[number]

export const NOTIFICATION_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
] as const
export type NotificationSortField =
  (typeof NOTIFICATION_SORT_FIELDS)[number]

export const NOTIFICATION_SORT_ORDERS = ['asc', 'desc'] as const
export type NotificationSortOrder =
  (typeof NOTIFICATION_SORT_ORDERS)[number]

export interface Notification {
  _id: string
  company: string
  user: string
  title: string
  message: string
  type: NotificationType
  entityType: NotificationEntityType | null
  entityId: string | null
  actionUrl: string | null
  isRead: boolean
  readAt: string | null
  expiresAt: string | null
  isExpired: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationListParams {
  page?: number
  limit?: number
  search?: string
  type?: NotificationType
  isRead?: boolean
  entityType?: NotificationEntityType
  entityId?: string
  sortBy?: NotificationSortField
  sortOrder?: NotificationSortOrder
}

export interface NotificationListData {
  notifications: Notification[]
  pagination: Pagination
}

export interface UnreadCountData {
  count: number
}

export interface MarkAllReadData {
  count: number
}

export type NotificationListResponse = ApiResponse<NotificationListData>
export type NotificationResponse = ApiResponse<Notification>
export type UnreadCountResponse = ApiResponse<UnreadCountData>
export type MarkReadResponse = ApiResponse<Notification>
export type MarkAllReadResponse = ApiResponse<MarkAllReadData>
export type DeleteNotificationResponse = ApiResponse<null>