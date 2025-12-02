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

export type ReplyType = 'text' | 'image' | 'link';

export interface ForumReplyCreateRequest {
	forumId: string;
	type: ReplyType;
	text?: string;
	imageName?: string;
	url?: string;
}

export interface ForumReplyResponse {
	id: string;
	forumId: string;
	type: ReplyType;
	createdAt: string;
	createdBy: string;
}

export type ForumErrorType =
	| 'duplicate'
	| 'invalid-subject'
	| 'invalid-data'
	| 'permission-denied'
	| 'network'
	| 'timeout'
	| 'unknown';

export interface ForumError extends Error {
	type: ForumErrorType;
	message: string;
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
		return 'El backend aún no está conectado. Proximamente funcional.';
	}

	if (
		errorMessage.includes('Network') ||
		errorMessage.includes('ECONNREFUSED')
	) {
		return 'No se puede conectar al servidor. Verifica que el backend esté disponible.';
	}

	if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
		return 'La solicitud tardó demasiado. Intenta nuevamente en unos momentos.';
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

			if (status === 409) {
				const err = new Error(
					'Ya existe un foro con este nombre. Por favor, elige otro nombre para tu foro.',
				) as ForumError;
				err.type = 'duplicate';
				throw err;
			}

			if (status === 422) {
				const err = new Error(
					'La materia seleccionada no existe. Verifica tu selección en la lista disponible.',
				) as ForumError;
				err.type = 'invalid-subject';
				throw err;
			}

			if (status === 400) {
				const err = new Error(
					'Datos inválidos. Verifica que el nombre tenga entre 3 y 50 caracteres.',
				) as ForumError;
				err.type = 'invalid-data';
				throw err;
			}

			if (status === 401 || status === 403) {
				const err = new Error(
					'No tienes permiso para crear foros. Contacta al administrador.',
				) as ForumError;
				err.type = 'permission-denied';
				throw err;
			}
		}

		// Convertir mensaje de error técnico a mensaje amigable
		const message = extractErrorMessage(
			error,
			'Error al crear el foro. Intenta nuevamente.',
		);

		const err = new Error(message) as ForumError;
		if (message.includes('conexión') || message.includes('Connection')) {
			err.type = 'network';
		} else if (message.includes('tardó') || message.includes('timeout')) {
			err.type = 'timeout';
		} else {
			err.type = 'unknown';
		}
		throw err;
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

/**
 * Crear respuesta en un foro
 * POST /wise/foros/:id/respuestas
 */
export async function createForumReply(
	payload: ForumReplyCreateRequest,
): Promise<ForumReplyResponse> {
	try {
		const body: Record<string, unknown> = { type: payload.type };
		if (payload.type === 'text') body.text = payload.text?.trim();
		if (payload.type === 'image') body.imageName = payload.imageName;
		if (payload.type === 'link') body.url = payload.url?.trim();

		const response = await apiClient.post<ApiResponse<ForumReplyResponse>>(
			API_ENDPOINTS.FORUMS.REPLIES(payload.forumId),
			body,
			{ timeout: 15000 },
		);
		return extractResponseData<ForumReplyResponse>(response.data);
	} catch (error) {
		const message = extractErrorMessage(
			error,
			'Error al crear la respuesta. Intenta nuevamente.',
		);
		const err = new Error(message) as ForumError;
		err.type = message.includes('permiso')
			? 'permission-denied'
			: message.includes('materia')
				? 'invalid-data'
				: message.includes('conectar')
					? 'network'
					: message.includes('tardó')
						? 'timeout'
						: 'unknown';
		throw err;
	}
}

/**
 * Actualizar una respuesta existente del foro (placeholder hasta backend real)
 * PATCH /wise/foros/:forumId/respuestas/:id
 */
export async function updateForumReply(
	forumId: string,
	replyId: string,
	content: string,
): Promise<{ id: string; forumId: string; content: string }> {
	// Placeholder: simulamos latencia y retorno
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: replyId, forumId, content });
		}, 600);
	});
}

/**
 * Eliminar una respuesta del foro (placeholder hasta backend real)
 * DELETE /wise/foros/:forumId/respuestas/:id
 */
export async function deleteForumReply(
	forumId: string,
	replyId: string,
): Promise<{ id: string; forumId: string; deleted: true }> {
	return new Promise((resolve) => {
		setTimeout(() => resolve({ id: replyId, forumId, deleted: true }), 500);
	});
}
