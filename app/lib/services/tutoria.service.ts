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
	TutorFullProfile,
	TutoriaStats,
	TutorMateriasResponse,
	TutorNameResponse,
	TutorProfile,
	TutorProfileResponse,
	TutorReputacion,
	TutorReputacionResponse,
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
 * Obtiene el nombre de un usuario (estudiante o tutor) por su ID
 * Esta función lanza una excepción si falla para que el componente maneje el error
 */
export async function getUserName(userId: string): Promise<string> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.TUTOR_NAME.replace('{id}', userId);
		console.log('🔍 Fetching user name:', { userId, url });
		const response = await apiClient.get<TutorNameResponse>(url);
		console.log('✅ User name received:', response.data);

		if (!response.data?.nombreCompleto) {
			console.error('❌ Invalid response structure:', response.data);
			throw new Error('Respuesta inválida del servidor');
		}

		return response.data.nombreCompleto;
	} catch (error: any) {
		console.error('❌ Error al obtener nombre del usuario:', error);
		console.error('❌ Error details:', {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
			userId: userId,
		});
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener el nombre del usuario');
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

/**
 * Obtiene las sesiones confirmadas de un tutor
 */
export async function getConfirmedSessions(
	tutorId: string,
): Promise<import('../types/tutoria.types').ConfirmedSessionsResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.CONFIRMED_SESSIONS.replace(
			'{id}',
			tutorId,
		);
		console.log('Fetching confirmed sessions:', { tutorId, url });

		const response =
			await apiClient.get<
				import('../types/tutoria.types').ConfirmedSessionsResponse
			>(url);

		console.log('Confirmed sessions obtenidas:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener sesiones confirmadas:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('No se encontraron sesiones confirmadas');
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para ver estas sesiones');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error(
			'No se pudieron obtener las sesiones confirmadas. Verifica tu conexión.',
		);
	}
}

/**
 * Completa una sesión de tutoría
 */
export async function completeSession(
	sessionId: string,
	data: import('../types/tutoria.types').CompleteSessionRequest,
): Promise<import('../types/tutoria.types').CompleteSessionResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.COMPLETE_SESSION.replace(
			'{id}',
			sessionId,
		);
		console.log('Completando sesión:', { sessionId, url, data });

		const response = await apiClient.patch<
			import('../types/tutoria.types').CompleteSessionResponse
		>(url, data);

		console.log('Sesión completada exitosamente:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al completar sesión:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const message = error.response?.data?.message || error.message;

			if (status === 404) {
				throw new Error('La sesión no existe');
			}
			if (status === 400) {
				throw new Error(`${message}`);
			}
			if (status === 401 || status === 403) {
				throw new Error('No tienes permisos para completar esta tutoría');
			}

			throw new Error(`Error del servidor (${status}): ${message}`);
		}

		throw new Error('No se pudo completar la tutoría. Verifica tu conexión.');
	}
}

/**
 * Obtiene la disponibilidad semanal de un tutor
 */
export async function getAvailability(
	tutorId: string,
): Promise<import('../types/tutoria.types').DisponibilidadSemanal> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.GET_AVAILABILITY.replace(
			'{id}',
			tutorId,
		);
		console.log('Fetching tutor availability:', { tutorId, url });

		const response =
			await apiClient.get<
				import('../types/tutoria.types').DisponibilidadSemanal
			>(url);

		console.log('Tutor availability obtenida:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener disponibilidad del tutor:', error);

		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				// Si no hay disponibilidad, retornar estructura vacía
				return {
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					sunday: [],
				};
			}
			const message =
				error.response?.data?.message || 'Error al obtener disponibilidad';
			throw new Error(message);
		}

		throw new Error(
			'No se pudo obtener la disponibilidad del tutor. Verifica tu conexión.',
		);
	}
}

/**
 * Actualiza la disponibilidad semanal de un tutor
 */
export async function updateAvailability(
	tutorId: string,
	data: {
		disponibilidad: import('../types/tutoria.types').DisponibilidadSemanal;
	},
): Promise<{ message: string }> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.UPDATE_AVAILABILITY.replace(
			'{id}',
			tutorId,
		);
		console.log('Actualizando disponibilidad del tutor:', {
			tutorId,
			url,
			data,
		});

		const response = await apiClient.patch<{ message: string }>(url, data);

		console.log('Disponibilidad actualizada exitosamente:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al actualizar disponibilidad:', error);

		if (axios.isAxiosError(error)) {
			const message =
				error.response?.data?.message || 'Error al actualizar disponibilidad';
			throw new Error(message);
		}

		throw new Error(
			'No se pudo actualizar la disponibilidad. Verifica tu conexión.',
		);
	}
}

