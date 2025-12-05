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
		// Backend expects 'rol' instead of 'role'
		queryParams.append('rol', params.role);
	}
	if (params.status) {
		// Backend expects 'estado' instead of 'status'
		// Map status values to Spanish
		const statusMap: Record<string, string> = {
			active: 'activo',
			suspended: 'suspendido',
		};
		queryParams.append('estado', statusMap[params.status] || params.status);
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
					page: body.meta.page,
					limit: body.meta.limit,
					totalPages: body.meta.totalPages,
					totalItems: body.meta.total,
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
		// Accept either Spanish role keys or common English alternatives
		const roleKey = (role || '').toString().toLowerCase();
		const roleMap: Record<string, keyof typeof ROLE_IDS> = {
			estudiante: 'estudiante',
			student: 'estudiante',
			estudiante_id: 'estudiante',
			tutor: 'tutor',
			teacher: 'tutor',
			profesor: 'tutor',
			admin: 'admin',
			administrador: 'admin',
		};

		const mappedKey = roleMap[roleKey] || (roleKey as keyof typeof ROLE_IDS);
		const rolId = ROLE_IDS[mappedKey as keyof typeof ROLE_IDS];

		if (!rolId) {
			throw new Error(`Unknown role value: ${role}`);
		}

		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				rolId,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error: any) {
		console.error('Error updating user role:', error);
		if (error.response?.data) {
			console.error('Backend error details:', error.response.data);
		}
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
	} catch (error: any) {
		console.error('Error suspending user:', error);
		if (error.response?.data) {
			console.error('Backend error details:', error.response.data);
		}
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
	} catch (error: any) {
		console.error('Error activating user:', error);
		if (error.response?.data) {
			console.error('Backend error details:', error.response.data);
		}
		throw error;
	}
}
