/**
 * Custom Hook: useStudentSessions
 * Hook de React Query para obtener las sesiones de tutoría de un estudiante
 */

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getStudentSessions } from '../services/tutoria.service';
import type { StudentSession } from '../types/tutoria.types';

/**
 * Query Key para sesiones del estudiante
 */
export const STUDENT_SESSIONS_QUERY_KEY = (studentId: string) =>
	['student-sessions', studentId] as const;

/**
 * Hook para obtener las sesiones de tutoría de un estudiante
 */
export function useStudentSessions(
	studentId: string,
	enabled = true,
): UseQueryResult<StudentSession[], Error> {
	return useQuery({
		queryKey: STUDENT_SESSIONS_QUERY_KEY(studentId),
		queryFn: () => getStudentSessions(studentId),
		enabled: enabled && !!studentId,
		staleTime: 2 * 60 * 1000, // 2 minutos
		refetchOnWindowFocus: true,
	});
}
