import { useLocation } from 'react-router-dom'
import { NAVIGATION } from '@/config/navigation'

export function Breadcrumbs() {
  const { pathname } = useLocation()

  const match = NAVIGATION.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  if (!match) return null

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center">
      <span className="truncate text-sm font-medium">{match.title}</span>
    </nav>
  )
}
