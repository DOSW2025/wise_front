/**
 * API Configuration
 * Configuración centralizada para las llamadas al backend
 */

export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api',
	TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
} as const;

export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/registro',
		LOGOUT: '/auth/logout',
		REFRESH: '/auth/refresh',
		ME: '/auth/me',
	},
} as const;
