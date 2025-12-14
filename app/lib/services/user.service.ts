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
	RoleStatisticsResponse,
	UpdateRoleRequest,
	UserGrowthParams,
	UserGrowthResponse,
	UserStatisticsResponse,
} from '../types/api.types';

/**
 * Mapeo de roles: nombre → ID
 * Según el backend: 1=estudiante, 2=tutor, 3=admin
 */
const ROLE_ID_MAP: Record<string, number> = {
	estudiante: 1,
	student: 1,
	tutor: 2,
	teacher: 2,
	admin: 3,
	administrador: 3,
};

/**
 * Mapeo de estados: nombre → ID
 * Según el backend: 1=activo, 2=inactivo, 3=suspendido, 4=pendiente
 */
const STATUS_ID_MAP: Record<string, number> = {
	active: 1,
	activo: 1,
	inactive: 2,
	inactivo: 2,
	suspended: 3,
	suspendido: 3,
	pending: 4,
	pendiente: 4,
};

/**
 * Construye los parámetros de consulta para la paginación
 * IMPORTANTE: El backend espera rolId y estadoId como números, no strings
 */
function buildQueryParams(params: PaginationParams): string {
	const queryParams = new URLSearchParams();

	queryParams.append('page', params.page.toString());
	queryParams.append('limit', params.limit.toString());

	if (params.search) {
		queryParams.append('search', params.search);
	}

	// Convertir rol de nombre a ID
	if (params.role) {
		const roleKey = params.role.toLowerCase();
		const rolId = ROLE_ID_MAP[roleKey];

		if (rolId) {
			queryParams.append('rolId', rolId.toString());
			console.log(`🔄 Mapped role "${params.role}" → rolId: ${rolId}`);
		} else {
			console.warn(`⚠️ Unknown role: ${params.role}`);
		}
	}

	// Convertir estado de nombre a ID
	if (params.status) {
		const statusKey = params.status.toLowerCase();
		const estadoId = STATUS_ID_MAP[statusKey];

		if (estadoId) {
			queryParams.append('estadoId', estadoId.toString());
			console.log(
				`🔄 Mapped status "${params.status}" → estadoId: ${estadoId}`,
			);
		} else {
			console.warn(`⚠️ Unknown status: ${params.status}`);
		}
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
		const fullUrl = `${API_ENDPOINTS.USERS.LIST}?${queryString}`;

		console.log('📤 Fetching users:', fullUrl);
		console.log('📊 Original params:', params);

		const response =
			await apiClient.get<ApiResponse<PaginatedResponse<AdminUserDto>>>(
				fullUrl,
			);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as unknown;

		// Si la respuesta ya es la paginada (tiene propiedad pagination)
		if (body && typeof body === 'object' && 'pagination' in body) {
			console.log('✅ Response format: Direct pagination');
			return body as PaginatedResponse<AdminUserDto>;
		}

		// Si está envuelta en ApiResponse (body.data tiene pagination)
		if (
			body &&
			typeof body === 'object' &&
			'data' in body &&
			body.data &&
			typeof body.data === 'object' &&
			'pagination' in body.data
		) {
			console.log('✅ Response format: Wrapped in ApiResponse');
			return body.data as PaginatedResponse<AdminUserDto>;
		}

		// Si el backend devuelve { data: [...], meta: { ... } } (NestJS standard)
		if (
			body &&
			typeof body === 'object' &&
			'data' in body &&
			'meta' in body &&
			body.meta &&
			typeof body.meta === 'object'
		) {
			console.log('✅ Response format: NestJS standard (data + meta)');
			const meta = body.meta as {
				page: number;
				totalPages: number;
				total: number;
				limit: number;
			};
			return {
				data: body.data as AdminUserDto[],
				pagination: {
					page: meta.page,
					limit: meta.limit,
					totalPages: meta.totalPages,
					totalItems: meta.total,
				},
			};
		}

		// Fallback
		console.log('⚠️ Response format: Fallback (unknown structure)');
		if (body && typeof body === 'object' && 'data' in body) {
			return body.data as PaginatedResponse<AdminUserDto>;
		}

		return body as PaginatedResponse<AdminUserDto>;
	} catch (error) {
		console.error('❌ Error fetching users:', error);
		throw error;
	}
}

