import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getTask } from '@/features/tasks/api/taskApi'
import { taskDetailQueryKey } from '@/features/tasks/hooks/taskKeys'
import type { Task } from '@/features/tasks/types/task.types'

export function useTask(id: string | undefined) {
  return useQuery<Task, ApiError>({
    queryKey: taskDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Task ID is required')
      const response = await getTask(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
