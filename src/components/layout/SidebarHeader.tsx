import { Link } from 'react-router-dom'
import { Blocks } from 'lucide-react'
import { ROUTES } from '@/app/router/routeConstants'

export function SidebarHeader({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex h-14 shrink-0 items-center border-b px-3">
      <Link
        to={ROUTES.dashboard}
        className="flex min-w-0 items-center gap-2"
        aria-label="FlowCRM home"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Blocks className="size-4" aria-hidden="true" />
        </div>
        {!collapsed ? (
          <span className="truncate text-sm font-semibold whitespace-nowrap">
            FlowCRM
          </span>
        ) : null}
      </Link>
    </div>
  )
}
