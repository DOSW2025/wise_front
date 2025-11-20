/**
 * Auth Service
 * Servicio para manejar autenticación y autorización
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { LoginRequest, LoginResponse, UserDto } from '../types/api.types';

/**
 * Login de usuario
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
	try {
		const response = await apiClient.post(
			API_ENDPOINTS.AUTH.LOGIN,
			credentials,
		);

		const data = response.data as unknown as Record<string, unknown>;

		// Soportar dos formas de respuesta:
		// 1) { success: true, data: { token|accessToken, user|usuario, refreshToken?, expiresIn|metadata.expiresIn } }
		// 2) { mensaje, accessToken|token, usuario|user, metadata.expiresIn|expiresIn, refreshToken? }

		let token: string | undefined;
		let refreshToken: string = '';
		let user: UserDto | undefined;
		let expiresIn: number = 0;

		// Type guard para verificar la estructura de data
		if (
			typeof data === 'object' &&
			data !== null &&
			'success' in data &&
			data.success &&
			'data' in data &&
			typeof data.data === 'object' &&
			data.data !== null
		) {
			const innerData = data.data as Record<string, unknown>;
			token = (
				typeof innerData.token === 'string'
					? innerData.token
					: typeof innerData.accessToken === 'string'
						? innerData.accessToken
						: undefined
			) as string | undefined;
			refreshToken =
				typeof innerData.refreshToken === 'string'
					? innerData.refreshToken
					: '';
			user = (
				typeof innerData.user === 'object'
					? innerData.user
					: typeof innerData.usuario === 'object'
						? innerData.usuario
						: undefined
			) as UserDto | undefined;

			const metadata =
				typeof innerData.metadata === 'object' ? innerData.metadata : null;
			expiresIn =
				typeof innerData.expiresIn === 'number'
					? innerData.expiresIn
					: metadata &&
							typeof (metadata as Record<string, unknown>).expiresIn ===
								'number'
						? ((metadata as Record<string, unknown>).expiresIn as number)
						: 0;
		} else if (typeof data === 'object' && data !== null) {
			token = (
				typeof data.token === 'string'
					? data.token
					: typeof data.accessToken === 'string'
						? data.accessToken
						: undefined
			) as string | undefined;
			refreshToken =
				typeof data.refreshToken === 'string' ? data.refreshToken : '';
			user = (
				typeof data.user === 'object'
					? data.user
					: typeof data.usuario === 'object'
						? data.usuario
						: undefined
			) as UserDto | undefined;

			const metadata = typeof data.metadata === 'object' ? data.metadata : null;
			expiresIn =
				typeof data.expiresIn === 'number'
					? data.expiresIn
					: metadata &&
							typeof (metadata as Record<string, unknown>).expiresIn ===
								'number'
						? ((metadata as Record<string, unknown>).expiresIn as number)
						: 0;
		}

		if (token && user) {
			// Guardar en localStorage
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('expiresIn', expiresIn.toString());

			return { token, refreshToken, user, expiresIn } as LoginResponse;
		}

		throw new Error(
			typeof data.message === 'string' ? data.message : 'Error en el login',
		);
	} catch (error: unknown) {
		// Type guard para verificar si el error tiene la estructura de una respuesta de API
		if (
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			typeof (error as { response?: { data?: unknown } }).response ===
				'object' &&
			(error as { response: { data?: unknown } }).response.data
		) {
			const apiError = (error as { response: { data: unknown } }).response
				.data as Record<string, unknown>;
			const message = (
				typeof apiError?.message === 'string'
					? apiError.message
					: typeof apiError?.error === 'string'
						? apiError.error
						: 'Error al iniciar sesión'
			) as string;
			throw new Error(message);
		}
		throw new Error('Error de conexión con el servidor');
	}
}

/**
 * Logout de usuario
 */
export async function logout(): Promise<void> {
	// Limpiar localStorage
	localStorage.removeItem('token');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('user');
	localStorage.removeItem('expiresIn');
}

/**
 * Obtener usuario actual desde localStorage
 */
export function getCurrentUser(): UserDto | null {
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
export function isAuthenticated(): boolean {
	const token = localStorage.getItem('token');
	const user = getCurrentUser();
	return !!(token && user);
}

/**
 * Obtener token de acceso
 */
export function getToken(): string | null {
	return localStorage.getItem('token');
}

/**
 * Obtener refresh token
 */
export function getRefreshToken(): string | null {
	return localStorage.getItem('refreshToken');
}
