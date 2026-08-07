import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { useGetCompany } from '@/features/companies/hooks/useGetCompany'
import {
  CompanySettingsError,
  CompanySettingsForm,
  CompanySettingsLoading,
} from '@/features/companies/components'

export default function CompanySettingsPage() {
  const companyQuery = useGetCompany()

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Company settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace profile and billing information.
        </p>
      </header>

      {companyQuery.isPending ? (
        <CompanySettingsLoading />
      ) : companyQuery.isError ? (
        <CompanySettingsError
          message={companyQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void companyQuery.refetch()}
        />
      ) : companyQuery.data ? (
        <CompanySettingsForm company={companyQuery.data} />
      ) : (
        <CompanySettingsLoading />
      )}
    </div>
  )
}
