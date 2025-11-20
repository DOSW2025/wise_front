/**
 * Auth Service
 * Servicio para manejar autenticación y autorización
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type { LoginRequest, LoginResponse, UserDto } from '../types/api.types';
import {
	clearStorage,
	getStorageItem,
	getStorageJSON,
	STORAGE_KEYS,
	setStorageItem,
	setStorageJSON,
} from '../utils/storage';

/**
 * Extrae el token de la respuesta (soporta 'token' o 'accessToken')
 */
function extractToken(data: Record<string, unknown>): string | undefined {
	if (typeof data.token === 'string') return data.token;
	if (typeof data.accessToken === 'string') return data.accessToken;
	return undefined;
}

/**
 * Extrae el refresh token de la respuesta
 */
function extractRefreshToken(data: Record<string, unknown>): string {
	return typeof data.refreshToken === 'string' ? data.refreshToken : '';
}

/**
 * Extrae el usuario de la respuesta (soporta 'user' o 'usuario')
 */
function extractUser(data: Record<string, unknown>): UserDto | undefined {
	if (typeof data.user === 'object' && data.user !== null) {
		return data.user as UserDto;
	}
	if (typeof data.usuario === 'object' && data.usuario !== null) {
		return data.usuario as UserDto;
	}
	return undefined;
}

/**
 * Extrae el tiempo de expiración de la respuesta
 */
function extractExpiresIn(data: Record<string, unknown>): number {
	if (typeof data.expiresIn === 'number') return data.expiresIn;

	const metadata = data.metadata as Record<string, unknown> | null;
	if (metadata && typeof metadata.expiresIn === 'number') {
		return metadata.expiresIn;
	}

	return 0;
}

/**
 * Verifica si la respuesta tiene estructura envuelta ({ success: true, data: {...} })
 */
function isWrappedResponse(data: Record<string, unknown>): boolean {
	return (
		'success' in data &&
		data.success === true &&
		'data' in data &&
		typeof data.data === 'object' &&
		data.data !== null
	);
}

/**
 * Parsea la respuesta del login y extrae los datos de autenticación
 */
function parseLoginResponse(data: Record<string, unknown>): LoginResponse {
	const responseData = isWrappedResponse(data)
		? (data.data as Record<string, unknown>)
		: data;

	const token = extractToken(responseData);
	const refreshToken = extractRefreshToken(responseData);
	const user = extractUser(responseData);
	const expiresIn = extractExpiresIn(responseData);

	if (!token || !user) {
		const message =
			typeof data.message === 'string' ? data.message : 'Error en el login';
		throw new Error(message);
	}

	return { token, refreshToken, user, expiresIn };
}

/**
 * Almacena los datos de autenticación en el storage
 */
function storeAuthData(authData: LoginResponse): void {
	setStorageItem(STORAGE_KEYS.TOKEN, authData.token);
	setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
	setStorageJSON(STORAGE_KEYS.USER, authData.user);
	setStorageItem(STORAGE_KEYS.EXPIRES_IN, authData.expiresIn.toString());
}

/**
 * Extrae el mensaje de error de la respuesta de la API
 */
function extractErrorMessage(error: unknown): string {
	if (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		typeof (error as { response?: { data?: unknown } }).response === 'object'
	) {
		const response = (error as { response: { data?: unknown } }).response;
		if (response.data && typeof response.data === 'object') {
			const apiError = response.data as Record<string, unknown>;
			if (typeof apiError.message === 'string') return apiError.message;
			if (typeof apiError.error === 'string') return apiError.error;
		}
	}
	return 'Error de conexión con el servidor';
}

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
		const authData = parseLoginResponse(data);
		storeAuthData(authData);

		return authData;
	} catch (error: unknown) {
		throw new Error(extractErrorMessage(error));
	}
}

/**
 * Logout de usuario
 */
export async function logout(): Promise<void> {
	// Clear all authentication data using secure storage utility
	clearStorage();
}

/**
 * Obtener usuario actual desde localStorage
 */
export function getCurrentUser(): UserDto | null {
	return getStorageJSON<UserDto>(STORAGE_KEYS.USER);
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
	const token = getStorageItem(STORAGE_KEYS.TOKEN);
	const user = getCurrentUser();
	return !!(token && user);
}

/**
 * Obtener token de acceso
 */
export function getToken(): string | null {
	return getStorageItem(STORAGE_KEYS.TOKEN);
}

/**
 * Obtener refresh token
 */
export function getRefreshToken(): string | null {
	return getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
}
