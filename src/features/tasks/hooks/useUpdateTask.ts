import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateTask } from '@/features/tasks/api/taskApi'
import {
  taskDetailQueryKey,
  tasksQueryKey,
} from '@/features/tasks/hooks/taskKeys'
import type { UpdateTaskPayload } from '@/features/tasks/types/task.types'
import type { Task } from '@/features/tasks/types/task.types'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation<
    Task,
    ApiError,
    { id: string; payload: UpdateTaskPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await updateTask(id, payload)
      return response.data
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task>(taskDetailQueryKey(task._id), task)
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey })
      toast.success('Task updated successfully.')
    },
  })
}
