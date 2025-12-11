import { useQuery } from '@tanstack/react-query';
import { tutoriaService } from '~/lib/services/tutoria.service';
import type { PendingSessionsResponse } from '~/lib/types/tutoria.types';

/**
 * Hook para obtener las sesiones pendientes de confirmación de un tutor
 * @param tutorId - ID del tutor autenticado
 * @param enabled - Si el query debe ejecutarse (default: true)
 */
export const usePendingSessions = (tutorId: string, enabled = true) => {
	return useQuery<PendingSessionsResponse>({
		queryKey: ['pending-sessions', tutorId],
		queryFn: () => tutoriaService.getPendingSessions(tutorId),
		enabled: enabled && !!tutorId,
		staleTime: 1000 * 30, // 30 segundos
		refetchInterval: 1000 * 30, // Refetch cada 30 segundos
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});
};
