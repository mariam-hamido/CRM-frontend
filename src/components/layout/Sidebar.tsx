import { getNavSections } from '@/constants/navigation'
import { SidebarFooter } from '@/components/layout/SidebarFooter'
import { SidebarHeader } from '@/components/layout/SidebarHeader'
import { SidebarSection } from '@/components/layout/SidebarSection'
import { cn } from '@/lib/utils'

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const sections = getNavSections()

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
          {sections.map((section) => (
            <li key={section.section}>
              <SidebarSection section={section} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>
      <SidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}
