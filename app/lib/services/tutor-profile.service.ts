/**
 * Tutor Profile Service
 * Servicio para obtener el perfil del tutor
 */

import apiClient from '../api/client';
import type { ApiResponse } from '../types/api.types';
import type { TutorProfile } from '../types/tutor-profile.types';

/**
 * Obtener perfil del tutor por ID
 */
export async function getTutorProfile(tutorId: string): Promise<TutorProfile> {
	try {
		const response = await apiClient.get<ApiResponse<TutorProfile>>(
			`/api/tutors/${tutorId}`,
		);
		return response.data.data || response.data;
	} catch (error) {
		console.error('Error fetching tutor profile:', error);
		throw new Error('Error al cargar el perfil del tutor');
	}
}
