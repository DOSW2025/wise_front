/**
 * API Client
 * Cliente HTTP configurado con Axios para comunicarse con el backend
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: API_CONFIG.TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Request interceptor - Agregar token de autenticación
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor - Manejo de errores y refresh token
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		// Si el error es 401 y no es la ruta de login, intentar refresh
		if (error.response?.status === 401) {
			// Limpiar sesión y redirigir a login
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');

			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;
