/**
 * Student Dashboard Hook
 * Hook para manejar datos del dashboard del estudiante
 */

import { useQuery } from '@tanstack/react-query';
import {
	getRecentActivity,
	getRecentMaterials,
	getRecommendedTutors,
	getStudentDashboardData,
	getStudentStats,
	getUpcomingTutoring,
} from '../services/student-dashboard.service';

/**
 * Hook para obtener todos los datos del dashboard
 */
export function useStudentDashboard() {
	return useQuery({
		queryKey: ['student-dashboard'],
		queryFn: getStudentDashboardData,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchInterval: 10 * 60 * 1000, // Refrescar cada 10 minutos
	});
}

/**
 * Hook para obtener estadísticas del estudiante
 */
export function useStudentStats() {
	return useQuery({
		queryKey: ['student-stats'],
		queryFn: getStudentStats,
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Hook para obtener próximas tutorías
 */
export function useUpcomingTutoring() {
	return useQuery({
		queryKey: ['upcoming-tutoring'],
		queryFn: getUpcomingTutoring,
		staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente)
	});
}

/**
 * Hook para obtener tutores recomendados
 */
export function useRecommendedTutors() {
	return useQuery({
		queryKey: ['recommended-tutors'],
		queryFn: getRecommendedTutors,
		staleTime: 10 * 60 * 1000, // 10 minutos
	});
}

/**
 * Hook para obtener materiales recientes
 */
export function useRecentMaterials() {
	return useQuery({
		queryKey: ['recent-materials'],
		queryFn: getRecentMaterials,
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}

/**
 * Hook para obtener actividad reciente
 */
export function useRecentActivity() {
	return useQuery({
		queryKey: ['recent-activity'],
		queryFn: getRecentActivity,
		staleTime: 3 * 60 * 1000, // 3 minutos (frecuente para actividad)
	});
}
