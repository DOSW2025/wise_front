/**
 * Custom hook para obtener el historial de sesiones de un tutor
 */
import { useQuery } from '@tanstack/react-query';
import { getTutorSessions } from '~/lib/services/tutoria.service';
import type { TutorSessionHistoryResponse } from '~/lib/types/tutoria.types';

export function useTutorSessionHistory(tutorId: string, enabled = true) {
	return useQuery<TutorSessionHistoryResponse, Error>({
		queryKey: ['tutorSessionHistory', tutorId],
		queryFn: () => getTutorSessions(tutorId),
		enabled: enabled && !!tutorId,
		staleTime: 1000 * 60 * 5, // 5 minutos
		gcTime: 1000 * 60 * 10, // 10 minutos
	});
}
