/**
 * Tutor Service
 * Servicio para manejar operaciones relacionadas con tutores
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type { TutorRating, TutorReputation } from '../types/tutor-rating.types';

export interface TutorProfile {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
}

/**
 * Extraer datos de respuesta API
 */
function extractResponseData<T>(data: unknown): T {
	const responseData = data as Record<string, unknown>;

	if (
		responseData?.success &&
		typeof responseData.data === 'object' &&
		responseData.data
	) {
		return responseData.data as T;
	}

	if (responseData) {
		return responseData as T;
	}

	throw new Error('Error al procesar la respuesta');
}

/**
 * Extraer mensaje de error de respuesta API
 */
function extractErrorMessage(error: unknown, defaultMessage: string): string {
	if (
		error &&
		typeof error === 'object' &&
		'response' in error &&
		error.response &&
		typeof error.response === 'object'
	) {
		const response = error.response as Record<string, unknown>;

		// Detectar error 404 o método no permitido
		if (response.status === 404 || response.status === 405) {
			return 'El endpoint no está disponible en el backend';
		}

		if ('data' in response) {
			const apiError = response.data;

			// Detectar mensaje "Cannot PUT"
			if (
				apiError &&
				typeof apiError === 'object' &&
				'message' in apiError &&
				typeof (apiError as any).message === 'string' &&
				(apiError as any).message.includes('Cannot PUT')
			) {
				return 'El endpoint no está disponible en el backend';
			}

			if (apiError && typeof apiError === 'object') {
				if (typeof (apiError as any).message === 'string')
					return (apiError as any).message;
				if (typeof (apiError as any).error === 'string')
					return (apiError as any).error;
			}

			return defaultMessage;
		}
	}
	return 'Error de conexión con el servidor';
}

/**
 * Actualizar perfil del tutor
 */
export async function updateProfile(
	profile: TutorProfile,
): Promise<TutorProfile> {
	try {
		const response = await apiClient.put<ApiResponse<TutorProfile>>(
			API_ENDPOINTS.TUTOR.PROFILE,
			profile,
		);

		return extractResponseData<TutorProfile>(response.data);
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al actualizar el perfil'),
		);
	}
}

/**
 * Obtener perfil del tutor
 */
export async function getProfile(): Promise<TutorProfile> {
	try {
		const response = await apiClient.get<ApiResponse<TutorProfile>>(
			API_ENDPOINTS.TUTOR.PROFILE,
		);

		return extractResponseData<TutorProfile>(response.data);
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error, 'Error al obtener el perfil'));
	}
}

/**
 * Obtener todas las calificaciones
 */
export async function getTutorRatings(tutorId: string): Promise<TutorRating[]> {
	try {
		const response = await apiClient.get(
			API_ENDPOINTS.TUTOR.REVIEWS.RATINGS(tutorId)
		);

		const data = extractResponseData<any>(response.data);

		return data.ratings.map((r: any): TutorRating => ({
			id: String(r.id),
			rating: r.score,
			comentario: r.comment,
			fecha: r.createdAt,
			estudianteNombre: r.rater?.nombre ?? 'Estudiante desconocido',
			materia: r.session?.materia ?? '',
			codigoMateria: r.session?.codigoMateria ?? ''
		}));
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al obtener calificaciones del tutor')
		);
	}
}

/**
 * Obtener reputación del tutor
 */
export async function getTutorReputation(tutorId: string): Promise<TutorReputation> {
	try {
		const response = await apiClient.get(
			API_ENDPOINTS.TUTOR.REVIEWS.REPUTACION(tutorId)
		);

		const data = extractResponseData<any>(response.data);

		return {
			tutorId: data.tutorId,
			nombreTutor: data.nombreTutor,
			reputacion: data.reputacion,
			totalRatings: data.totalRatings
		};
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al obtener reputación del tutor')
		);
	}
}

