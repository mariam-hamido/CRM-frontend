import { useGetCompany } from '@/features/companies/hooks/useGetCompany'
import { formatCurrency } from '@/lib/currency'

export function useCurrencyFormatter() {
  const companyQuery = useGetCompany()
  const currency = companyQuery.data?.currency

  return {
    currency,
    formatCurrency: (value?: number | null, options?: Intl.NumberFormatOptions) =>
      formatCurrency(value, currency, options),
  }
}
