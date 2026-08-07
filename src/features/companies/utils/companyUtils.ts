import type { CompanyUpdateFormValues } from '@/features/companies/schemas/company.schema'
import type { Company } from '@/features/companies/types/company.types'

export function companyToFormValues(company: Company): CompanyUpdateFormValues {
  return {
    name: company.name,
    logo: company.logo ?? '',
    industry: company.industry ?? '',
    website: company.website ?? '',
    phone: company.phone ?? '',
    email: company.email ?? '',
    country: company.country ?? '',
    city: company.city ?? '',
    address: company.address ?? '',
    subscriptionPlan: company.subscriptionPlan,
    status: company.status,
    timezone: company.timezone ?? '',
    currency: company.currency ?? '',
  }
}
