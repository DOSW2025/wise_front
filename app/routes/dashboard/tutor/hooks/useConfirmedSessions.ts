import { useQuery } from '@tanstack/react-query';
import { getConfirmedSessions } from '~/lib/services/tutoria.service';
import type { ConfirmedSessionsResponse } from '~/lib/types/tutoria.types';

/**
 * Hook personalizado para obtener las sesiones confirmadas del tutor
 * @param tutorId - ID del tutor autenticado
 * @returns Query con las sesiones confirmadas
 */
export function useConfirmedSessions(tutorId: string | undefined) {
	return useQuery<ConfirmedSessionsResponse, Error>({
		queryKey: ['confirmedSessions', tutorId],
		queryFn: () => {
			if (!tutorId) {
				throw new Error('Se requiere el ID del tutor');
			}
			return getConfirmedSessions(tutorId);
		},
		enabled: !!tutorId,
		staleTime: 1000 * 30, // 30 segundos
		refetchInterval: 1000 * 30, // Refetch cada 30 segundos
		refetchOnWindowFocus: true, // Refetch cuando el usuario vuelve a la ventana
		refetchOnMount: true, // Refetch al montar el componente
	});
}
