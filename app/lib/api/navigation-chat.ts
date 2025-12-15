import { API_ENDPOINTS } from '../config/api.config';
import apiClient from './client';

interface NavigationChatResponse {
	data?: {
		reply?: string;
	};
	reply?: string;
}

const FALLBACK_NAV_PATH = '/api/chat/nav';

export const navigationChatService = {
	async sendMessage(message: string): Promise<string> {
		try {
			const { data } = await apiClient.post<NavigationChatResponse>(
				API_ENDPOINTS.IA.NAVIGATION_CHAT,
				{ message },
			);

			const reply = data?.data?.reply ?? data?.reply;
			if (!reply) {
				throw new Error('No se recibio respuesta del asistente.');
			}
			return reply;
		} catch (error: any) {
			const status = error?.response?.status;

			// Fallback a la ruta sin prefijo si el gateway responde 404
			if (
				status === 404 &&
				API_ENDPOINTS.IA.NAVIGATION_CHAT !== FALLBACK_NAV_PATH
			) {
				const { data } = await apiClient.post<NavigationChatResponse>(
					FALLBACK_NAV_PATH,
					{ message },
				);
				const reply = data?.data?.reply ?? data?.reply;
				if (reply) return reply;
			}

			throw error instanceof Error
				? error
				: new Error('No se recibio respuesta del asistente.');
		}
	},
};
