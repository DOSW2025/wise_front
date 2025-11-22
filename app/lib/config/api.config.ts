/**
 * API Configuration
 * Configuración centralizada para las llamadas al backend
 */

export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3002',
	TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
} as const;

export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/wise/auth/login',
		GOOGLE_LOGIN: '/wise/auth/google',
		LOGOUT: '/wise/auth/logout',
		ME: '/wise/auth/me',
	},
	TUTOR: {
		PROFILE: '/wise/tutor/profile',
	},
	USERS: {
		LIST: '/wise/users',
		UPDATE_ROLE: '/wise/users/:id/role',
		SUSPEND: '/wise/users/:id/suspend',
		ACTIVATE: '/wise/users/:id/activate',
	},
} as const;
