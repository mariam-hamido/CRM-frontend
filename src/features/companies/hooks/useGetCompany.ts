import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getCompany } from '@/features/companies/api/companyApi'
import type { Company } from '@/features/companies/types/company.types'

export const companyQueryKey = ['companies', 'me'] as const

export function useGetCompany() {
  return useQuery<Company, ApiError>({
    queryKey: companyQueryKey,
    queryFn: async () => {
      const response = await getCompany()
      return response.data
    },
  })
}
