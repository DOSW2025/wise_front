/**
 * Custom Hook: useTutorMaterias
 * Hook para obtener las materias que puede dictar un tutor usando React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getTutorMaterias } from '../services/tutoria.service';

/**
 * Hook para obtener las materias de un tutor específico
 */
export function useTutorMaterias(tutorId: string | undefined, enabled = true) {
	return useQuery({
		queryKey: ['tutor-materias', tutorId],
		queryFn: () => {
			if (!tutorId) {
				throw new Error('Tutor ID es requerido');
			}
			return getTutorMaterias(tutorId);
		},
		enabled: enabled && !!tutorId,
		staleTime: 5 * 60 * 1000, // 5 minutos
		retry: 2,
	});
}