const ROLE_IDS = {
	estudiante: 1,
	admin: 2,
	tutor: 3,
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
		const roleKey = String(role || '').toLowerCase();
		const roleMap: Record<string, keyof typeof ROLE_IDS> = {
			estudiante: 'estudiante',
			student: 'estudiante',
			estudiante_id: 'estudiante',
			admin: 'admin',
			administrador: 'admin',
			tutor: 'tutor',
			teacher: 'tutor',
			profesor: 'tutor',
		};

		const mappedKey = (roleMap[roleKey] ?? roleKey) as keyof typeof ROLE_IDS;
		const rolId = ROLE_IDS[mappedKey];

		if (!rolId) {
			throw new Error(`Unknown role value: ${role}`);
		}

		console.log(
			`🔄 Updating user ${userId} to role: ${role} (rolId: ${rolId})`,
		);

		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				rolId,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('❌ Error updating user role:', error);
		if (error && typeof error === 'object' && 'response' in error) {
			const errorResponse = error.response as { data?: unknown };
			if (errorResponse.data) {
				console.error('Backend error details:', errorResponse.data);
			}
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

		console.log(
			`🚫 Suspending user ${userId} (estadoId: ${STATUS_IDS.suspendido})`,
		);

		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				estadoId: STATUS_IDS.suspendido,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('❌ Error suspending user:', error);
		if (error && typeof error === 'object' && 'response' in error) {
			const errorResponse = error.response as { data?: unknown };
			if (errorResponse.data) {
				console.error('Backend error details:', errorResponse.data);
			}
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

		console.log(
			`✅ Activating user ${userId} (estadoId: ${STATUS_IDS.activo})`,
		);

		const response = await apiClient.patch<ApiResponse<AdminUserDto>>(
			endpoint,
			{
				estadoId: STATUS_IDS.activo,
			},
		);

		return response.data.data || (response.data as unknown as AdminUserDto);
	} catch (error) {
		console.error('❌ Error activating user:', error);
		if (error && typeof error === 'object' && 'response' in error) {
			const errorResponse = error.response as { data?: unknown };
			if (errorResponse.data) {
				console.error('Backend error details:', errorResponse.data);
			}
		}
		throw error;
	}
}

/**
 * Obtener estadísticas de usuarios
 */
export async function getUserStatistics(): Promise<UserStatisticsResponse> {
	try {
		const response = await apiClient.get<ApiResponse<UserStatisticsResponse>>(
			API_ENDPOINTS.USERS.STATISTICS,
		);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as unknown;

		// Si la respuesta está envuelta en ApiResponse
		if (body && typeof body === 'object' && 'data' in body) {
			return body.data as UserStatisticsResponse;
		}

		// Si la respuesta es directa
		return body as UserStatisticsResponse;
	} catch (error) {
		console.error('❌ Error fetching user statistics:', error);
		throw error;
	}
}

/**
 * Obtener estadísticas de usuarios por rol
 */
export async function getRoleStatistics(): Promise<RoleStatisticsResponse> {
	try {
		const response = await apiClient.get<ApiResponse<RoleStatisticsResponse>>(
			API_ENDPOINTS.USERS.ROLE_STATISTICS,
		);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as unknown;

		// Si la respuesta está envuelta en ApiResponse
		if (body && typeof body === 'object' && 'data' in body) {
			return body.data as RoleStatisticsResponse;
		}

		// Si la respuesta es directa
		return body as RoleStatisticsResponse;
	} catch (error) {
		console.error('❌ Error fetching role statistics:', error);
		throw error;
	}
}

/**
 * Obtener estadísticas de crecimiento de usuarios
 */
export async function getUserGrowth(
	params: UserGrowthParams = {},
): Promise<UserGrowthResponse> {
	try {
		const queryParams = new URLSearchParams();
		if (params.weeks !== undefined) {
			queryParams.append('weeks', params.weeks.toString());
		}

		const url = `${API_ENDPOINTS.USERS.GROWTH_STATISTICS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
		const response = await apiClient.get<ApiResponse<UserGrowthResponse>>(url);

		// Manejar tanto respuestas envueltas como directas
		const body = response.data as unknown;

		// Si la respuesta está envuelta en ApiResponse con estructura { data: { period, totalUsuariosNuevos, data } }
		if (
			body &&
			typeof body === 'object' &&
			'data' in body &&
			body.data &&
			typeof body.data === 'object' &&
			'period' in body.data &&
			'totalUsuariosNuevos' in body.data &&
			'data' in body.data
		) {
			return body.data as UserGrowthResponse;
		}

		// Si la respuesta es directa con estructura { period, totalUsuariosNuevos, data }
		if (
			body &&
			typeof body === 'object' &&
			'period' in body &&
			'totalUsuariosNuevos' in body &&
			'data' in body
		) {
			return body as UserGrowthResponse;
		}

		// Fallback
		return body as UserGrowthResponse;
	} catch (error) {
		console.error('❌ Error fetching user growth statistics:', error);
		throw error;
	}
}
