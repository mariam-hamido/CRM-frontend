import { apiClient } from '@/api/client'
import { COMPANIES } from '@/api/endpoints'
import type {
  GetCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@/features/companies/types/company.types'

export async function getCompany(): Promise<GetCompanyResponse> {
  const response = await apiClient.get<GetCompanyResponse>(COMPANIES.ME)
  return response.data
}

export async function updateCompany(
  data: UpdateCompanyRequest
): Promise<UpdateCompanyResponse> {
  const response = await apiClient.patch<UpdateCompanyResponse>(
    COMPANIES.ME,
    data
  )
  return response.data
}
