/**
 * Tutor Profile Service
 * Servicio para obtener el perfil del tutor desde el backend real
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { TutorProfile } from '../types/tutor-profile.types';

interface BackendTutorMateria {
	materia: {
		codigo: string;
		nombre: string;
	} | null;
}

interface BackendRating {
	id: number;
	score: number;
	comment: string | null;
	createdAt: string;
}

interface BackendTutorProfile {
	usuarioId: string;
	bio: string | null;
	reputacion: number;
	usuario: {
		id: string;
		email: string;
		nombre: string;
		apellido: string;
		rol?: { nombre?: string } | null;
		disponibilidad?: TutorProfile['usuario']['disponibilidad'];
		avatarUrl?: string | null;
	};
	tutorMaterias: BackendTutorMateria[];
	ratings: BackendRating[];
}

const mapToTutorProfile = (data: BackendTutorProfile): TutorProfile => {
	return {
		id: data.usuarioId,
		bio: data.bio ?? undefined,
		reputacion: Number(data.reputacion ?? 0),
		usuario: {
			id: data.usuario.id,
			email: data.usuario.email,
			nombre: data.usuario.nombre,
			apellido: data.usuario.apellido,
			rol: data.usuario.rol?.nombre ?? 'TUTOR',
			disponibilidad: data.usuario.disponibilidad ?? {},
			avatarUrl: data.usuario.avatarUrl ?? undefined,
		},
		materias:
			data.tutorMaterias?.map((tm) => ({
				codigo: tm.materia?.codigo ?? '',
				nombre: tm.materia?.nombre ?? 'Materia',
			})) ?? [],
		ratings:
			data.ratings?.map((rating) => ({
				id: String(rating.id),
				rating: rating.score,
				comentario: rating.comment ?? undefined,
				fecha: rating.createdAt,
			})) ?? [],
	};
};

/**
 * Obtener perfil del tutor por ID (con conexión al backend)
 */
export async function getTutorProfile(tutorId: string): Promise<TutorProfile> {
	try {
		const url = `${API_ENDPOINTS.TUTORIAS.TUTORES}/${tutorId}`;
		const response = await apiClient.get<BackendTutorProfile>(url);
		return mapToTutorProfile(response.data);
	} catch (error) {
		console.error('Error fetching tutor profile:', error);
		throw new Error('Error al cargar el perfil del tutor');
	}
}
