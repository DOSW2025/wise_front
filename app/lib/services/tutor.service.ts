/**
 * Tutor Service
 * Servicio para manejar operaciones relacionadas con tutores
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';

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
		typeof error.response === 'object' &&
		'data' in error.response
	) {
		const apiError = error.response.data as Record<string, unknown>;
		return (
			(apiError?.message as string) ||
			(apiError?.error as string) ||
			defaultMessage
		);
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
