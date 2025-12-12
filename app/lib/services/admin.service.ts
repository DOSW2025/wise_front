/**
 * Admin Service
 * Servicio para manejar operaciones relacionadas con administradores
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import { extractErrorMessage, extractResponseData } from '../utils/api.utils';

export interface AdminProfile {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
	avatarUrl?: string;
}

/**
 * DTO que espera el backend para admin
 */
interface UpdateAdminInfoDto {
	telefono?: string;
	biografia?: string;
}

/**
 * Actualizar información personal del administrador
 * Solo actualiza teléfono y biografía
 */
export async function updateAdminProfile(
	profile: AdminProfile,
): Promise<AdminProfile> {
	try {
		// Mapear los campos del frontend al DTO del backend
		const updateDto: UpdateAdminInfoDto = {
			telefono: profile.phone || undefined,
			biografia: profile.description || undefined,
		};

		const response = await apiClient.patch<ApiResponse<unknown>>(
			API_ENDPOINTS.ADMIN.PROFILE,
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
			role: (backendData.role as string) || profile.role,
			description: (backendData.biografia as string) || '',
			avatarUrl: profile.avatarUrl,
		};
	} catch (error: unknown) {
		throw new Error(
			extractErrorMessage(error, 'Error al actualizar el perfil'),
		);
	}
}

/**
 * Obtener perfil completo del administrador
 */
export async function getAdminProfile(): Promise<AdminProfile> {
	try {
		const response = await apiClient.get<ApiResponse<unknown>>(
			API_ENDPOINTS.ADMIN.GET_PROFILE,
		);

		const backendData = extractResponseData<Record<string, unknown>>(
			response.data,
		);

		// Mapear del formato backend al formato frontend
		return {
			name: `${(backendData.nombre as string) || ''} ${(backendData.apellido as string) || ''}`.trim(),
			email: (backendData.email as string) || '',
			phone: (backendData.telefono as string) || '',
			role: (backendData.role as string) || 'administrador',
			description: (backendData.biografia as string) || '',
			avatarUrl: (backendData.avatarUrl as string) || undefined,
		};
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error, 'Error al obtener el perfil'));
	}
}
