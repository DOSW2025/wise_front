/**
 * Notifications Service
 * Servicio para manejar las notificaciones del usuario
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	ApiResponse,
	NotificationDto,
	NotificationsResponse,
	UnreadCountResponse,
} from '../types/api.types';
import { getStorageItem, STORAGE_KEYS } from '../utils/storage';

export const notificationsService = {
	/**
	 * Obtener todas las notificaciones del usuario
	 */
	getNotifications: async (): Promise<NotificationDto[]> => {
		const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
		const endpoint = API_ENDPOINTS.NOTIFICATIONS.LIST.replace(
			':userId',
			user.id,
		);
		const response =
			await apiClient.get<ApiResponse<NotificationDto[]>>(endpoint);
		return response.data!;
	},

	/**
	 * Obtener contador de notificaciones no leídas
	 */
	getUnreadCount: async (): Promise<number> => {
		const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
		const endpoint = API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT.replace(
			':userId',
			user.id,
		);
		const response =
			await apiClient.get<ApiResponse<UnreadCountResponse>>(endpoint);
		return response.data!.Count;
	},

	/**
	 * Marcar una notificación como leída
	 */
	markAsRead: async (id: string): Promise<void> => {
		const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':id', id);
		await apiClient.patch(endpoint);
	},

	/**
	 * Marcar todas las notificaciones como leídas
	 */
	markAllAsRead: async (): Promise<void> => {
		const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
		const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ.replace(
			':userId',
			user.id,
		);
		await apiClient.patch(endpoint);
	},

	/**
	 * Eliminar una notificación
	 */
	deleteNotification: async (id: string): Promise<void> => {
		const endpoint = API_ENDPOINTS.NOTIFICATIONS.DELETE.replace(':id', id);
		await apiClient.delete(endpoint);
	},
};
