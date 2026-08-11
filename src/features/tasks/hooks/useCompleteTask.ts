import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { completeTask } from '@/features/tasks/api/taskApi'
import {
  taskDetailQueryKey,
  tasksQueryKey,
} from '@/features/tasks/hooks/taskKeys'
import type { Task } from '@/features/tasks/types/task.types'

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, ApiError, string>({
    mutationFn: async (id) => {
      const response = await completeTask(id)
      return response.data
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task>(taskDetailQueryKey(task._id), task)
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey })
      toast.success('Task completed successfully.')
    },
  })
}
