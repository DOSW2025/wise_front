/**
 * User Management Service
 * Servicio para gestionar usuarios (Admin)
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	AdminUserDto,
	ApiResponse,
	PaginatedResponse,
	PaginationParams,
	UpdateRoleRequest,
	UpdateUserStatusRequest,
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
): Promise<PaginatedResponse<AdminUserDto>> {
	try {
		const queryString = buildQueryParams(params);
		const response = await apiClient.get<
			ApiResponse<PaginatedResponse<AdminUserDto>>
		>(`${API_ENDPOINTS.USERS.LIST}?${queryString}`);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as any;

		// Si la respuesta ya es la paginada (tiene propiedad pagination)
		if (body.pagination) {
			return body as PaginatedResponse<AdminUserDto>;
		}

		// Si está envuelta en ApiResponse (body.data tiene pagination)
		if (body.data && body.data.pagination) {
			return body.data as PaginatedResponse<AdminUserDto>;
		}

		// Si el backend devuelve { data: [...], meta: { ... } } (NestJS standard pagination often uses meta)
		if (body.data && body.meta) {
			return {
				data: body.data,
				pagination: {
					currentPage: body.meta.page,
					totalPages: body.meta.totalPages,
					totalItems: body.meta.total,
					itemsPerPage: body.meta.limit,
					hasNextPage: body.meta.page < body.meta.totalPages,
					hasPreviousPage: body.meta.page > 1,
				},
			};
		}

		// Fallback para otros formatos o devolver data directamente
		return body.data || (body as unknown as PaginatedResponse<AdminUserDto>);
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

const ROLE_IDS = {
	estudiante: 1,
	tutor: 2,
	admin: 3,
};

const STATUS_IDS = {
	activo: 1,
	inactivo: 2,
	suspendido: 3,
};

/**
 * Actualizar rol de un usuario
 */
export async function updateUserRole(
	userId: string,
	role: UpdateRoleRequest['role'],
): Promise<AdminUserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.UPDATE_ROLE.replace(':id', userId);
		const rolId = ROLE_IDS[role];

		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				rolId,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('Error updating user role:', error);
		throw error;
	}
}

/**
 * Suspender un usuario
 */
export async function suspendUser(userId: string): Promise<AdminUserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.SUSPEND.replace(':id', userId);
		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				estadoId: STATUS_IDS.suspendido,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('Error suspending user:', error);
		throw error;
	}
}

/**
 * Activar un usuario suspendido
 */
export async function activateUser(userId: string): Promise<AdminUserDto> {
	try {
		const endpoint = API_ENDPOINTS.USERS.ACTIVATE.replace(':id', userId);
		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				estadoId: STATUS_IDS.activo,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('Error activating user:', error);
		throw error;
	}
}
