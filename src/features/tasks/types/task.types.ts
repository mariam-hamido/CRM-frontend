import type { ApiResponse, Pagination } from '@/types/api'

export const TASK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'overdue',
] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const TASK_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'dueDate',
  'priority',
  'status',
] as const
export type TaskSortField = (typeof TASK_SORT_FIELDS)[number]

export const TASK_SORT_ORDERS = ['asc', 'desc'] as const
export type TaskSortOrder = (typeof TASK_SORT_ORDERS)[number]

export interface Task {
  _id: string
  company: string
  assignedTo: string
  createdBy: string
  customer: string | null
  deal: string | null
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  reminderDate: string | null
  completedAt: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  isOverdue: boolean
}

export interface TaskListParams {
  page?: number
  limit?: number
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: string
  createdBy?: string
  customer?: string
  deal?: string
  dueDate?: string
  dueFrom?: string
  dueTo?: string
  sortBy?: TaskSortField
  sortOrder?: TaskSortOrder
}

export interface TaskListData {
  tasks: Task[]
  pagination: Pagination
}

export interface CreateTaskPayload {
  title: string
  assignedTo: string
  dueDate: string
  description?: string
  priority?: TaskPriority
  reminderDate?: string
  customer?: string
  deal?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string
  reminderDate?: string
  assignedTo?: string
  customer?: string
  deal?: string
}

export type TaskListResponse = ApiResponse<TaskListData>
export type TaskResponse = ApiResponse<Task>
export type DeleteTaskResponse = ApiResponse<null>
export type CompleteTaskResponse = ApiResponse<Task>
export type CancelTaskResponse = ApiResponse<Task>
