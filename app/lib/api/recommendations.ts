import { API_ENDPOINTS } from '../config/api.config';
import type { AssistantResponse } from '../types/api.types';
import apiClient from './client';

interface AxiosErrorResponse {
	status?: number;
	data?: unknown;
}

export interface RecommendationsRequestDto {
	descripcion: string;
	materias: string[];
	temas: string[];
}

export const recommendationsService = {
	async getRecommendations(
		payload: RecommendationsRequestDto,
	): Promise<AssistantResponse> {
		try {
			const { data } = await apiClient.post(
				API_ENDPOINTS.IA.RECOMMENDATIONS,
				payload,
			);
			return data;
		} catch (error) {
			// Capturar específicamente errores 502 del servicio de IA
			const axiosError = error as { response?: AxiosErrorResponse };
			if (axiosError?.response?.status === 502) {
				throw new Error(
					'Disculpa, el servicio de IA no está disponible en este momento. Se encuentra estudiando el material de ECIwise+ para ayudarte mejor. Estará disponible en breve.',
				);
			}

			// Re-lanzar errores conocidos
			if (error instanceof Error) {
				throw error;
			}

			throw new Error('No se pudo obtener recomendaciones');
		}
	},
};
