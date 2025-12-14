import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutoriaService } from '~/lib/services/tutoria.service';

/**
 * Hook para rechazar una sesión de tutoría pendiente
 */
export const useRejectSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			sessionId,
			tutorId,
			razon,
		}: {
			sessionId: string;
			tutorId: string;
			razon: string;
		}) => tutoriaService.rejectSession(sessionId, { tutorId, razon }),
		onSuccess: (_data, variables) => {
			// Invalidar las queries relacionadas para refrescar los datos
			queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
			queryClient.invalidateQueries({
				queryKey: ['tutoria-stats', variables.tutorId],
			});
		},
	});
};
