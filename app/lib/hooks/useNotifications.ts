/**
 * useNotifications Hook
 * Hook para manejar el estado de las notificaciones con React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import type { NotificationDto } from '../types/api.types';

const QUERY_KEYS = {
	notifications: ['notificaciones'] as const,
	unreadCount: ['notificaciones', 'unread-count'] as const,
};

export function useNotifications() {
	const queryClient = useQueryClient();

	// Query para obtener notificaciones
	const {
		data: notifications = [],
		isLoading: isLoadingNotifications,
		error: notificationsError,
		refetch: refetchNotifications,
	} = useQuery({
		queryKey: QUERY_KEYS.notifications,
		queryFn: notificationsService.getNotifications,
		refetchInterval: 30000,
		staleTime: 10000,
		retry: 1, // Solo 1 reintento
		retryDelay: 1000,
	});

	// Query para obtener contador de no leídas
	const {
		data: unreadCount = 0,
		isLoading: isLoadingCount,
		refetch: refetchCount,
	} = useQuery({
		queryKey: QUERY_KEYS.unreadCount,
		queryFn: notificationsService.getUnreadCount,
		refetchInterval: 30000,
		staleTime: 10000,
		retry: 1,
		retryDelay: 1000,
	});

	// Usar datos reales solo de la API
	const finalNotifications = notifications;
	const finalUnreadCount = unreadCount;

	// Mutation para marcar como leída individual
	const markAsReadMutation = useMutation({
		mutationFn: notificationsService.markAsRead,
		onSuccess: (_, notificationId) => {
			queryClient.setQueryData(
				QUERY_KEYS.notifications,
				(old: NotificationDto[]) => {
					if (!old) return old;
					return old.map((n) =>
						String(n.id) === String(notificationId) ? { ...n, visto: true } : n,
					);
				},
			);
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
		},
	});

	// Mutation para marcar todas como leídas
	const markAllAsReadMutation = useMutation({
		mutationFn: notificationsService.markAllAsRead,
		onSuccess: () => {
			// Actualizar cache optimísticamente
			queryClient.setQueryData(
				QUERY_KEYS.notifications,
				(old: NotificationDto[]) => {
					if (!old) return old;
					return old.map((n) => ({ ...n, visto: true }));
				},
			);
			queryClient.setQueryData(QUERY_KEYS.unreadCount, 0);
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
		},
	});

	// Mutation para eliminar notificación
	const deleteNotificationMutation = useMutation({
		mutationFn: notificationsService.deleteNotification,
		onSuccess: (_, notificationId) => {
			queryClient.setQueryData(
				QUERY_KEYS.notifications,
				(old: NotificationDto[]) => {
					if (!old) return old;
					return old.filter((n) => String(n.id) !== String(notificationId));
				},
			);
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
		},
	});

	return {
		// Data
		notifications: finalNotifications,
		unreadCount: finalUnreadCount,

		// States
		isLoading: isLoadingNotifications || isLoadingCount,
		error: notificationsError,

		// Actions
		markAsRead: markAsReadMutation.mutate,
		markAllAsRead: markAllAsReadMutation.mutate,
		deleteNotification: deleteNotificationMutation.mutate,
		refetch: () => {
			refetchNotifications();
			refetchCount();
		},

		// Loading states
		isMarkingAsRead: markAsReadMutation.isPending,
		isMarkingAllAsRead: markAllAsReadMutation.isPending,
		isDeleting: deleteNotificationMutation.isPending,
	};
}
