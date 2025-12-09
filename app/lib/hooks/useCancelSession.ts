/**
 * Hook para cancelar sesiones de tutoría con React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSession } from '../services/tutoria.service';
import type { CancelSessionRequest } from '../types/tutoria.types';

interface CancelSessionParams {
	sessionId: string;
	data: CancelSessionRequest;
}

export function useCancelSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ sessionId, data }: CancelSessionParams) =>
			cancelSession(sessionId, data),
		onSuccess: () => {
			// Invalida las queries relacionadas para refrescar los datos
			queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-sessions'] });
			queryClient.invalidateQueries({ queryKey: ['tutoria-stats'] });
		},
		onError: (error) => {
			console.error('Error en mutación de cancelación:', error);
		},
	});
}
