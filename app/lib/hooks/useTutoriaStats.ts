/**
 * Custom Hook: useTutoriaStats
 * Hook de React Query para obtener las estadísticas de tutorías de un estudiante
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTutoriaStats } from '../services/tutoria.service';
import type { TutoriaStats } from '../types/tutoria.types';

/**
 * Query Key para estadísticas de tutorías
 */
export const TUTORIA_STATS_QUERY_KEY = (userId: string) =>
	['tutoria-stats', userId] as const;

/**
 * Hook para obtener las estadísticas de tutorías de un estudiante
 */
export function useTutoriaStats(
	userId: string,
	enabled = true,
): UseQueryResult<TutoriaStats, Error> {
	return useQuery({
		queryKey: TUTORIA_STATS_QUERY_KEY(userId),
		queryFn: () => getTutoriaStats(userId),
		enabled: enabled && !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchOnWindowFocus: true,
		retry: 2,
	});
}
