import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '~/lib/services/tutoria.service';
import type { DisponibilidadSemanal } from '~/lib/types/tutoria.types';

/**
 * Hook para obtener la disponibilidad semanal de un tutor
 */
export function useAvailability(tutorId: string | undefined) {
	return useQuery<DisponibilidadSemanal, Error>({
		queryKey: ['tutor-availability', tutorId],
		queryFn: () => {
			if (!tutorId) {
				throw new Error('Tutor ID es requerido');
			}
			return getAvailability(tutorId);
		},
		enabled: !!tutorId,
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}
