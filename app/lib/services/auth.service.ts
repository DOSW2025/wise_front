/**
 * Auth Service
 * Servicio para manejar autenticación y autorización
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	ApiResponse,
	LoginRequest,
	LoginResponse,
	UserDto,
} from '../types/api.types';

export class AuthService {
	/**
	 * Login de usuario
	 */
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await apiClient.post<ApiResponse<LoginResponse>>(
				API_ENDPOINTS.AUTH.LOGIN,
				credentials,
			);

			if (response.data.success && response.data.data) {
				const { token, refreshToken, user, expiresIn } = response.data.data;

				// Guardar en localStorage
				localStorage.setItem('token', token);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('expiresIn', expiresIn.toString());

				return response.data.data;
			} else {
				throw new Error(response.data.message || 'Error en el login');
			}
		} catch (error: any) {
			// Manejar errores de la API
			if (error.response?.data) {
				const apiError = error.response.data;
				throw new Error(apiError.message || 'Error al iniciar sesión');
			}
			throw new Error('Error de conexión con el servidor');
		}
	}

	/**
	 * Logout de usuario
	 */
	static async logout(): Promise<void> {
		// Limpiar localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('user');
		localStorage.removeItem('expiresIn');
	}

	/**
	 * Obtener usuario actual desde localStorage
	 */
	static getCurrentUser(): UserDto | null {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				return JSON.parse(userStr);
			} catch {
				return null;
			}
		}
		return null;
	}

	/**
	 * Verificar si el usuario está autenticado
	 */
	static isAuthenticated(): boolean {
		const token = localStorage.getItem('token');
		const user = AuthService.getCurrentUser();
		return !!(token && user);
	}

	/**
	 * Obtener token de acceso
	 */
	static getToken(): string | null {
		return localStorage.getItem('token');
	}

	/**
	 * Obtener refresh token
	 */
	static getRefreshToken(): string | null {
		return localStorage.getItem('refreshToken');
	}
}
