import { API_ENDPOINTS } from '../config/api.config';
import apiClient from './client';

interface NavigationChatResponse {
	data?: {
		reply?: string;
	};
	reply?: string;
}

export const navigationChatService = {
	async sendMessage(message: string): Promise<string> {
		const { data } = await apiClient.post<NavigationChatResponse>(
			API_ENDPOINTS.IA.NAVIGATION_CHAT,
			{ message },
		);

		const reply = data?.data?.reply ?? data?.reply;
		if (!reply) {
			throw new Error('No se recibio respuesta del asistente.');
		}

		return reply;
	},
};
