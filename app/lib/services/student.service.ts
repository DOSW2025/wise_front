/**
 * Student Service
 * Servicio para manejar operaciones relacionadas con estudiantes
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import { extractErrorMessage, extractResponseData } from '../utils/api.utils';

export interface StudentProfile {
	name: string;
	email: string;
	phone: string;
	role?: string;
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
			role: (backendData.role as string) || profile.role,
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
			role: (backendData.role as string) || 'estudiante', // Este campo no existe en el backend aún
			description: (backendData.biografia as string) || '',
			semester: (backendData.semestre as string) || '',
			interests: (backendData.intereses as string[]) || [],
		};
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error, 'Error al obtener el perfil'));
	}
}
