import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutoriaService } from '~/lib/services/tutoria.service';

interface ConfirmSessionRequest {
	tutorId: string;
}

/**
 * Hook para confirmar una sesión de tutoría pendiente
 */
export const useConfirmSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			sessionId,
			tutorId,
		}: {
			sessionId: string;
			tutorId: string;
		}) => tutoriaService.confirmSession(sessionId, { tutorId }),
		onSuccess: (_data, variables) => {
			// Invalidar las queries relacionadas para refrescar los datos
			queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
			queryClient.invalidateQueries({
				queryKey: ['tutoria-stats', variables.tutorId],
			});
		},
	});
};
