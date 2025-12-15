import { useQuery } from '@tanstack/react-query';
import { getTutorFullProfile } from '../services/tutoria.service';

/**
 * Hook para obtener el perfil completo del tutor
 */
export function useTutorFullProfile(tutorId: string | null) {
	return useQuery({
		queryKey: ['tutorFullProfile', tutorId],
		queryFn: () => {
			if (!tutorId) throw new Error('tutorId is required');
			return getTutorFullProfile(tutorId);
		},
		enabled: !!tutorId,
		staleTime: 5 * 60 * 1000, // 5 minutos
		gcTime: 10 * 60 * 1000, // 10 minutos
	});
}
