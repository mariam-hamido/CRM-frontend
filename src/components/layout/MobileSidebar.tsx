import { Sheet, SheetContent } from '@/components/ui/sheet'
import { getNavSections } from '@/constants/navigation'
import { SidebarHeader } from '@/components/layout/SidebarHeader'
import { SidebarSection } from '@/components/layout/SidebarSection'

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const sections = getNavSections()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-background p-0">
        <div className="flex h-full flex-col">
          <SidebarHeader />
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="flex flex-col gap-1">
              {sections.map((section) => (
                <li key={section.section}>
                  <SidebarSection section={section} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
