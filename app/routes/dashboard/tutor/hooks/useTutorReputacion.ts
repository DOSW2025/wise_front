/**
 * Custom Hook: useTutorReputacion
 * Hook de React Query para obtener la reputación y calificación promedio de un tutor
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTutorReputacion } from '~/lib/services/tutoria.service';
import type { TutorReputacion } from '~/lib/types/tutoria.types';

/**
 * Query Key para reputación del tutor
 */
export const TUTOR_REPUTACION_QUERY_KEY = (tutorId: string) =>
	['tutor-reputacion', tutorId] as const;

/**
 * Hook para obtener la reputación de un tutor
 */
export function useTutorReputacion(
	tutorId: string,
	enabled = true,
): UseQueryResult<TutorReputacion, Error> {
	return useQuery({
		queryKey: TUTOR_REPUTACION_QUERY_KEY(tutorId),
		queryFn: () => getTutorReputacion(tutorId),
		enabled: enabled && !!tutorId,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchOnWindowFocus: true,
		retry: 2,
	});
}
