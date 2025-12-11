/**
 * Tutor Dashboard Hook
 * Hook para manejar datos del dashboard del tutor
 */

import { useQuery } from '@tanstack/react-query';
import {
	getPopularMaterials,
	getRecentRequests,
	getRecentReviews,
	getTutorDashboardData,
	getTutorStats,
	getUpcomingSessions,
} from '../services/tutor-dashboard.service';

/**
 * Hook para obtener todos los datos del dashboard
 */
export function useTutorDashboard() {
	return useQuery({
		queryKey: ['tutor-dashboard'],
		queryFn: getTutorDashboardData,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchInterval: 10 * 60 * 1000, // Refrescar cada 10 minutos
	});
}

/**
 * Hook para obtener estadísticas del tutor
 */
export function useTutorStats() {
	return useQuery({
		queryKey: ['tutor-stats'],
		queryFn: getTutorStats,
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Hook para obtener próximas sesiones
 */
export function useUpcomingSessions() {
	return useQuery({
		queryKey: ['upcoming-sessions'],
		queryFn: getUpcomingSessions,
		staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente)
	});
}

/**
 * Hook para obtener solicitudes recientes
 */
export function useRecentRequests() {
	return useQuery({
		queryKey: ['recent-requests'],
		queryFn: getRecentRequests,
		staleTime: 1 * 60 * 1000, // 1 minuto (muy frecuente)
	});
}

/**
 * Hook para obtener materiales populares
 */
export function usePopularMaterials() {
	return useQuery({
		queryKey: ['popular-materials'],
		queryFn: getPopularMaterials,
		staleTime: 15 * 60 * 1000, // 15 minutos (menos frecuente)
	});
}

/**
 * Hook para obtener reseñas recientes
 */
export function useRecentReviews() {
	return useQuery({
		queryKey: ['recent-reviews'],
		queryFn: getRecentReviews,
		staleTime: 10 * 60 * 1000, // 10 minutos
	});
}
