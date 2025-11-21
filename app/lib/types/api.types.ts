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
