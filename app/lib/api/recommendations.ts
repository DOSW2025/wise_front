import apiClient from './client';
import { API_ENDPOINTS } from '../config/api.config';

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
		const { data } = await apiClient.post(
			API_ENDPOINTS.IA.RECOMMENDATIONS,
			payload,
		);
		return data;
	},
};
