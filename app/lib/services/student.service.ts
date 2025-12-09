/**
 * Student Service
 * Servicio para manejar operaciones relacionadas con estudiantes
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';

export interface StudentProfile {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	semester?: string;
	interests?: string[];
}

/**
 * DTO que espera el backend
 */
interface UpdatePersonalInfoDto {
	telefono?: string;
	biografia?: string;
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
 * Type guard para objetos con propiedad message
 */
function hasMessage(obj: unknown): obj is { message: string } {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'message' in obj &&
		typeof (obj as { message: unknown }).message === 'string'
	);
}

/**
 * Type guard para objetos con propiedad error
 */
function hasError(obj: unknown): obj is { error: string } {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'error' in obj &&
		typeof (obj as { error: unknown }).error === 'string'
	);
}

/**
 * Extraer mensaje de error de respuesta API
 */
function extractErrorMessage(error: unknown, defaultMessage: string): string {
	if (
		error &&
		typeof error === 'object' &&
		'response' in error &&
		(error as Record<string, unknown>).response &&
		typeof (error as Record<string, unknown>).response === 'object'
	) {
		const response = (error as Record<string, unknown>).response as Record<
			string,
			unknown
		>;

		// Detectar error 404 o método no permitido
		if (response.status === 404 || response.status === 405) {
			return 'El endpoint no está disponible en el backend';
		}

		if ('data' in response) {
			const apiError = response.data;

			// Detectar mensaje "Cannot PATCH" o "Cannot PUT"
			if (hasMessage(apiError)) {
				if (
					apiError.message.includes('Cannot PATCH') ||
					apiError.message.includes('Cannot PUT')
				) {
					return 'El endpoint no está disponible en el backend';
				}
				return apiError.message;
			}

			if (hasError(apiError)) {
				return apiError.error;
			}

			return defaultMessage;
		}
	}
	return 'Error de conexión con el servidor';
}

/**
 * Actualizar información personal del estudiante
 * Solo actualiza teléfono y biografía
 */
export async function updateProfile(
	profile: StudentProfile,
): Promise<StudentProfile> {
	try {
		// Mapear los campos del frontend al DTO del backend
		const updateDto: UpdatePersonalInfoDto = {
			telefono: profile.phone || undefined,
			biografia: profile.description || undefined,
		};

		const response = await apiClient.patch<ApiResponse<unknown>>(
			API_ENDPOINTS.STUDENT.PROFILE,
			updateDto,
		);

		// El backend devuelve el usuario completo
		const backendData = extractResponseData<Record<string, unknown>>(
			response.data,
		);

		// Retornar el perfil actualizado en el formato del frontend
		return {
			name: (backendData.nombre as string) || profile.name,
			email: (backendData.email as string) || profile.email,
			phone: (backendData.telefono as string) || '',
			location: profile.location, // Este campo no se actualiza en backend
			description: (backendData.biografia as string) || '',
			semester: profile.semester,
			interests: profile.interests,
		};
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al actualizar el perfil'),
		);
	}
}

/**
 * Obtener perfil completo del estudiante
 */
export async function getProfile(): Promise<StudentProfile> {
	try {
		const response = await apiClient.get<ApiResponse<unknown>>(
			API_ENDPOINTS.STUDENT.GET_PROFILE, // Necesitamos agregar esta ruta
		);

		const backendData = extractResponseData<Record<string, unknown>>(
			response.data,
		);

		// Mapear del formato backend al formato frontend
		return {
			name: `${(backendData.nombre as string) || ''} ${(backendData.apellido as string) || ''}`.trim(),
			email: (backendData.email as string) || '',
			phone: (backendData.telefono as string) || '',
			location: '', // Este campo no existe en el backend aún
			description: (backendData.biografia as string) || '',
			semester: (backendData.semestre as string) || '',
			interests: (backendData.intereses as string[]) || [],
		};
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error, 'Error al obtener el perfil'));
	}
}
