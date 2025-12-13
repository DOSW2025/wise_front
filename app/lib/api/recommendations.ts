import { API_ENDPOINTS } from '../config/api.config';
import apiClient from './client';

export interface RecommendationsRequestDto {
	descripcion: string;
	materias: string[];
	temas: string[];
}

export type RecommendationsResponse = unknown;

export const recommendationsService = {
	async getRecommendations(
		payload: RecommendationsRequestDto,
	): Promise<RecommendationsResponse> {
		try {
			const { data } = await apiClient.post(
				API_ENDPOINTS.IA.RECOMMENDATIONS,
				payload,
			);
			return data;
		} catch (error: any) {
			// Capturar específicamente errores 502 del servicio de IA, por si no coneta quede chevre
			if (error?.response?.status === 502) {
				throw new Error(
					'Disculpa la IA no está, se encuentra estudiando el material de ECIwise+ para ayudarte, estará disponible en breve.',
				);
			}
			// Re-lanzar otros errores tal cual, por si tienen algun manejo de erores desde IA o algo.
			throw error;
		}
	},
};
