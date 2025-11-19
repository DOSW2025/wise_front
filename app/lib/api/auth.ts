/**
 * Auth API Service
 * Servicio para las operaciones de autenticación con Google OAuth
 */

import { API_ENDPOINTS } from '../config/api.config';
import apiClient from './client';

export interface UserResponse {
	id: string;
	email: string;
	nombre: string;
	apellido: string;
	rol: string;
	avatarUrl?: string | null;
}

export interface AuthResponse {
	access_token: string;
	user: UserResponse;
}

export const authService = {
	/**
	 * Obtener URL de autenticación de Google
	 * Redirige al usuario al flujo de OAuth de Google
	 */
	getGoogleAuthUrl(): string {
		const baseUrl = API_ENDPOINTS.AUTH.GOOGLE_LOGIN;
		return `${apiClient.defaults.baseURL}${baseUrl}`;
	},

	/**
	 * Iniciar sesión con Google
	 * Redirige a la página de autenticación de Google
	 */
	loginWithGoogle(): void {
		window.location.href = this.getGoogleAuthUrl();
	},

	/**
	 * Cerrar sesión
	 */
	async logout(): Promise<void> {
		try {
			await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
		} finally {
			// Limpiar localStorage independientemente del resultado
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	},

	/**
	 * Obtener usuario actual
	 */
	async me(): Promise<UserResponse> {
		const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
		return response.data;
	},

	/**
	 * Guardar datos de autenticación
	 */
	saveAuthData(authResponse: AuthResponse): void {
		localStorage.setItem('token', authResponse.access_token);
		localStorage.setItem('user', JSON.stringify(authResponse.user));
	},

	/**
	 * Obtener token guardado
	 */
	getToken(): string | null {
		return localStorage.getItem('token');
	},

	/**
	 * Obtener usuario guardado
	 */
	getUser(): UserResponse | null {
		const userStr = localStorage.getItem('user');
		if (!userStr) return null;

		try {
			return JSON.parse(userStr);
		} catch (error) {
			console.error('Error al parsear usuario de localStorage:', error);
			// Limpiar dato corrupto
			localStorage.removeItem('user');
			return null;
		}
	},

	/**
	 * Verificar si el usuario está autenticado
	 */
	isAuthenticated(): boolean {
		return !!this.getToken();
	},
};
