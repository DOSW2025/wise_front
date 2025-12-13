/**
 * Hook para enviar calificaciones de sesiones de tutoría
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '~/lib/api/client';
import { API_ENDPOINTS } from '~/lib/config/api.config';

export interface RatingPayload {
	raterId: string;
	sessionId: string;
	score: number; // 1-5
	comment: string;
}

export interface RatingResponse {
	message: string;
	rating: {
		id: string;
		raterId: string;
		sessionId: string;
		score: number;
		comment: string;
		createdAt: string;
	};
}

export function useSubmitRating() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: RatingPayload) => {
			const response = await apiClient.post<RatingResponse>(
				API_ENDPOINTS.TUTORIAS.RATINGS,
				payload,
			);
			return response.data;
		},
		onSuccess: () => {
			// Invalidar las queries de sesiones del estudiante para refrescar la lista
			queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
		},
	});
}
