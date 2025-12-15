import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvailability } from '~/lib/services/tutoria.service';
import type { DisponibilidadSemanal } from '~/lib/types/tutoria.types';

interface UpdateAvailabilityParams {
	disponibilidad: DisponibilidadSemanal;
}

/**
 * Hook para actualizar la disponibilidad semanal de un tutor
 */
export function useUpdateAvailability(tutorId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation<{ message: string }, Error, UpdateAvailabilityParams>({
		mutationFn: (data) => {
			if (!tutorId) {
				throw new Error('Tutor ID es requerido');
			}
			return updateAvailability(tutorId, data);
		},
		onSuccess: () => {
			// Invalidar el cache de disponibilidad para refrescar los datos
			queryClient.invalidateQueries({
				queryKey: ['tutor-availability', tutorId],
			});
		},
	});
}
