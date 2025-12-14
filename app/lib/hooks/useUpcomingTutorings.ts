/**
 * Hook: useUpcomingTutorings
 * Hook personalizado para obtener las próximas tutorías confirmadas del estudiante
 */

import { useQuery } from '@tanstack/react-query';
import { getUpcomingSessions } from '../services/tutoria.service';
import type { UpcomingSessionsResponse } from '../types/tutoria.types';

interface UseUpcomingTutoringsOptions {
	userId: string;
	enabled?: boolean;
}

/**
 * Hook para obtener las próximas tutorías de un estudiante
 * @param userId - ID del estudiante
 * @param enabled - Si la consulta está habilitada (opcional)
 * @returns Query con las próximas tutorías
 */
export function useUpcomingTutorings({
	userId,
	enabled = true,
}: UseUpcomingTutoringsOptions) {
	return useQuery<UpcomingSessionsResponse, Error>({
		queryKey: ['upcoming-tutorings', userId],
		queryFn: () => getUpcomingSessions(userId),
		enabled: enabled && !!userId,
		staleTime: 2 * 60 * 1000, // 2 minutos
		refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
		retry: 2,
	});
}
