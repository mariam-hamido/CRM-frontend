import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getTasks } from '@/features/tasks/api/taskApi'
import { tasksListQueryKey } from '@/features/tasks/hooks/taskKeys'
import type {
  TaskListData,
  TaskListParams,
} from '@/features/tasks/types/task.types'

export function useTasks(params: TaskListParams = {}, enabled = true) {
  return useQuery<TaskListData, ApiError>({
    queryKey: tasksListQueryKey(params),
    queryFn: async () => {
      const response = await getTasks(params)
      return response.data
    },
    enabled,
  })
}
