import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubmitButton } from '@/features/auth/components'
import { useRemoveEmployee } from '@/features/employees/hooks/useRemoveEmployee'
import type { Employee } from '@/features/employees/types/employee.types'

export function EmployeeRemoveDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const removeEmployee = useRemoveEmployee()

  const handleRemove = () => {
    if (!employee) return
    removeEmployee.mutate(employee._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remove employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-medium text-foreground">
              {employee ? `${employee.firstName} ${employee.lastName}` : 'this employee'}
            </span>{' '}
            from your company?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          <ShieldAlert
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <ul className="list-disc space-y-1 pl-4">
            <li>They will immediately lose access to the CRM.</li>
            <li>Their historical records will remain in place.</li>
            <li>This does not delete any of their data.</li>
          </ul>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <SubmitButton
            variant="destructive"
            isLoading={removeEmployee.isPending}
            loadingText="Removing…"
            disabled={!employee}
            onClick={handleRemove}
          >
            Remove employee
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
