/**
 * Tutor Rating Types
 * Tipos para los ratings y reputación del tutor
 */

export interface TutorRating {
	id: string;
	rating: number;
	comentario?: string;
	fecha: string;
	estudianteNombre?: string;
	materia?: string;
	codigoMateria?: string;
}

export interface TutorReputation {
	tutorId: string;
	nombreTutor: string;
	reputacion: number;
	totalRatings: number;
}
