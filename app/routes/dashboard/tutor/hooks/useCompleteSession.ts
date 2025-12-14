import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeSession } from '~/lib/services/tutoria.service';
import type { CompleteSessionRequest } from '~/lib/types/tutoria.types';

/**
 * Hook para completar una sesión de tutoría
 */
export function useCompleteSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			sessionId,
			data,
		}: {
			sessionId: string;
			data: CompleteSessionRequest;
		}) => completeSession(sessionId, data),
		onSuccess: () => {
			// Invalidar las queries de sesiones confirmadas para refrescar la lista
			queryClient.invalidateQueries({ queryKey: ['confirmedSessions'] });
		},
	});
}
