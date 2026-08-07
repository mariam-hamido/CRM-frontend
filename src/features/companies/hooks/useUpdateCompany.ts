import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { updateCompany } from '@/features/companies/api/companyApi'
import { companyQueryKey } from '@/features/companies/hooks/useGetCompany'
import type {
  Company,
  UpdateCompanyRequest,
} from '@/features/companies/types/company.types'

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation<Company, ApiError, UpdateCompanyRequest>({
    mutationFn: async (payload) => {
      const response = await updateCompany(payload)
      return response.data
    },
    onSuccess: (company) => {
      queryClient.setQueryData<Company>(companyQueryKey, company)
      void queryClient.invalidateQueries({ queryKey: companyQueryKey })
    },
  })
}
