import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteTask } from '@/features/tasks/api/taskApi'
import {
  taskDetailQueryKey,
  tasksQueryKey,
} from '@/features/tasks/hooks/taskKeys'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteTask(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: taskDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey })
      toast.success('Task deleted successfully.')
    },
  })
}
