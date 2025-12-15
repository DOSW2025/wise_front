/**
 * Custom Hook: useCreateSession
 * Hook para crear una sesión de tutoría usando React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '../services/tutoria.service';
import type {
	CreateSessionRequest,
	CreateSessionResponse,
} from '../types/tutoria.types';
import { STUDENT_SESSIONS_QUERY_KEY } from './useStudentSessions';

/**
 * Hook para crear una sesión de tutoría
 */
export function useCreateSession() {
	const queryClient = useQueryClient();

	return useMutation<CreateSessionResponse, Error, CreateSessionRequest>({
		mutationFn: createSession,
		onSuccess: (data) => {
			// Invalidar las queries de sesiones del estudiante para refrescar la lista
			queryClient.invalidateQueries({
				queryKey: STUDENT_SESSIONS_QUERY_KEY(data.studentId),
			});
		},
	});
}
