import type { TaskListParams } from '@/features/tasks/types/task.types'

export const tasksQueryKey = ['tasks'] as const

export function tasksListQueryKey(params: TaskListParams = {}) {
  return ['tasks', 'list', params] as const
}

export function taskDetailQueryKey(id: string | undefined) {
  return ['tasks', 'detail', id] as const
}
