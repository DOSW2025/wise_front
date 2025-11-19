import { Card, CardBody } from '@heroui/react';
import { useState } from 'react';
import type { Notification } from '@/lib/api/notifications.mock';

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
}

/**
 * Single notification entry in the dropdown list.
 *
 * Read state is handled locally for now. When Supabase is
 * integrated, this component can receive a `read` flag from
 * the API and optionally trigger a mutation on click.
 */
export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(false);

  const handleClick = () => {
    setIsRead(true);
    if (onClick) {
      onClick(notification.id);
    }
  };

  const createdDate = new Date(notification.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  const timeLabel = (() => {
    if (diffHours < 1) return 'Hace menos de 1 h';
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    return `${diffDays} días atrás`;
  })();

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left"
    >
      <Card
        className={`w-full shadow-none hover:bg-default-100 transition-colors ${
          isRead ? 'opacity-70' : 'bg-content1'
        }`}
        radius="lg"
      >
        <CardBody className="py-3 px-4 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {notification.title}
            </p>
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-primary mt-1" aria-hidden="true" />
            )}
          </div>
          <p className="text-xs text-foreground-500">
            {notification.description}
          </p>
          <p className="text-[11px] text-foreground-400 mt-1">{timeLabel}</p>
        </CardBody>
      </Card>
    </button>
  );
}

export default NotificationItem;
