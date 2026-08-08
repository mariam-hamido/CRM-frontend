import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import {
  CompanyHeader,
  CompanyInfoCard,
  CompanyOverviewError,
  CompanyOverviewLoading,
  type CompanyInfoRow,
} from '@/features/companies/components'
import {
  COMPANY_STATUS_LABELS,
  COMPANY_SUBSCRIPTION_PLAN_LABELS,
} from '@/features/companies/constants/companyLabels'
import { useGetCompany } from '@/features/companies/hooks/useGetCompany'
import type { Company } from '@/features/companies/types/company.types'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildWebsite(value: string) {
  const isAbsoluteUrl = /^https?:\/\//i.test(value)
  if (!isAbsoluteUrl) return value

  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-4 hover:opacity-80"
    >
      {value}
    </a>
  )
}

function buildGeneralRows(company: Company): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = [
    { label: 'Company name', value: company.name },
  ]
  if (company.industry) rows.push({ label: 'Industry', value: company.industry })
  if (company.website) {
    rows.push({ label: 'Website', value: buildWebsite(company.website) })
  }
  return rows
}

function buildContactRows(company: Company): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (company.email) rows.push({ label: 'Email', value: company.email })
  if (company.phone) rows.push({ label: 'Phone', value: company.phone })
  return rows
}

function buildLocationRows(company: Company): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (company.country) rows.push({ label: 'Country', value: company.country })
  if (company.city) rows.push({ label: 'City', value: company.city })
  if (company.address) rows.push({ label: 'Address', value: company.address })
  if (company.timezone) {
    rows.push({ label: 'Timezone', value: company.timezone })
  }
  return rows
}

function buildBusinessRows(company: Company): CompanyInfoRow[] {
  return [
    {
      label: 'Subscription plan',
      value: COMPANY_SUBSCRIPTION_PLAN_LABELS[company.subscriptionPlan],
    },
    { label: 'Currency', value: company.currency },
    { label: 'Status', value: COMPANY_STATUS_LABELS[company.status] },
  ]
}

function buildMetadataRows(company: Company): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (company.createdAt) {
    rows.push({ label: 'Created', value: formatDate(company.createdAt) })
  }
  if (company.updatedAt) {
    rows.push({ label: 'Last updated', value: formatDate(company.updatedAt) })
  }
  return rows
}

export default function CompaniesPage() {
  const companyQuery = useGetCompany()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Company overview
        </h1>
        <p className="text-sm text-muted-foreground">
          A summary of your workspace profile and billing information.
        </p>
      </header>

      {companyQuery.isPending ? (
        <CompanyOverviewLoading />
      ) : companyQuery.isError ? (
        <CompanyOverviewError
          message={companyQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void companyQuery.refetch()}
        />
      ) : companyQuery.data ? (
        <>
          <CompanyHeader company={companyQuery.data} />

          <section
            aria-label="Company information"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <CompanyInfoCard
              title="General information"
              rows={buildGeneralRows(companyQuery.data)}
            />
            <CompanyInfoCard
              title="Contact information"
              rows={buildContactRows(companyQuery.data)}
            />
            <CompanyInfoCard
              title="Location"
              rows={buildLocationRows(companyQuery.data)}
            />
            <CompanyInfoCard
              title="Business information"
              rows={buildBusinessRows(companyQuery.data)}
            />
            <CompanyInfoCard
              title="Company metadata"
              rows={buildMetadataRows(companyQuery.data)}
              className="lg:col-span-2"
            />
          </section>
        </>
      ) : (
        <CompanyOverviewLoading />
      )}
    </div>
  )
}
