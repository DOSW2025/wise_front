/**
 * Tutoria Service
 * Servicio para manejar operaciones relacionadas con el microservicio de tutorías
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	MateriaResponse,
	StudentSession,
	TutorNameResponse,
	TutorProfile,
} from '../types/tutoria.types';

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
		console.log('Fetching student sessions:', { studentId, url });
		const response = await apiClient.get<StudentSession[]>(url);
		console.log('Student sessions received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener sesiones del estudiante:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener las sesiones del estudiante');
	}
}

/**
 * Obtiene el nombre de un tutor específico
 */
export async function getTutorName(tutorId: string): Promise<string> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.TUTOR_NAME.replace('{id}', tutorId);
		console.log('Fetching tutor name:', { tutorId, url });
		const response = await apiClient.get<TutorNameResponse>(url);
		console.log('Tutor name received:', response.data);
		return response.data.nombreCompleto;
	} catch (error) {
		console.error('Error al obtener nombre del tutor:', error);
		return 'Tutor no disponible';
	}
}

/**
 * Obtiene información de una materia por su código
 */
export async function getMateria(
	codigoMateria: string,
): Promise<MateriaResponse | null> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.MATERIA.replace(
			'{codigo}',
			codigoMateria,
		);
		const response = await apiClient.get<MateriaResponse>(url);
		return response.data;
	} catch (error) {
		console.error('Error al obtener materia:', error);
		return null;
	}
}
