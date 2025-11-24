/**
 * API Types
 * Tipos TypeScript para las respuestas de la API
 */

export interface LoginRequest {
	email: string;
	contraseña: string;
}

export interface AuthUserDto {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	rol: 'estudiante' | 'tutor' | 'admin';
	avatarUrl?: string | null;
}

export interface RoleDto {
	id: number;
	nombre: string;
}

export interface StatusDto {
	id: number;
	nombre: string;
}

export interface AdminUserDto {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	rol: RoleDto;
	estado: StatusDto;
	avatar_url: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface LoginResponse {
	access_token: string;
	user: AuthUserDto;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string | Record<string, string[]>;
	message?: string;
}

export interface ApiError {
	success: false;
	error: string | Record<string, string[]>;
	message: string;
}

export interface PaginationParams {
	page: number;
	limit: number;
	search?: string;
	role?: 'estudiante' | 'tutor' | 'admin';
	status?: 'active' | 'suspended';
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface UpdateRoleRequest {
	role: 'estudiante' | 'tutor' | 'admin';
}

export interface UpdateUserStatusRequest {
	estadoId: number;
}

// Material Types
export interface Material {
	id: string;
	nombre: string;
	materia: string;
	tipo: string;
	semestre: number;
	tutor: string;
	calificacion: number;
	vistas: number;
	descargas: number;
	createdAt: string;
	updatedAt: string;
	fileUrl?: string;
	descripcion?: string;
}

export interface Subject {
	id: string;
	nombre: string;
}

export interface ResourceType {
	id: string;
	nombre: string;
}

export interface MaterialFilters {
	subject?: string;
	resourceType?: string;
	semester?: number;
	search?: string;
}

export interface MaterialRating {
	id: string;
	materialId: string;
	userId: string;
	calificacion: number;
	createdAt: string;
}

export interface CreateMaterialRequest {
	nombre: string;
	materia: string;
	tipo: string;
	semestre: number;
	descripcion?: string;
	file: File;
}

export interface UpdateMaterialRequest {
	nombre?: string;
	materia?: string;
	tipo?: string;
	semestre?: number;
	descripcion?: string;
}

export interface MaterialStats {
	mostViewed: Material[];
	mostDownloaded: Material[];
}
