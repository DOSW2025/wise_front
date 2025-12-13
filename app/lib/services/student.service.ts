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
	role: string;
	description: string;
	semester?: string;
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

		// Mensajes específicos por código
		if (response.status === 400) {
			return 'Datos inválidos. Verifica teléfono (máx 10) y biografía (máx 500).';
		}
		if (response.status === 401) {
			return 'Tu sesión expiró. Inicia sesión nuevamente.';
		}
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
		// Mapear los campos del frontend al DTO del backend con sanitización
		const telefono = profile.phone?.trim();
		const biografia = profile.description?.trim();
		const updateDto: UpdatePersonalInfoDto = {
			telefono:
				telefono && telefono.length > 0
					? telefono.slice(0, 20) // límite backend
					: undefined,
			biografia:
				biografia && biografia.length > 0
					? biografia.slice(0, 500) // límite backend
					: undefined,
		};

		const response = await apiClient.patch<ApiResponse<unknown>>(
			API_ENDPOINTS.STUDENT.PROFILE,
			updateDto,
		);

		// El backend devuelve { message, user } o directamente el usuario
		const payload = extractResponseData<Record<string, unknown>>(response.data);
		const backendData = (payload.user as Record<string, unknown>) || payload;

		// Retornar el perfil actualizado en el formato del frontend
		return {
			name: (backendData.nombre as string) || profile.name,
			email: (backendData.email as string) || profile.email,
			phone: (backendData.telefono as string) || '',
			role: (backendData.rol as string) || profile.role,
			description: (backendData.biografia as string) || '',
			semester: profile.semester,
		};
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al actualizar el perfil'),
		);
	}
}

/**
 * Obtener perfil completo del estudiante
 * Endpoint: GET /wise/gestion-usuarios/me
 * Retorna: { id, nombre, email, rol, estado, telefono, biografia }
 */
export async function getProfile(): Promise<StudentProfile> {
	try {
		const response = await apiClient.get<Record<string, unknown>>(
			API_ENDPOINTS.STUDENT.GET_PROFILE,
		);

		// El backend retorna directamente el objeto del usuario
		const backendData = response.data;

		// Mapear del formato backend al formato frontend
		const fullName =
			`${backendData.nombre ?? ''} ${backendData.apellido ?? ''}`.trim();
		const roleFromObject =
			typeof backendData.rol === 'object' && backendData.rol
				? ((backendData.rol as { nombre?: string }).nombre ?? '')
				: undefined;

		const profile: StudentProfile = {
			name: fullName || (backendData.nombre as string) || '',
			email: (backendData.email as string) || '',
			phone: (backendData.telefono as string) || '',
			role: (
				roleFromObject ||
				(backendData.rol as string) ||
				'estudiante'
			).toString(),
			description: (backendData.biografia as string) || '',
			semester:
				backendData.semestre !== undefined
					? String(backendData.semestre)
					: undefined,
		};

		return profile;
	} catch (error: unknown) {
		// Manejo de errores específicos
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

			if (response.status === 401) {
				throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
			}
			if (response.status === 500) {
				throw new Error('Error del servidor al procesar la solicitud.');
			}
			if (response.status === 404) {
				throw new Error('El endpoint del perfil no existe en el backend.');
			}
		}

		// Si el error tiene mensaje, usarlo
		if (error instanceof Error) {
			throw new Error(`Error al cargar el perfil: ${error.message}`);
		}

		throw new Error('Error al cargar el perfil. Intenta nuevamente.');
	}
}
