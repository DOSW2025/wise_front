/**
 * Tutor Profile Types
 * Tipos para el perfil del tutor
 */

export interface TutorAvailability {
	start: string;
	end: string;
	modalidad: 'VIRTUAL' | 'PRESENCIAL';
}

export interface TutorSchedule {
	monday?: TutorAvailability[];
	tuesday?: TutorAvailability[];
	wednesday?: TutorAvailability[];
	thursday?: TutorAvailability[];
	friday?: TutorAvailability[];
	saturday?: TutorAvailability[];
	sunday?: TutorAvailability[];
}

export interface TutorSubject {
	codigo: string;
	nombre: string;
}

export interface TutorRating {
	id: string;
	rating: number;
	comentario?: string;
	fecha: string;
	estudianteNombre?: string;
}

export interface TutorUser {
	id: string;
	email: string;
	nombre: string;
	apellido: string;
	rol: string;
	disponibilidad: TutorSchedule;
	avatarUrl?: string;
}

export interface TutorProfile {
	id: string;
	bio?: string;
	reputacion: number;
	usuario: TutorUser;
	materias: TutorSubject[];
	ratings: TutorRating[];
}
