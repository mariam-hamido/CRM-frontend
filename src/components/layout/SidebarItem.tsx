import { NavLink } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function SidebarItem({
  item,
  collapsed = false,
  className,
}: {
  item: NavItem
  collapsed?: boolean
  className?: string
}) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          isActive &&
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
          collapsed && 'justify-center px-0',
          className
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed ? <span className="truncate">{item.title}</span> : null}
    </NavLink>
  )

  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
      {!collapsed && item.children?.length ? (
        <div className="mt-1 flex flex-col gap-1 pl-4">
          {item.children.map((child) => (
            <SidebarItem key={child.href} item={child} />
          ))}
        </div>
      ) : null}
    </>
  )
}
