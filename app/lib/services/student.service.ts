/**
 * Student Service
 * Servicio para manejar operaciones relacionadas con estudiantes
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import { VALIDATION_LIMITS } from '../utils/validation';

export interface StudentProfile {
	name: string;
	email: string;
	phone: string;
	role: string;
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

		// Mensajes específicos por código
		if (response.status === 400) {
			return 'Datos inválidos. Verifica teléfono (máx 20) y biografía (máx 500).';
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
 *
 * Campos read-only (no se envían al backend):
 * - name: Controlado por el contexto de autenticación
 * - email: Controlado por el contexto de autenticación
 * - role: Asignado por el backend
 * - semester: Asignado por el backend (campo académico, no editable)
 */
export async function updateProfile(
	profile: StudentProfile,
): Promise<StudentProfile> {
	try {
		// Mapear los campos del frontend al DTO del backend con sanitización
		const telefono = profile.phone?.trim();
		const biografia = profile.description?.trim();

		// Validar límites antes de enviar al backend
		// Nota: valores vacíos o solo espacios después del trim se convierten en undefined
		// (comportamiento intencional - estos campos son opcionales)
		if (telefono && telefono.length > VALIDATION_LIMITS.PHONE_MAX_LENGTH) {
			throw new Error(
				`Teléfono excede el límite de ${VALIDATION_LIMITS.PHONE_MAX_LENGTH} caracteres`,
			);
		}
		if (biografia && biografia.length > VALIDATION_LIMITS.BIO_MAX_LENGTH) {
			throw new Error(
				`Biografía excede el límite de ${VALIDATION_LIMITS.BIO_MAX_LENGTH} caracteres`,
			);
		}

		const updateDto: UpdatePersonalInfoDto = {
			telefono: telefono || undefined,
			biografia: biografia || undefined,
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
			name: (backendData.nombre as string) ?? profile.name,
			email: (backendData.email as string) ?? profile.email,
			phone: (backendData.telefono as string) ?? '',
			role: (backendData.rol as string) ?? profile.role,
			description: (backendData.biografia as string) ?? '',
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
 * Endpoint: GET /wise/gestion-usuarios/me
 * Retorna: { id, nombre, email, rol, estado, telefono, biografia }
 */
export async function getProfile(): Promise<StudentProfile> {
	try {
		const response = await apiClient.get<Record<string, unknown>>(
			API_ENDPOINTS.STUDENT.GET_PROFILE,
		);

		// El backend retorna directamente el objeto del usuario
		const backendData = response.data as Record<string, unknown>;

		// Mapear del formato backend al formato frontend
		const name =
			`${(backendData.nombre as string) ?? ''} ${(backendData.apellido as string) ?? ''}`.trim();
		const email = (backendData.email as string) ?? '';
		const phone = (backendData.telefono as string) ?? '';
		const description = (backendData.biografia as string) ?? '';
		const semester = (backendData.semestre as string) ?? '';
		// rol puede ser un string o un objeto con propiedad 'nombre'
		const role =
			typeof backendData.rol === 'string'
				? backendData.rol
				: ((backendData.rol as { nombre?: string })?.nombre ?? '');

		return { name, email, phone, description, role, semester };
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error, 'No se pudo cargar el perfil.'));
	}
}
