/**
 * API Configuration
 * Configuración centralizada para las llamadas al backend
 */

const getBaseUrl = () => {
	// Use proxy path when running in Vercel client-side to avoid CORS issues
	if (
		typeof window !== 'undefined' &&
		window.location.hostname.includes('vercel.app')
	) {
		return '/api';
	}

	let url = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3002';

	// Ensure HTTPS for non-local environments to avoid Mixed Content errors
	if (
		url.startsWith('http://') &&
		!url.includes('localhost') &&
		!url.includes('127.0.0.1')
	) {
		url = url.replace('http://', 'https://');
	}

	if (!url.startsWith('http')) {
		url = `https://${url}`;
	}
	console.log('API Base URL configured:', url);
	return url;
};

export const API_CONFIG = {
	BASE_URL: getBaseUrl(),
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
		LIST: '/wise/gestion-usuarios',
		UPDATE_ROLE: '/wise/gestion-usuarios/:id/rol',
		SUSPEND: '/wise/gestion-usuarios/:id/estado',
		ACTIVATE: '/wise/gestion-usuarios/:id/estado',
	},
	FORUMS: {
		CREATE: '/wise/foros',
		LIST: '/wise/foros',
		REPLIES: (forumId: string) => `/wise/foros/${forumId}/respuestas`,
		REPLY: (forumId: string, replyId: string) =>
			`/wise/foros/${forumId}/respuestas/${replyId}`,
	},
} as const;
