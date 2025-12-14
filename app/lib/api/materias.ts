/**
 * API Client for Materias (Subjects)
 * Handles CRUD operations for subjects/materias
 */

import type {
	CreateSubjectDto,
	Subject,
	UpdateSubjectDto,
} from '../types/materias.types';
import apiClient from './client';

const MATERIAS_BASE = '/wise/tutorias/materias';

export const materiasApi = {
	/**
	 * Get all subjects with optional filters
	 */
	async getAll(filters?: {
		codigo?: string;
		nombre?: string;
	}): Promise<Subject[]> {
		const params = new URLSearchParams();
		if (filters?.codigo) params.append('codigo', filters.codigo);
		if (filters?.nombre) params.append('nombre', filters.nombre);

		const queryString = params.toString();
		const url = queryString ? `${MATERIAS_BASE}?${queryString}` : MATERIAS_BASE;

		const response = await apiClient.get<Subject[]>(url);
		return response.data;
	},

	/**
	 * Get a subject by its code
	 */
	async getByCodigo(codigo: string): Promise<Subject> {
		const response = await apiClient.get<Subject>(
			`${MATERIAS_BASE}/codigo/${codigo}`,
		);
		return response.data;
	},

	/**
	 * Create a new subject (Admin only)
	 */
	async create(data: CreateSubjectDto): Promise<Subject> {
		const response = await apiClient.post<Subject>(MATERIAS_BASE, data);
		return response.data;
	},

	/**
	 * Update a subject by its code (Admin only)
	 */
	async update(codigo: string, data: UpdateSubjectDto): Promise<Subject> {
		const response = await apiClient.patch<Subject>(
			`${MATERIAS_BASE}/codigo/${codigo}`,
			data,
		);
		return response.data;
	},

	/**
	 * Delete a subject by its code (Admin only)
	 */
	async delete(codigo: string): Promise<void> {
		await apiClient.delete(`${MATERIAS_BASE}/codigo/${codigo}`);
	},
};
