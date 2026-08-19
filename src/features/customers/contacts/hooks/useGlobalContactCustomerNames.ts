import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getCustomer } from '@/features/customers/api/customerApi'
import { customerDetailQueryKey } from '@/features/customers/hooks/useGetCustomers'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import type { Customer } from '@/features/customers/types/customer.types'

export function useGlobalContactCustomerNames({
  contacts,
  customers = [],
}: {
  contacts: CustomerContact[]
  customers?: Customer[]
}): Map<string, string> {
  const customerIds = useMemo(
    () =>
      Array.from(
        new Set(contacts.map((contact) => contact.customer).filter(Boolean))
      ),
    [contacts]
  )

  const cachedCustomerIds = useMemo(
    () => new Set(customers.map((customer) => customer._id)),
    [customers]
  )

  const missingCustomerIds = useMemo(
    () => customerIds.filter((id) => !cachedCustomerIds.has(id)),
    [customerIds, cachedCustomerIds]
  )

  const customerQueries = useQueries({
    queries: missingCustomerIds.map((id) => ({
      queryKey: customerDetailQueryKey(id),
      queryFn: async () => {
        const response = await getCustomer(id)
        return response.data
      },
    })),
  })

  const customerNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const customer of customers) {
      names.set(customer._id, customer.companyName)
    }
    for (const query of customerQueries) {
      if (query.data) {
        names.set(query.data._id, query.data.companyName)
      }
    }
    return names
  }, [customers, customerQueries])

  return customerNames
}