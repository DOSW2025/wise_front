/**
 * Tutor Profile Hook
 * Hook para obtener el perfil del tutor
 */

import { useQuery } from '@tanstack/react-query';
import { getTutorProfile } from '../services/tutor-profile.service';

/**
 * Hook para obtener el perfil del tutor
 */
export function useTutorProfile(tutorId: string | null) {
	return useQuery({
		queryKey: ['tutor-profile', tutorId],
		queryFn: () => {
			if (!tutorId) throw new Error('Tutor ID is required');
			return getTutorProfile(tutorId);
		},
		enabled: !!tutorId,
		staleTime: 10 * 60 * 1000, // 10 minutos
	});
}
