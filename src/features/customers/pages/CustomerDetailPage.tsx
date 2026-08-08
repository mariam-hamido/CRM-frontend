import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Button } from '@/components/ui/button'
import {
  CompanyInfoCard,
  type CompanyInfoRow,
} from '@/features/companies/components'
import {
  CustomerListError,
  CustomerListLoading,
  CustomerSourceBadge,
  CustomerStatusBadge,
} from '@/features/customers/components'
import {
  CUSTOMER_SOURCE_LABELS,
  CUSTOMER_STATUS_LABELS,
} from '@/features/customers/constants/customerLabels'
import { CustomerContactsSection } from '@/features/customers/contacts/components/CustomerContactsSection'
import { useGetCustomer } from '@/features/customers/hooks/useGetCustomers'
import { useGetCompany } from '@/features/companies/hooks/useGetCompany'
import type { Customer } from '@/features/customers/types/customer.types'
import {
  formatCount,
  formatDate,
  formatRevenue,
} from '@/features/customers/utils/customerUtils'

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

function buildGeneralRows(customer: Customer): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = [
    { label: 'Company name', value: customer.companyName },
  ]
  if (customer.industry) {
    rows.push({ label: 'Industry', value: customer.industry })
  }
  if (customer.website) {
    rows.push({ label: 'Website', value: buildWebsite(customer.website) })
  }
  return rows
}

function buildContactRows(customer: Customer): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (customer.email) rows.push({ label: 'Email', value: customer.email })
  if (customer.phone) rows.push({ label: 'Phone', value: customer.phone })
  return rows
}

function buildLocationRows(customer: Customer): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (customer.country) rows.push({ label: 'Country', value: customer.country })
  if (customer.city) rows.push({ label: 'City', value: customer.city })
  if (customer.address) rows.push({ label: 'Address', value: customer.address })
  return rows
}

function buildBusinessRows(customer: Customer): CompanyInfoRow[] {
  return [
    {
      label: 'Status',
      value: customer.status ? CUSTOMER_STATUS_LABELS[customer.status] : '—',
    },
    {
      label: 'Source',
      value: customer.source ? CUSTOMER_SOURCE_LABELS[customer.source] : '—',
    },
    {
      label: 'Annual revenue',
      value: customer.annualRevenue
        ? formatRevenue(customer.annualRevenue)
        : '—',
    },
    {
      label: 'Employees',
      value: customer.employeesCount
        ? formatCount(customer.employeesCount)
        : '—',
    },
  ]
}

function buildMetadataRows(
  customer: Customer,
  workspaceName?: string
): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (workspaceName) {
    rows.push({ label: 'Workspace', value: workspaceName })
  }
  if (customer.createdAt) {
    rows.push({ label: 'Created', value: formatDate(customer.createdAt) })
  }
  if (customer.updatedAt) {
    rows.push({ label: 'Last updated', value: formatDate(customer.updatedAt) })
  }
  return rows
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const customerQuery = useGetCustomer(id)
  const companyQuery = useGetCompany()

  const customer = customerQuery.data

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        onClick={() => navigate(ROUTES.customers)}
      >
        <ArrowLeft aria-hidden="true" />
        Back to customers
      </Button>

      {customerQuery.isPending ? (
        <CustomerListLoading />
      ) : customerQuery.isError ? (
        <CustomerListError
          message={customerQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void customerQuery.refetch()}
        />
      ) : customer ? (
        <>
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {customer.companyName}
              </h1>
              <CustomerStatusBadge status={customer.status} />
              <CustomerSourceBadge source={customer.source} />
            </div>
            <p className="text-sm text-muted-foreground">
              {customer.industry ?? 'Customer information'}
            </p>
          </header>

          <section
            aria-label="Customer information"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <CompanyInfoCard
              title="General information"
              rows={buildGeneralRows(customer)}
            />
            <CompanyInfoCard
              title="Contact information"
              rows={buildContactRows(customer)}
            />
            <CompanyInfoCard
              title="Location"
              rows={buildLocationRows(customer)}
            />
            <CompanyInfoCard
              title="Business information"
              rows={buildBusinessRows(customer)}
            />
            <CompanyInfoCard
              title="Customer metadata"
              rows={buildMetadataRows(customer, companyQuery.data?.name)}
              className="lg:col-span-2"
            />
          </section>

          <CustomerContactsSection customerId={id ?? ''} />
        </>
      ) : (
        <CustomerListLoading />
      )}
    </div>
  )
}
