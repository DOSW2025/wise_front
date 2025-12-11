/**
 * Tutoria Service
 * Servicio para manejar operaciones relacionadas con el microservicio de tutorías
 */

import axios from 'axios';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	CancelSessionRequest,
	CancelSessionResponse,
	CreateSessionRequest,
	CreateSessionResponse,
	MateriaResponse,
	StudentSession,
	TutoriaStats,
	TutorMateriasResponse,
	TutorNameResponse,
	TutorProfile,
	UpcomingSessionsResponse,
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
 * Obtiene las materias que un tutor puede dictar
 */
export async function getTutorMaterias(
	tutorId: string,
): Promise<TutorMateriasResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.TUTOR_MATERIAS.replace('{id}', tutorId);
		console.log('Fetching tutor materias:', { tutorId, url });
		const response = await apiClient.get<TutorMateriasResponse>(url);
		console.log('Tutor materias received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener materias del tutor:', error);
		throw new Error('No se pudo obtener las materias del tutor');
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

/**
 * Obtiene las próximas sesiones de tutoría de un estudiante
 */
export async function getUpcomingSessions(
	userId: string,
): Promise<UpcomingSessionsResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.UPCOMING_SESSIONS.replace(
			'{userId}',
			userId,
		);
		console.log('Fetching upcoming sessions:', { userId, url });
		const response = await apiClient.get<UpcomingSessionsResponse>(url);
		console.log('Upcoming sessions received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener próximas sesiones:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener las próximas sesiones');
	}
}

/**
 * Obtiene las estadísticas de tutorías de un estudiante
 */
export async function getTutoriaStats(userId: string): Promise<TutoriaStats> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.TUTORIA_STATS.replace(
			'{userId}',
			userId,
		);
		console.log('Fetching tutoria stats:', { userId, url });
		const response = await apiClient.get<TutoriaStats>(url);
		console.log('Tutoria stats received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener estadísticas de tutorías:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener las estadísticas de tutorías');
	}
}

/**
 * Cancela una sesión de tutoría
 */
export async function cancelSession(
	sessionId: string,
	data: CancelSessionRequest,
): Promise<CancelSessionResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.CANCEL_SESSION.replace(
			'{id}',
			sessionId,
		);
		console.log('Cancelando sesión:', { sessionId, url, data });

		const response = await apiClient.patch<CancelSessionResponse>(url, data);

		console.log('Sesión cancelada exitosamente:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al cancelar sesión:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('La sesión no existe o ya fue cancelada');
			}
			if (status === 400) {
				throw new Error(`Datos inválidos: ${message}`);
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para cancelar esta tutoría');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error('No se pudo cancelar la tutoría. Verifica tu conexión.');
	}
}

/**
 * Obtiene las sesiones pendientes de confirmación de un tutor
 */
export async function getPendingSessions(
	tutorId: string,
): Promise<import('../types/tutoria.types').PendingSessionsResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.PENDING_SESSIONS.replace(
			'{id}',
			tutorId,
		);
		console.log('Fetching pending sessions:', { tutorId, url });

		const response =
			await apiClient.get<
				import('../types/tutoria.types').PendingSessionsResponse
			>(url);

		console.log('Pending sessions obtenidas:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener sesiones pendientes:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('No se encontraron sesiones pendientes');
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para ver estas sesiones');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error(
			'No se pudieron obtener las sesiones pendientes. Verifica tu conexión.',
		);
	}
}

/**
 * Confirma una sesión de tutoría pendiente
 */
export async function confirmSession(
	sessionId: string,
	data: { tutorId: string },
): Promise<{ message: string }> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.CONFIRM_SESSION.replace(
			'{id}',
			sessionId,
		);
		console.log('Confirmando sesión:', { sessionId, url, data });

		const response = await apiClient.patch<{ message: string }>(url, data);

		console.log('Sesión confirmada exitosamente:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al confirmar sesión:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('La sesión no existe o ya fue confirmada');
			}
			if (status === 400) {
				throw new Error(`Datos inválidos: ${message}`);
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para confirmar esta tutoría');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error('No se pudo confirmar la tutoría. Verifica tu conexión.');
	}
}

/**
 * Rechaza una sesión de tutoría pendiente
 */
export async function rejectSession(
	sessionId: string,
	data: { tutorId: string; razon: string },
): Promise<{ message: string }> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.REJECT_SESSION.replace(
			'{id}',
			sessionId,
		);
		console.log('Rechazando sesión:', { sessionId, url, data });

		const response = await apiClient.patch<{ message: string }>(url, data);

		console.log('Sesión rechazada exitosamente:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al rechazar sesión:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('La sesión no existe o ya fue rechazada');
			}
			if (status === 400) {
				throw new Error(`Datos inválidos: ${message}`);
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para rechazar esta tutoría');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error('No se pudo rechazar la tutoría. Verifica tu conexión.');
	}
}

// Exportar todas las funciones como un objeto de servicio
export const tutoriaService = {
	getTutores,
	getStudentSessions,
	createSession,
	getTutorName,
	getUpcomingSessions,
	getTutorMaterias,
	getTutoriaStats,
	cancelSession,
	getPendingSessions,
	confirmSession,
	rejectSession,
};
