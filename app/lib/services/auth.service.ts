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
			const response = await apiClient.post(
				API_ENDPOINTS.AUTH.LOGIN,
				credentials,
			);

			const data = response.data as any;

			// Soportar dos formas de respuesta:
			// 1) { success: true, data: { token|accessToken, user|usuario, refreshToken?, expiresIn|metadata.expiresIn } }
			// 2) { mensaje, accessToken|token, usuario|user, metadata.expiresIn|expiresIn, refreshToken? }

			let token: string | undefined;
			let refreshToken: string = '';
			let user: UserDto | undefined;
			let expiresIn: number = 0;

			if (data?.success && data?.data) {
				token = data.data.token ?? data.data.accessToken;
				refreshToken = data.data.refreshToken ?? '';
				user = data.data.user ?? data.data.usuario;
				expiresIn =
					typeof data.data.expiresIn === 'number'
						? data.data.expiresIn
						: (data.data.metadata?.expiresIn ?? 0);
			} else if (data) {
				token = data.token ?? data.accessToken;
				refreshToken = data.refreshToken ?? '';
				user = data.user ?? data.usuario;
				expiresIn =
					typeof data.expiresIn === 'number'
						? data.expiresIn
						: (data.metadata?.expiresIn ?? 0);
			}

			if (token && user) {
				// Guardar en localStorage
				localStorage.setItem('token', token);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('expiresIn', expiresIn.toString());

				return { token, refreshToken, user, expiresIn } as LoginResponse;
			}

			throw new Error(data?.message || 'Error en el login');
		} catch (error: any) {
			if (error.response?.data) {
				const apiError = error.response.data;
				const message =
					apiError?.message || apiError?.error || 'Error al iniciar sesión';
				throw new Error(message);
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
