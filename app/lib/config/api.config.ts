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

	let url = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

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
		BASE: '/wise/tutor',
		PROFILE: '/wise/tutor/profile',
		STATS: '/wise/tutor/stats',
		SESSIONS: {
			UPCOMING: '/wise/tutor/sessions/upcoming',
			SCHEDULED: '/wise/tutor/sessions/scheduled',
		},
		REQUESTS: {
			RECENT: '/wise/tutor/requests/recent',
			PENDING: '/wise/tutor/requests/pending',
		},
		MATERIALS: {
			POPULAR: '/wise/tutor/materials/popular',
			MY_MATERIALS: '/wise/tutor/materials/mine',
		},
		REVIEWS: {
			RECENT: '/wise/tutor/reviews/recent',
			RATINGS: (tutorId: string) => `/wise/tutorias/${tutorId}/ratings`,
    		REPUTACION: (tutorId: string) => `/wise/tutorias/${tutorId}/reputacion`,
		},
		RATINGS: '/wise/tutorias/:id/ratings',
		REPUTACION: '/wise/tutorias/:id/reputacion',
	},
	STUDENT: {
		BASE: '/wise/student',
		STATS: '/wise/student/stats',
		PROFILE: '/wise/gestion-usuarios/me/info-personal',
		GET_PROFILE: '/wise/gestion-usuarios/me',
		TUTORING: {
			UPCOMING: '/wise/student/tutoring/upcoming',
			HISTORY: '/wise/student/tutoring/history',
		},
		TUTORS: {
			RECOMMENDED: '/wise/student/tutors/recommended',
			SEARCH: '/wise/student/tutors/search',
		},
		MATERIALS: {
			RECENT: '/wise/student/materials/recent',
			SAVED: '/wise/student/materials/saved',
		},
		ACTIVITY: {
			RECENT: '/wise/student/activity/recent',
		},
	},

	USERS: {
		LIST: '/wise/gestion-usuarios',
		UPDATE_ROLE: '/wise/gestion-usuarios/:id/rol',
		SUSPEND: '/wise/gestion-usuarios/:id/estado',
		ACTIVATE: '/wise/gestion-usuarios/:id/estado',
		STATISTICS: '/wise/gestion-usuarios/estadisticas/usuarios',
		ROLE_STATISTICS: '/wise/gestion-usuarios/estadisticas/roles',
		GROWTH_STATISTICS: '/wise/gestion-usuarios/estadisticas/crecimiento',
	},
	TUTORIAS: {
		TUTORES: '/wise/tutorias/tutores',
		STUDENT_SESSIONS: '/wise/tutorias/sessions/student/:studentId',
		UPCOMING_SESSIONS: '/wise/tutorias/upcoming/{userId}',
		TUTORIA_STATS: '/wise/tutorias/stats/{userId}',
		TUTOR_NAME: '/wise/tutorias/nombre/{id}',
		MATERIA: '/wise/tutorias/materia/{codigo}',
		TUTOR_MATERIAS: '/wise/tutorias/{id}/materias',
		CREATE_SESSION: '/wise/tutorias/sessions',
		CANCEL_SESSION: '/wise/tutorias/sessions/{id}/cancelar',
		CONFIRM_SESSION: '/wise/tutorias/sessions/{id}/confirmar',
		REJECT_SESSION: '/wise/tutorias/sessions/{id}/rechazar',
		PENDING_SESSIONS: '/wise/tutorias/{id}/pending-sessions',
		CONFIRMED_SESSIONS: '/wise/tutorias/{id}/confirmed-sessions',
		COMPLETE_SESSION: '/wise/tutorias/sessions/{id}/completar',
		GET_AVAILABILITY: '/wise/tutorias/disponibilidad/id/{id}',
		UPDATE_AVAILABILITY: '/wise/tutorias/id/{id}/availability',
		RATINGS: '/wise/tutorias/ratings',
	},
	COMUNIDAD: {
		CHATS: '/chats',
		FORUMS: '/forums',
		THREADS: '/threads',
		RESPONSES: '/responses',
	},
} as const;
