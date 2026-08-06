import { NavLink } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem } from '@/constants/navigation'
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

  const icon = <Icon className="size-4 shrink-0" aria-hidden="true" />
  const label = !collapsed ? (
    <>
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {item.badge}
        </span>
      ) : null}
    </>
  ) : null

  const content = item.disabled ? (
    <span
      aria-disabled="true"
      className={cn(
        'flex h-8 cursor-not-allowed items-center gap-2.5 rounded-lg px-2 text-sm font-medium text-muted-foreground opacity-50',
        collapsed && 'justify-center px-0',
        className
      )}
    >
      {icon}
      {label}
    </span>
  ) : (
    <NavLink
      to={item.path}
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
      {icon}
      {label}
    </NavLink>
  )

  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        content
      )}
      {!collapsed && item.children?.length ? (
        <div className="mt-1 flex flex-col gap-1 pl-4">
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} />
          ))}
        </div>
      ) : null}
    </>
  )
}
