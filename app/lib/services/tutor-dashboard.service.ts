/**
 * Tutor Dashboard Service
 * Servicio para obtener datos del dashboard del tutor
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type {
	PopularMaterial,
	RecentReview,
	SessionRequest,
	TutorDashboardData,
	TutorStats,
	UpcomingSession,
} from '../types/tutor-dashboard.types';

/**
 * Obtener estadísticas del tutor
 */
export async function getTutorStats(): Promise<TutorStats> {
	try {
		const response = await apiClient.get<ApiResponse<TutorStats>>(
			`${API_ENDPOINTS.TUTOR.BASE}/stats`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching tutor stats:', error);
		// Datos mock para desarrollo
		return {
			tutoriasRealizadas: 23,
			calificacionPromedio: 4.8,
			estudiantesAtendidos: 15,
			solicitudesPendientes: 3,
		};
	}
}

/**
 * Obtener próximas sesiones
 */
export async function getUpcomingSessions(): Promise<UpcomingSession[]> {
	try {
		const response = await apiClient.get<ApiResponse<UpcomingSession[]>>(
			`${API_ENDPOINTS.TUTOR.BASE}/sessions/upcoming`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching upcoming sessions:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				studentName: 'Carlos Rodríguez',
				subject: 'Álgebra Lineal',
				date: new Date().toISOString(),
				time: '14:00',
				modality: 'virtual',
				status: 'confirmed',
			},
			{
				id: '2',
				studentName: 'Ana Martínez',
				subject: 'Estructuras de Datos',
				date: new Date(Date.now() + 86400000).toISOString(),
				time: '16:00',
				modality: 'presencial',
				status: 'pending',
			},
		];
	}
}

/**
 * Obtener solicitudes recientes
 */
export async function getRecentRequests(): Promise<SessionRequest[]> {
	try {
		const response = await apiClient.get<ApiResponse<SessionRequest[]>>(
			`${API_ENDPOINTS.TUTOR.BASE}/requests/recent`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching recent requests:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				studentName: 'María González',
				subject: 'Cálculo Diferencial',
				topic: 'Derivadas',
				date: new Date().toISOString(),
				time: '15:00',
				duration: 60,
				modality: 'virtual',
				description: 'Necesito ayuda con derivadas parciales',
				status: 'pending',
				createdAt: new Date(Date.now() - 7200000).toISOString(),
			},
			{
				id: '2',
				studentName: 'Juan Silva',
				subject: 'Programación I',
				topic: 'Algoritmos',
				date: new Date().toISOString(),
				time: '10:00',
				duration: 90,
				modality: 'presencial',
				description: 'Ayuda con algoritmos de ordenamiento',
				status: 'confirmed',
				createdAt: new Date(Date.now() - 86400000).toISOString(),
			},
		];
	}
}

/**
 * Obtener materiales populares del tutor
 */
export async function getPopularMaterials(): Promise<PopularMaterial[]> {
	try {
		const response = await apiClient.get<ApiResponse<PopularMaterial[]>>(
			`${API_ENDPOINTS.TUTOR.BASE}/materials/popular`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching popular materials:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				nombre: 'Guía de Derivadas',
				materia: 'Cálculo Diferencial',
				descargas: 156,
				calificacion: 4.9,
				weeklyGrowth: 12,
			},
			{
				id: '2',
				nombre: 'Ejercicios de Matrices',
				materia: 'Álgebra Lineal',
				descargas: 89,
				calificacion: 4.7,
				weeklyGrowth: 8,
			},
		];
	}
}

/**
 * Obtener reseñas recientes
 */
export async function getRecentReviews(): Promise<RecentReview[]> {
	try {
		const response = await apiClient.get<ApiResponse<RecentReview[]>>(
			`${API_ENDPOINTS.TUTOR.BASE}/reviews/recent`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching recent reviews:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				studentName: 'Laura Pérez',
				rating: 5,
				comment: 'Excelente explicación de integrales. Muy claro y paciente.',
				createdAt: new Date(Date.now() - 10800000).toISOString(),
			},
			{
				id: '2',
				studentName: 'Diego Ramírez',
				rating: 5,
				comment: 'Me ayudó mucho con los algoritmos de ordenamiento.',
				createdAt: new Date(Date.now() - 86400000).toISOString(),
			},
		];
	}
}

/**
 * Obtener todos los datos del dashboard
 */
export async function getTutorDashboardData(): Promise<TutorDashboardData> {
	try {
		const [
			stats,
			upcomingSessions,
			recentRequests,
			popularMaterials,
			recentReviews,
		] = await Promise.all([
			getTutorStats(),
			getUpcomingSessions(),
			getRecentRequests(),
			getPopularMaterials(),
			getRecentReviews(),
		]);

		return {
			stats,
			upcomingSessions,
			recentRequests,
			popularMaterials,
			recentReviews,
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		throw new Error('Error al cargar los datos del dashboard');
	}
}
