/**
 * Auth API Service
 * Servicio para las operaciones de autenticación
 */

import { API_ENDPOINTS } from '../config/api.config';
import apiClient from './client';

export interface RegistroUsuarioDTO {
	nombre: string;
	apellido: string;
	email: string;
	contraseña: string;
	telefono?: string;
	semestre?: number;
}

export interface LoginDTO {
	email: string;
	contraseña: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	user: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
	};
}

export const authService = {
	/**
	 * Registrar un nuevo usuario
	 */
	async registro(data: RegistroUsuarioDTO): Promise<AuthResponse> {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
		return response.data;
	},

	/**
	 * Iniciar sesión
	 */
	async login(data: LoginDTO): Promise<AuthResponse> {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
		return response.data;
	},

	/**
	 * Cerrar sesión
	 */
	async logout(): Promise<void> {
		await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
	},

	/**
	 * Refrescar token
	 */
	async refresh(refreshToken: string): Promise<AuthResponse> {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
			refresh_token: refreshToken,
		});
		return response.data;
	},

	/**
	 * Obtener usuario actual
	 */
	async me(): Promise<AuthResponse['user']> {
		const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
		return response.data;
	},
};
