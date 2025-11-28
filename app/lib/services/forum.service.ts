/**
 * Forum Service
 * Servicio para manejar operaciones relacionadas con foros
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';

export interface ForumCreateRequest {
	name: string;
	subject: string;
}

export interface ForumResponse {
	id: string;
	name: string;
	subject: string;
	createdAt: string;
	createdBy: string;
	members: number;
	status: 'active' | 'inactive';
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
	let errorMessage = '';

	if (
		error &&
		typeof error === 'object' &&
		'response' in error &&
		error.response &&
		typeof error.response === 'object' &&
		'data' in error.response
	) {
		const data = error.response.data as Record<string, unknown>;
		if (data.message && typeof data.message === 'string') {
			errorMessage = data.message;
		}
	}

	if (
		!errorMessage &&
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		errorMessage = error.message;
	}

	// Convertir mensajes técnicos a mensajes amigables
	if (
		errorMessage.includes('Cannot') ||
		errorMessage.includes('404') ||
		errorMessage.includes('Not Found')
	) {
		return 'Parece que el servicio no está disponible. Intenta más tarde.';
	}

	if (
		errorMessage.includes('Network') ||
		errorMessage.includes('ECONNREFUSED')
	) {
		return 'Error de conexión. Verifica tu conexión a internet.';
	}

	if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
		return 'La solicitud tardó demasiado. Intenta nuevamente.';
	}

	return errorMessage || defaultMessage;
}

/**
 * Crear un nuevo foro
 * POST /wise/foros
 */
export async function createForum(
	forumData: ForumCreateRequest,
): Promise<ForumResponse> {
	try {
		const response = await apiClient.post<ApiResponse<ForumResponse>>(
			API_ENDPOINTS.FORUMS.CREATE,
			forumData,
			{
				timeout: 15000, // 15 segundos máximo para crear foro
			},
		);

		return extractResponseData<ForumResponse>(response.data);
	} catch (error) {
		// Validaciones específicas por código HTTP
		if (
			error &&
			typeof error === 'object' &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			'status' in error.response
		) {
			const status = error.response.status;

			if (status === 400) {
				throw new Error(
					'Datos inválidos. Verifica el nombre y la materia seleccionada.',
				);
			}

			if (status === 409) {
				throw new Error(
					'Ya existe un foro con este nombre. Intenta con otro nombre.',
				);
			}

			if (status === 422) {
				throw new Error(
					'La materia seleccionada no existe. Verifica tu selección.',
				);
			}

			if (status === 401 || status === 403) {
				throw new Error(
					'No tienes permiso para crear foros. Contacta al administrador.',
				);
			}
		}

		// Convertir mensaje de error técnico a mensaje amigable
		const message = extractErrorMessage(
			error,
			'Error al crear el foro. Intenta nuevamente.',
		);
		throw new Error(message);
	}
}

/**
 * Obtener lista de foros
 * GET /wise/foros
 */
export async function getForums(subject?: string): Promise<ForumResponse[]> {
	try {
		const params = subject ? { subject } : {};
		const response = await apiClient.get<ApiResponse<ForumResponse[]>>(
			API_ENDPOINTS.FORUMS.LIST,
			{ params },
		);

		return extractResponseData<ForumResponse[]>(response.data);
	} catch (error) {
		const message = extractErrorMessage(
			error,
			'Error al obtener los foros. Intenta nuevamente.',
		);
		throw new Error(message);
	}
}

/**
 * Obtener detalles de un foro específico
 * GET /wise/foros/:id
 */
export async function getForumById(id: string): Promise<ForumResponse> {
	try {
		const response = await apiClient.get<ApiResponse<ForumResponse>>(
			`${API_ENDPOINTS.FORUMS.LIST}/${id}`,
		);

		return extractResponseData<ForumResponse>(response.data);
	} catch (error) {
		const message = extractErrorMessage(
			error,
			'Error al obtener el foro. Intenta nuevamente.',
		);
		throw new Error(message);
	}
}
