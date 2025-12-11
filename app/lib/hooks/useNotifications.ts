/**
 * useNotifications Hook
 * Hook para manejar el estado de las notificaciones con React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import type { NotificationDto } from '../types/api.types';

const QUERY_KEYS = {
	notifications: ['notifications'] as const,
	unreadCount: ['notifications', 'unread-count'] as const,
};

export function useNotifications() {
	const queryClient = useQueryClient();

	// Datos mock para desarrollo
	const mockNotifications: NotificationDto[] = [
		{
			id: '1',
			title: 'Nueva tutoría programada',
			message:
				'Tu tutoría de Cálculo con Dr. María García está programada para mañana a las 15:00',
			type: 'info',
			timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
			read: false,
			userId: 'dev-user',
		},
		{
			id: '2',
			title: 'Material disponible',
			message: 'Nuevo material de Programación Orientada a Objetos disponible',
			type: 'success',
			timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
			read: false,
			userId: 'dev-user',
		},
	];

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

	// Usar datos mock si hay error de conexión
	const finalNotifications = notificationsError
		? mockNotifications
		: notifications;
	const finalUnreadCount = notificationsError
		? mockNotifications.filter((n) => !n.read).length
		: unreadCount;

	// Mutation para marcar todas como leídas
	const markAllAsReadMutation = useMutation({
		mutationFn: notificationsService.markAllAsRead,
		onSuccess: () => {
			// Actualizar cache optimísticamente
			queryClient.setQueryData(
				QUERY_KEYS.notifications,
				(old: NotificationDto[]) => {
					if (!old) return old;
					return old.map((n) => ({ ...n, read: true }));
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
					const deletedNotification = old.find((n) => n.id === notificationId);
					const newNotifications = old.filter((n) => n.id !== notificationId);

					// Actualizar contador si la notificación eliminada no estaba leída
					if (!deletedNotification?.read) {
						queryClient.setQueryData(
							QUERY_KEYS.unreadCount,
							(oldCount: number) => Math.max(0, oldCount - 1),
						);
					}

					return newNotifications;
				},
			);
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
		markAllAsRead: markAllAsReadMutation.mutate,
		deleteNotification: deleteNotificationMutation.mutate,
		refetch: () => {
			refetchNotifications();
			refetchCount();
		},

		// Loading states
		isMarkingAllAsRead: markAllAsReadMutation.isPending,
		isDeleting: deleteNotificationMutation.isPending,
	};
}
