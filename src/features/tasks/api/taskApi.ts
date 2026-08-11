import { apiClient } from '@/api/client'
import { TASKS } from '@/api/endpoints'
import type {
  CancelTaskResponse,
  CompleteTaskResponse,
  CreateTaskPayload,
  DeleteTaskResponse,
  TaskListParams,
  TaskListResponse,
  TaskResponse,
  UpdateTaskPayload,
} from '@/features/tasks/types/task.types'

export async function getTasks(
  params: TaskListParams = {}
): Promise<TaskListResponse> {
  const response = await apiClient.get<TaskListResponse>(TASKS.BASE, { params })
  return response.data
}

export async function getTask(id: string): Promise<TaskResponse> {
  const response = await apiClient.get<TaskResponse>(TASKS.DETAIL(id))
  return response.data
}

export async function createTask(
  data: CreateTaskPayload
): Promise<TaskResponse> {
  const response = await apiClient.post<TaskResponse>(TASKS.BASE, data)
  return response.data
}

export async function updateTask(
  id: string,
  data: UpdateTaskPayload
): Promise<TaskResponse> {
  const response = await apiClient.put<TaskResponse>(TASKS.DETAIL(id), data)
  return response.data
}

export async function deleteTask(id: string): Promise<DeleteTaskResponse> {
  const response = await apiClient.delete<DeleteTaskResponse>(TASKS.DETAIL(id))
  return response.data
}

export async function completeTask(id: string): Promise<CompleteTaskResponse> {
  const response = await apiClient.patch<CompleteTaskResponse>(
    TASKS.COMPLETE(id)
  )
  return response.data
}

export async function cancelTask(id: string): Promise<CancelTaskResponse> {
  const response = await apiClient.patch<CancelTaskResponse>(TASKS.CANCEL(id))
  return response.data
}
