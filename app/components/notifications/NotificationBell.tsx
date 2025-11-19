import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Bell } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications, type Notification } from '@/lib/api/notifications.mock';
import { NotificationList } from './NotificationList';

/**
 * Bell button used in the navbar to open the notifications panel.
 *
 * Data is loaded via React Query using a mock API so the
 * implementation can be swapped with Supabase later without
 * changing the component contract.
 */
export function NotificationBell() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const unreadCount = useMemo(
    () => notifications.filter((n: Notification) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) return;
  };

  const handleItemClick = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
  return (
    <Popover
      placement="bottom-end"
      offset={8}
      showArrow
      onOpenChange={handleOpenChange}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.15, ease: 'easeOut' },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.1, ease: 'easeIn' },
          },
        },
      }}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="relative"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge
              color="danger"
              content={unreadCount}
              className="absolute -top-1 -right-1 text-[11px]"
              size="sm"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-default-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Notificaciones</p>
            {unreadCount > 0 && (
              <span className="text-[11px] text-foreground-400">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <NotificationList
            notifications={notifications}
            // When a notification is clicked, we mark it as read
            // locally. In the future this callback can trigger a
            // React Query mutation against Supabase.
            onItemClick={handleItemClick}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
