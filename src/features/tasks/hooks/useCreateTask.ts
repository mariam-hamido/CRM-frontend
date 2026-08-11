import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createTask } from '@/features/tasks/api/taskApi'
import { tasksQueryKey } from '@/features/tasks/hooks/taskKeys'
import type { CreateTaskPayload } from '@/features/tasks/types/task.types'
import type { Task } from '@/features/tasks/types/task.types'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, ApiError, CreateTaskPayload>({
    mutationFn: async (payload) => {
      const response = await createTask(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey })
      toast.success('Task created successfully.')
    },
  })
}
