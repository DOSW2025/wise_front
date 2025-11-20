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

		// Manejar diferentes formatos de respuesta
		const data = response.data as unknown as Record<string, unknown>;

		if (data?.success && typeof data.data === 'object' && data.data) {
			return data.data as TutorProfile;
		}

		if (data) {
			return data as unknown as TutorProfile;
		}

		throw new Error('Error al actualizar el perfil');
	} catch (error: unknown) {
		if (
			error &&
			typeof error === 'object' &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			'data' in error.response
		) {
			const apiError = error.response.data as Record<string, unknown>;
			const message =
				(apiError?.message as string) ||
				(apiError?.error as string) ||
				'Error al actualizar el perfil';
			throw new Error(message);
		}
		throw new Error('Error de conexión con el servidor');
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

		const data = response.data as unknown as Record<string, unknown>;

		if (data?.success && typeof data.data === 'object' && data.data) {
			return data.data as TutorProfile;
		}

		if (data) {
			return data as unknown as TutorProfile;
		}

		throw new Error('Error al obtener el perfil');
	} catch (error: unknown) {
		if (
			error &&
			typeof error === 'object' &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			'data' in error.response
		) {
			const apiError = error.response.data as Record<string, unknown>;
			const message =
				(apiError?.message as string) ||
				(apiError?.error as string) ||
				'Error al obtener el perfil';
			throw new Error(message);
		}
		throw new Error('Error de conexión con el servidor');
	}
}
