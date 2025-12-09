/**
 * Custom Hook: useUpcomingSessions
 * Hook de React Query para obtener las próximas sesiones de tutoría de un estudiante
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getUpcomingSessions } from '../services/tutoria.service';
import type { UpcomingSessionsResponse } from '../types/tutoria.types';

/**
 * Query Key para próximas sesiones
 */
export const UPCOMING_SESSIONS_QUERY_KEY = (userId: string) =>
	['upcoming-sessions', userId] as const;

/**
 * Hook para obtener las próximas sesiones de tutoría de un estudiante
 */
export function useUpcomingSessions(
	userId: string,
	enabled = true,
): UseQueryResult<UpcomingSessionsResponse, Error> {
	return useQuery({
		queryKey: UPCOMING_SESSIONS_QUERY_KEY(userId),
		queryFn: () => getUpcomingSessions(userId),
		enabled: enabled && !!userId,
		staleTime: 3 * 60 * 1000, // 3 minutos
		refetchOnWindowFocus: true,
		retry: 2,
	});
}
