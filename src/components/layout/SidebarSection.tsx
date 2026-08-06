import type { NavSectionGroup } from '@/constants/navigation'
import { SidebarItem } from '@/components/layout/SidebarItem'

export function SidebarSection({
  section,
  collapsed = false,
}: {
  section: NavSectionGroup
  collapsed?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      {!collapsed ? (
        <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {section.label}
        </p>
      ) : null}
      <ul className="flex flex-col gap-1">
        {section.items.map((item) => (
          <li key={item.id}>
            <SidebarItem item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
    </div>
  )
}
