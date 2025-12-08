/**
 * Tutoria Service
 * Servicio para manejar operaciones relacionadas con el microservicio de tutorías
 */

import axios from 'axios';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	CreateSessionRequest,
	CreateSessionResponse,
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

/**
 * Crea una nueva sesión de tutoría
 */
export async function createSession(
	data: CreateSessionRequest,
): Promise<CreateSessionResponse> {
	try {
		console.log(
			'📤 Enviando petición POST a:',
			API_ENDPOINTS.TUTORIAS.CREATE_SESSION,
		);
		console.log('📦 Datos enviados:', data);

		const response = await apiClient.post<CreateSessionResponse>(
			API_ENDPOINTS.TUTORIAS.CREATE_SESSION,
			data,
		);

		console.log('✅ Respuesta exitosa:', response.data);
		return response.data;
	} catch (error) {
		console.error('❌ Error al crear sesión de tutoría:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error(
					'El endpoint de creación de tutorías no está disponible. Verifica que el backend esté corriendo y que la ruta POST /wise/tutorias/sessions esté implementada.',
				);
			}
			if (status === 400) {
				throw new Error(`Datos inválidos: ${message}`);
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para agendar tutorías');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error('No se pudo agendar la tutoría. Verifica tu conexión.');
	}
}