/**
 * Obtiene la reputación y calificación promedio de un tutor
 */
export async function getTutorReputacion(
	tutorId: string,
): Promise<TutorReputacion> {
	try {
		const url = API_ENDPOINTS.TUTOR.REVIEWS.REPUTACION(tutorId);
		console.log('Fetching tutor reputacion:', { tutorId, url });
		const response = await apiClient.get<TutorReputacion>(url);
		console.log('Tutor reputacion received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener reputación del tutor:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener la reputación del tutor');
	}
}

/**
 * Obtiene el perfil del tutor con sus ratings/comentarios
 */
export async function getTutorProfile(
	tutorId: string,
): Promise<TutorProfileResponse> {
	try {
		const url = API_ENDPOINTS.TUTOR.REVIEWS.RATINGS(tutorId);
		console.log('Fetching tutor profile:', { tutorId, url });
		const response = await apiClient.get<TutorProfileResponse>(url);
		console.log('Tutor profile received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener perfil del tutor:', error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('No se pudo obtener el perfil del tutor');
	}
}

/**
 *  Obtiene el historial completo de sesiones de un tutor
 */
export async function getTutorSessions(
	tutorId: string,
): Promise<import('../types/tutoria.types').TutorSessionHistoryResponse> {
	try {
		const url = API_ENDPOINTS.TUTORIAS.TUTOR_SESSIONS.replace(
			'{tutorId}',
			tutorId,
		);
		console.log('Fetching tutor session history:', { tutorId, url });

		const response =
			await apiClient.get<
				import('../types/tutoria.types').TutorSessionHistoryResponse
			>(url);

		console.log('Tutor session history received:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error al obtener historial de sesiones del tutor:', error);

		if (axios.isAxiosError(error)) {
			console.error('Error details:', {
				status: error.response?.status,
				data: error.response?.data,
			});
		}

		throw new Error(
			'No se pudo obtener el historial de sesiones. Verifica tu conexión.',
		);
	}
}

/**
 * Obtiene el perfil completo del tutor para el modal
 */
export async function getTutorFullProfile(
	tutorId: string,
): Promise<TutorFullProfile> {
	try {
		const profileUrl = API_ENDPOINTS.TUTORIAS.TUTOR_PROFILE.replace(
			'{id}',
			tutorId,
		);
		const reputacionUrl = API_ENDPOINTS.TUTOR.REVIEWS.REPUTACION(tutorId);

		console.log('Fetching tutor full profile and reputation:', {
			tutorId,
			profileUrl,
			reputacionUrl,
		});

		// Obtener perfil y reputación en paralelo
		const [profileResponse, reputacionResponse] = await Promise.all([
			apiClient.get<Omit<TutorFullProfile, 'totalRatings'>>(profileUrl),
			apiClient.get<TutorReputacionResponse>(reputacionUrl),
		]);

		console.log('Tutor full profile received:', profileResponse.data);
		console.log('Tutor reputation received:', reputacionResponse.data);

		// Combinar datos del perfil con la reputación
		const fullProfile: TutorFullProfile = {
			...profileResponse.data,
			reputacion: reputacionResponse.data.reputacion,
			totalRatings: reputacionResponse.data.totalRatings,
		};

		return fullProfile;
	} catch (error) {
		console.error('Error al obtener perfil completo del tutor:', error);
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					'No se pudo obtener el perfil del tutor',
			);
		}
		throw new Error('No se pudo obtener el perfil del tutor');
	}
}
// Exportar todas las funciones como un objeto de servicio
export const tutoriaService = {
	getTutores,
	getStudentSessions,
	createSession,
	getTutorName,
	getUserName,
	getUpcomingSessions,
	getTutorMaterias,
	getTutoriaStats,
	cancelSession,
	getPendingSessions,
	confirmSession,
	rejectSession,
	getConfirmedSessions,
	completeSession,
	getAvailability,
	updateAvailability,
	getTutorReputacion,
	getTutorProfile,
	getTutorSessions,
	getTutorFullProfile,
};
