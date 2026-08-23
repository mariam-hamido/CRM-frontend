import { Badge, type BadgeProps } from '@/components/ui/badge'

// Human-readable membership status - never exposes backend internals
// like "isActive".
const STATUS_VARIANTS: Record<
  'active' | 'inactive',
  NonNullable<BadgeProps['variant']>
> = {
  active: 'default',
  inactive: 'secondary',
}

export function EmployeeStatusBadge({ isActive }: { isActive: boolean }) {
  const status = isActive ? 'active' : 'inactive'
  const label = isActive ? 'Active' : 'Inactive'

  return <Badge variant={STATUS_VARIANTS[status]}>{label}</Badge>
}
