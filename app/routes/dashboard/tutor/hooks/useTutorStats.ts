/**
 * Custom Hook: useTutorStats
 * Hook de React Query para obtener las estadísticas de sesiones de un tutor
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTutoriaStats } from '~/lib/services/tutoria.service';
import type { TutoriaStats } from '~/lib/types/tutoria.types';

/**
 * Query Key para estadísticas del tutor
 */
export const TUTOR_STATS_QUERY_KEY = (tutorId: string) =>
	['tutor-stats', tutorId] as const;

/**
 * Hook para obtener las estadísticas de un tutor
 */
export function useTutorStats(
	tutorId: string,
	enabled = true,
): UseQueryResult<TutoriaStats, Error> {
	return useQuery({
		queryKey: TUTOR_STATS_QUERY_KEY(tutorId),
		queryFn: () => getTutoriaStats(tutorId),
		enabled: enabled && !!tutorId,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchOnWindowFocus: true,
		retry: 2,
	});
}
