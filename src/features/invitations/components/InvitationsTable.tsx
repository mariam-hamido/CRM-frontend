import { MailX, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { InvitationStatusBadge } from '@/features/invitations/components/InvitationStatusBadge'
import type { Invitation } from '@/features/invitations/types/invitation.types'
import { formatDate } from '@/features/invitations/utils/invitationUtils'

export function InvitationsTable({
  invitations,
  onRemove,
}: {
  invitations: Invitation[]
  onRemove: (invitation: Invitation) => void
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 font-medium sm:px-6">Email</th>
              <th className="px-4 py-3 font-medium sm:px-6">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Invited
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                Accepted
              </th>
              <th className="px-4 py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr
                key={invitation._id}
                className="border-b transition-colors last:border-0 hover:bg-muted/50"
              >
                <td className="max-w-56 truncate px-4 py-3 font-medium sm:px-6">
                  {invitation.email}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <InvitationStatusBadge status={invitation.status} />
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {formatDate(invitation.invitedAt)}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                  {formatDate(invitation.acceptedAt)}
                </td>
                <td className="px-4 py-3 text-right sm:px-6">
                  {/* Only pending invitations are removable - matching the
                      backend contract; it remains the authorization boundary. */}
                  {invitation.status === 'pending' ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for invitation ${invitation.email}`}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => onRemove(invitation)}
                        >
                          <MailX aria-hidden="true" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
