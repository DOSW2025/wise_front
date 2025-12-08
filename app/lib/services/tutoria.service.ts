/**
 * Tutoria Service
 * Servicio para manejar operaciones relacionadas con el microservicio de tutorías
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { StudentSession, TutorProfile } from '../types/tutoria.types';

/**
 * Obtiene la lista de tutores disponibles en el sistema
 */
export async function getTutores(): Promise<TutorProfile[]> {
	try {
		const response = await apiClient.get<TutorProfile[]>(
			API_ENDPOINTS.TUTORIAS.TUTORES,
		);
		return response.data;
	} catch (error) {
		console.error('Error al obtener tutores:', error);
		throw new Error('No se pudo obtener la lista de tutores');
	}
}

/**
 * Obtiene las sesiones de tutoría de un estudiante específico
 */
export async function getStudentSessions(
	studentId: string,
): Promise<StudentSession[]> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.STUDENT_SESSIONS.replace(
			':studentId',
			studentId,
		);
		console.log('📡 Fetching student sessions:', { studentId, url });
		const response = await apiClient.get<StudentSession[]>(url);
		console.log('✅ Student sessions received:', response.data);
		return response.data;
	} catch (error) {
		console.error('❌ Error al obtener sesiones del estudiante:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener las sesiones del estudiante');
	}
}
