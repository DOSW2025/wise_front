/**
 * Auth API Service
 * Servicio para las operaciones de autenticación con Google OAuth
 */

import { API_ENDPOINTS } from '../config/api.config';
import {
	getStorageItem,
	getStorageJSON,
	removeStorageItem,
	STORAGE_KEYS,
	setStorageItem,
	setStorageJSON,
} from '../utils/storage';
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
			// Clear storage using secure utility functions
			removeStorageItem(STORAGE_KEYS.TOKEN);
			removeStorageItem(STORAGE_KEYS.USER);
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
		console.log('Saving auth data:', authResponse);
		console.log('User avatar URL being saved:', authResponse.user.avatarUrl);
		setStorageItem(STORAGE_KEYS.TOKEN, authResponse.access_token);
		setStorageJSON(STORAGE_KEYS.USER, authResponse.user);
		console.log('Auth data saved to localStorage');
	},

	/**
	 * Obtener token guardado
	 */
	getToken(): string | null {
		return getStorageItem(STORAGE_KEYS.TOKEN);
	},

	/**
	 * Obtener usuario guardado
	 */
	getUser(): UserResponse | null {
		const user = getStorageJSON<UserResponse>(STORAGE_KEYS.USER);
		console.log('Reading user from localStorage:', user);
		console.log('Avatar URL from storage:', user?.avatarUrl);
		return user;
	},

	/**
	 * Verificar si el usuario está autenticado
	 */
	isAuthenticated(): boolean {
		return !!this.getToken();
	},
};
