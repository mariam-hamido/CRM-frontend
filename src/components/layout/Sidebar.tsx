import { NAVIGATION } from '@/config/navigation'
import { SidebarFooter } from '@/components/layout/SidebarFooter'
import { SidebarHeader } from '@/components/layout/SidebarHeader'
import { SidebarItem } from '@/components/layout/SidebarItem'
import { cn } from '@/lib/utils'

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      aria-label="Main navigation"
      className={cn(
        'hidden shrink-0 flex-col border-r bg-background transition-[width] duration-200 md:flex',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      <SidebarHeader collapsed={collapsed} />
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1">
          {NAVIGATION.map((item) => (
            <li key={item.href}>
              <SidebarItem item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>
      <SidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}
