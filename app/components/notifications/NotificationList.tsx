import { ScrollShadow } from '@heroui/react';
import NotificationItem from './NotificationItem';
import type { Notification } from '@/lib/api/notifications.mock';

export interface NotificationListProps {
  notifications: Notification[];
  onItemClick?: (id: string) => void;
}

/**
 * Renders the list of notifications inside the popover panel.
 */
export function NotificationList({ notifications, onItemClick }: NotificationListProps) {
  if (!notifications.length) {
    return (
      <div className="py-6 px-4 text-center text-sm text-foreground-400">
        No tienes notificaciones nuevas.
      </div>
    );
  }

  return (
    <ScrollShadow className="max-h-80 w-full flex flex-col gap-2 px-2 py-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={onItemClick}
        />
      ))}
    </ScrollShadow>
  );
}

export default NotificationList;
