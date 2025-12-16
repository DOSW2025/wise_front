/**
 * Notifications Service
 * Servicio para manejar las notificaciones del usuario
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	ApiResponse,
	NotificationDto,
	UnreadCountResponse,
} from '../types/api.types';
import { getStorageItem, STORAGE_KEYS } from '../utils/storage';

export const notificationsService = {
	/**
	 * Obtener todas las notificaciones del usuario
	 */
	getNotifications: async (): Promise<NotificationDto[]> => {
		try {
			const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
			const endpoint = API_ENDPOINTS.NOTIFICATIONS.LIST(user.id);
			console.log('[Notifications Service] GET:', endpoint);
			const response =
				await apiClient.get<ApiResponse<NotificationDto[]>>(endpoint);
			console.log('[Notifications Service] Response:', response.data);
			return response.data!;
		} catch (error) {
			console.error(
				'[Notifications Service] Error getting notifications:',
				error,
			);
			throw error;
		}
	},

	/**
	 * Obtener contador de notificaciones no leídas
	 */
	getUnreadCount: async (): Promise<number> => {
		try {
			const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
			const endpoint = API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT(user.id);
			console.log('[Notifications Service] GET:', endpoint);
			const response =
				await apiClient.get<ApiResponse<UnreadCountResponse>>(endpoint);
			console.log(
				'[Notifications Service] Unread count:',
				response.data?.Count,
			);
			return response.data?.Count;
		} catch (error) {
			console.error(
				'[Notifications Service] Error getting unread count:',
				error,
			);
			throw error;
		}
	},

	/**
	 * Marcar una notificación como leída
	 */
	markAsRead: async (id: string): Promise<void> => {
		try {
			const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id);
			console.log('[Notifications Service] PATCH:', endpoint);
			const response = await apiClient.patch(endpoint);
			console.log(
				'[Notifications Service] Mark as read response:',
				response.data,
			);
		} catch (error) {
			console.error('[Notifications Service] Error marking as read:', error);
			throw error;
		}
	},

	/**
	 * Marcar todas las notificaciones como leídas
	 */
	markAllAsRead: async (): Promise<void> => {
		try {
			const user = JSON.parse(getStorageItem(STORAGE_KEYS.USER) || '{}');
			const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(user.id);
			console.log('[Notifications Service] PATCH:', endpoint);
			const response = await apiClient.patch(endpoint);
			console.log(
				'[Notifications Service] Mark all as read response:',
				response.data,
			);
		} catch (error) {
			console.error(
				'[Notifications Service] Error marking all as read:',
				error,
			);
			throw error;
		}
	},

	/**
	 * Eliminar una notificación
	 */
	deleteNotification: async (id: string): Promise<void> => {
		try {
			const endpoint = API_ENDPOINTS.NOTIFICATIONS.DELETE(id);
			console.log('[Notifications Service] DELETE:', endpoint);
			const response = await apiClient.delete(endpoint);
			console.log('[Notifications Service] Delete response:', response.data);
		} catch (error) {
			console.error(
				'[Notifications Service] Error deleting notification:',
				error,
			);
			throw error;
		}
	},
};
