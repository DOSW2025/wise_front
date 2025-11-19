/**
 * API Configuration
 * Configuración centralizada para las llamadas al backend
 */

export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
	TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
} as const;

export const API_ENDPOINTS = {
	AUTH: {
		GOOGLE_LOGIN: '/wise/auth/google',
		LOGOUT: '/wise/auth/logout',
		ME: '/wise/auth/me',
	},
} as const;
