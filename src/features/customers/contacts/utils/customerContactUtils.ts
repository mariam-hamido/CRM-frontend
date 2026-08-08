import type { CustomerContactFormValues } from '@/features/customers/contacts/schemas/customerContact.schema'
import type {
  CreateContactPayload,
  CustomerContact,
  UpdateContactPayload,
} from '@/features/customers/contacts/types/customerContact.types'

export function contactToFormValues(
  contact: CustomerContact
): CustomerContactFormValues {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    jobTitle: contact.jobTitle ?? '',
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    isPrimary: contact.isPrimary,
  }
}

export function toCreateContactPayload(
  values: CustomerContactFormValues,
  customerId: string
): CreateContactPayload {
  return {
    customer: customerId,
    firstName: values.firstName,
    lastName: values.lastName,
    ...(values.jobTitle ? { jobTitle: values.jobTitle } : {}),
    ...(values.email ? { email: values.email } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    isPrimary: values.isPrimary,
  }
}

export function toUpdateContactPayload(
  values: CustomerContactFormValues
): UpdateContactPayload {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    ...(values.jobTitle ? { jobTitle: values.jobTitle } : {}),
    ...(values.email ? { email: values.email } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    isPrimary: values.isPrimary,
  }
}
