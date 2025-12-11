/**
 * Student Dashboard Service
 * Servicio para obtener datos del dashboard del estudiante
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type {
	RecentActivity,
	RecentMaterial,
	RecommendedTutor,
	StudentDashboardData,
	StudentStats,
	UpcomingTutoring,
} from '../types/student-dashboard.types';

/**
 * Obtener estadísticas del estudiante
 */
export async function getStudentStats(): Promise<StudentStats> {
	try {
		const response = await apiClient.get<ApiResponse<StudentStats>>(
			API_ENDPOINTS.STUDENT.STATS,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching student stats:', error);
		// Datos mock para desarrollo
		return {
			tutoriasCompletadas: 12,
			proximasTutorias: 3,
			progresoAcademico: 85,
			materialesGuardados: 24,
		};
	}
}

/**
 * Obtener próximas tutorías
 */
export async function getUpcomingTutoring(): Promise<UpcomingTutoring[]> {
	try {
		const response = await apiClient.get<ApiResponse<UpcomingTutoring[]>>(
			API_ENDPOINTS.STUDENT.TUTORING.UPCOMING,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching upcoming tutoring:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				subject: 'Cálculo Diferencial',
				tutorName: 'Prof. Juan Pérez',
				date: new Date().toISOString(),
				time: '15:00',
				modality: 'virtual',
				status: 'confirmed',
			},
			{
				id: '2',
				subject: 'Programación POO',
				tutorName: 'María González',
				date: new Date(Date.now() + 86400000).toISOString(),
				time: '10:00',
				modality: 'presencial',
				status: 'pending',
			},
		];
	}
}

/**
 * Obtener tutores recomendados
 */
export async function getRecommendedTutors(): Promise<RecommendedTutor[]> {
	try {
		const response = await apiClient.get<ApiResponse<RecommendedTutor[]>>(
			API_ENDPOINTS.STUDENT.TUTORS.RECOMMENDED,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching recommended tutors:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				name: 'Ana Rodríguez',
				subject: 'Matemáticas',
				rating: 4.9,
				reviewCount: 23,
				availability: 'available',
				hourlyRate: 25000,
			},
			{
				id: '2',
				name: 'Carlos Morales',
				subject: 'Programación',
				rating: 4.8,
				reviewCount: 31,
				availability: 'busy',
				hourlyRate: 30000,
			},
		];
	}
}

/**
 * Obtener materiales recientes
 */
export async function getRecentMaterials(): Promise<RecentMaterial[]> {
	try {
		const response = await apiClient.get<ApiResponse<RecentMaterial[]>>(
			API_ENDPOINTS.STUDENT.MATERIALS.RECENT,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching recent materials:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				name: 'Guía de Derivadas',
				subject: 'Cálculo Diferencial',
				rating: 4.9,
				downloadedAt: new Date(Date.now() - 172800000).toISOString(), // 2 días
				type: 'downloaded',
			},
			{
				id: '2',
				name: 'Ejercicios POO',
				subject: 'Programación',
				rating: 4.7,
				downloadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 día
				type: 'saved',
			},
		];
	}
}

/**
 * Obtener actividad reciente
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
	try {
		const response = await apiClient.get<ApiResponse<RecentActivity[]>>(
			API_ENDPOINTS.STUDENT.ACTIVITY.RECENT,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching recent activity:', error);
		// Datos mock para desarrollo
		return [
			{
				id: '1',
				type: 'tutoring_completed',
				title: 'Tutoría completada',
				description: 'Álgebra Lineal con Prof. Ana',
				createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas
			},
			{
				id: '2',
				type: 'material_downloaded',
				title: 'Material descargado',
				description: 'Ejercicios de Matrices',
				createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día
			},
		];
	}
}

/**
 * Obtener todos los datos del dashboard
 */
export async function getStudentDashboardData(): Promise<StudentDashboardData> {
	try {
		const [
			stats,
			upcomingTutoring,
			recommendedTutors,
			recentMaterials,
			recentActivity,
		] = await Promise.all([
			getStudentStats(),
			getUpcomingTutoring(),
			getRecommendedTutors(),
			getRecentMaterials(),
			getRecentActivity(),
		]);

		return {
			stats,
			upcomingTutoring,
			recommendedTutors,
			recentMaterials,
			recentActivity,
		};
	} catch (error) {
		console.error('Error fetching student dashboard data:', error);
		throw new Error('Error al cargar los datos del dashboard');
	}
}
