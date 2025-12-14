/**
 * Custom Hook: useTutorProfile
 * Hook de React Query para obtener el perfil del tutor con sus ratings/comentarios
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTutorProfile } from '~/lib/services/tutoria.service';
import type { TutorProfileResponse } from '~/lib/types/tutoria.types';

/**
 * Query Key para el perfil del tutor
 */
export const TUTOR_PROFILE_QUERY_KEY = (tutorId: string) =>
	['tutor-profile', tutorId] as const;

/**
 * Hook para obtener el perfil del tutor con ratings
 */
export function useTutorProfile(
	tutorId: string,
	enabled = true,
): UseQueryResult<TutorProfileResponse, Error> {
	return useQuery({
		queryKey: TUTOR_PROFILE_QUERY_KEY(tutorId),
		queryFn: () => getTutorProfile(tutorId),
		enabled: enabled && !!tutorId,
		staleTime: 2 * 60 * 1000, // 2 minutos (los comentarios son más dinámicos)
		refetchOnWindowFocus: true,
		retry: 2,
	});
}
