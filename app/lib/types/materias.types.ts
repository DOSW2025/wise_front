/**
 * Types for Materias (Subjects) Management
 */

export interface Subject {
	codigo: string;
	nombre: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateSubjectDto {
	codigo: string;
	nombre: string;
}

export interface UpdateSubjectDto {
	nombre?: string;
}

export interface SubjectFilters {
	codigo?: string;
	nombre?: string;
}
