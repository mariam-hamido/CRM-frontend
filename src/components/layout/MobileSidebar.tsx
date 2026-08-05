import { Sheet, SheetContent } from '@/components/ui/sheet'
import { NAVIGATION } from '@/config/navigation'
import { SidebarHeader } from '@/components/layout/SidebarHeader'
import { SidebarItem } from '@/components/layout/SidebarItem'

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-background p-0">
        <div className="flex h-full flex-col">
          <SidebarHeader />
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="flex flex-col gap-1">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <SidebarItem item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
