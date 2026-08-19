import { Badge } from '@/components/ui/badge'

export function NotificationStatusBadge({ isRead }: { isRead: boolean }) {
  return (
    <Badge variant={isRead ? 'outline' : 'default'}>
      {isRead ? 'Read' : 'Unread'}
    </Badge>
  )
}