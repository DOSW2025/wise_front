/**
 * Custom Hook: useTutores
 * Hook de React Query para obtener la lista de tutores disponibles
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTutores } from '../services/tutoria.service';
import type { TutorProfile } from '../types/tutoria.types';

/**
 * Query Key para tutores
 */
export const TUTORES_QUERY_KEY = ['tutores'] as const;

/**
 * Hook para obtener la lista de tutores disponibles
 */
export function useTutores(): UseQueryResult<TutorProfile[], Error> {
	return useQuery({
		queryKey: TUTORES_QUERY_KEY,
		queryFn: getTutores,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchOnWindowFocus: false,
	});
}
