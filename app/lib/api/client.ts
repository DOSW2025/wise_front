/**
 * API Client
 * Cliente HTTP configurado con Axios para comunicarse con el backend
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';
import {
	getStorageItem,
	removeStorageItem,
	STORAGE_KEYS,
} from '../utils/storage';

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
		// Retrieve token using secure storage utility
		const token = getStorageItem(STORAGE_KEYS.TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor - Manejo de errores
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		// Si el error es 401, limpiar sesión y redirigir a login
		if (error.response?.status === 401) {
			removeStorageItem(STORAGE_KEYS.TOKEN);
			removeStorageItem(STORAGE_KEYS.USER);

			if (
				window.location.pathname !== '/login' &&
				window.location.pathname !== '/register'
			) {
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;
