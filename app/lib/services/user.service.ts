/**
 * User Management Service
 * Servicio para gestionar usuarios (Admin)
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	ApiResponse,
	PaginatedResponse,
	PaginationParams,
	UpdateRoleRequest,
	UpdateUserStatusRequest,
	UserDto,
} from '../types/api.types';

/**
 * Construye los parámetros de consulta para la paginación
 */
function buildQueryParams(params: PaginationParams): string {
	const queryParams = new URLSearchParams();
	queryParams.append('page', params.page.toString());
	queryParams.append('limit', params.limit.toString());

	if (params.search) {
		queryParams.append('search', params.search);
	}
	if (params.role) {
		queryParams.append('role', params.role);
	}
	if (params.status) {
		queryParams.append('status', params.status);
	}

	return queryParams.toString();
}

/**
 * Obtener lista de usuarios con paginación
 */
export async function getUsers(
	params: PaginationParams,
): Promise<PaginatedResponse<UserDto>> {
	try {
		const queryString = buildQueryParams(params);
		const response = await apiClient.get<
			ApiResponse<PaginatedResponse<UserDto>>
		>(`${API_ENDPOINTS.USERS.LIST}?${queryString}`);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as any;

		// Si la respuesta ya es la paginada (tiene propiedad pagination)
		if (body.pagination) {
			return body as PaginatedResponse<UserDto>;
		}

		// Si está envuelta en ApiResponse (body.data tiene pagination)
		if (body.data && body.data.pagination) {
			return body.data as PaginatedResponse<UserDto>;
		}

		return body.data || (body as unknown as PaginatedResponse<UserDto>);
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

/**
 * Actualizar rol de un usuario
 */
export async function updateUserRole(
	userId: string,
	role: UpdateRoleRequest['role'],
): Promise<UserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.UPDATE_ROLE.replace(':id', userId);
		const response = await apiClient.patch<ApiResponse<UserDto>>(endpoint, {
			role,
		});

		return response.data.data || (response.data as unknown as UserDto);
	} catch (error) {
		console.error('Error updating user role:', error);
		throw error;
	}
}

/**
 * Suspender un usuario
 */
export async function suspendUser(
	userId: string,
	reason?: string,
): Promise<UserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.SUSPEND.replace(':id', userId);
		const response = await apiClient.patch<ApiResponse<UserDto>>(endpoint, {
			isActive: false,
			reason,
		});

		return response.data.data || (response.data as unknown as UserDto);
	} catch (error) {
		console.error('Error suspending user:', error);
		throw error;
	}
}

/**
 * Activar un usuario suspendido
 */
export async function activateUser(userId: string): Promise<UserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.ACTIVATE.replace(':id', userId);
		const response = await apiClient.patch<ApiResponse<UserDto>>(endpoint, {
			isActive: true,
		});

		return response.data.data || (response.data as unknown as UserDto);
	} catch (error) {
		console.error('Error activating user:', error);
		throw error;
	}
}
