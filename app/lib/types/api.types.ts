/**
 * API Types
 * Tipos TypeScript para las respuestas de la API
 */

export interface LoginRequest {
	email: string;
	contraseña: string;
}

export interface UserDto {
	id: string;
	name: string;
	email: string;
	role: 'estudiante' | 'tutor' | 'admin';
	phoneNumber?: string;
	avatar?: string | null;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	user: UserDto;
	expiresIn: number;
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
	isActive: boolean;
	reason?: string;
}
