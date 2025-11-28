/**
 * Materials Service
 * Servicio para gestionar materiales educativos
 */

import apiClient from '../api/client';
import type {
	ApiResponse,
	CreateMaterialRequest,
	Material,
	MaterialFilters,
	MaterialRating,
	MaterialStats,
	PaginatedResponse,
	ResourceType,
	Subject,
	UpdateMaterialRequest,
} from '../types/api.types';

export class MaterialsService {
	// Obtener materiales con paginación
	async getMaterials(
		filters?: MaterialFilters,
	): Promise<PaginatedResponse<Material>> {
		const params = new URLSearchParams();

		// Parámetros de paginación
		if (filters?.page) params.append('page', filters.page.toString());
		if (filters?.limit) params.append('limit', filters.limit.toString());

		// Parámetros de filtrado
		if (filters?.subject) params.append('subject', filters.subject);
		if (filters?.resourceType)
			params.append('resourceType', filters.resourceType);
		if (filters?.semester)
			params.append('semester', filters.semester.toString());
		if (filters?.search) params.append('search', filters.search);

		const url = params.toString()
			? `/api/materials?${params}`
			: '/api/materials';
		const response = await apiClient.get<PaginatedResponse<Material>>(url);
		return response.data;
	}

	// Obtener material por ID
	async getMaterialById(id: string): Promise<Material> {
		const response = await apiClient.get<ApiResponse<Material>>(
			`/api/materials/${id}`,
		);
		if (!response.data.data) throw new Error('Material no encontrado');
		return response.data.data;
	}

	// Crear nuevo material
	async createMaterial(data: CreateMaterialRequest): Promise<Material> {
		const formData = new FormData();
		formData.append('nombre', data.nombre);
		formData.append('materia', data.materia);
		formData.append('tipo', data.tipo);
		formData.append('semestre', data.semestre.toString());
		if (data.descripcion) formData.append('descripcion', data.descripcion);
		formData.append('file', data.file);

		const response = await apiClient.post<ApiResponse<Material>>(
			'/api/materials',
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
			},
		);
		if (!response.data.data) throw new Error('Error al crear material');
		return response.data.data;
	}

	// Actualizar material
	async updateMaterial(
		id: string,
		data: UpdateMaterialRequest,
	): Promise<Material> {
		const response = await apiClient.put<ApiResponse<Material>>(
			`/api/materials/${id}`,
			data,
		);
		if (!response.data.data) throw new Error('Error al actualizar material');
		return response.data.data;
	}

	// Eliminar material
	async deleteMaterial(id: string): Promise<void> {
		await apiClient.delete(`/api/materials/${id}`);
	}

	// Registrar vista de material
	async viewMaterial(id: string): Promise<void> {
		await apiClient.post(`/api/materials/${id}/view`);
	}

	// Descargar material
	async downloadMaterial(id: string): Promise<Blob> {
		const response = await apiClient.get(`/api/materials/${id}/download`, {
			responseType: 'blob',
		});
		return response.data;
	}

	// Calificar material
	async rateMaterial(id: string, rating: number): Promise<void> {
		await apiClient.post(`/api/materials/${id}/ratings`, {
			calificacion: rating,
		});
	}

	// Obtener calificaciones de material
	async getMaterialRatings(id: string): Promise<MaterialRating[]> {
		const response = await apiClient.get<ApiResponse<MaterialRating[]>>(
			`/api/materials/${id}/ratings`,
		);
		return response.data.data || [];
	}

	// Obtener materiales del usuario
	async getUserMaterials(userId: string): Promise<Material[]> {
		const response = await apiClient.get<ApiResponse<Material[]>>(
			`/api/users/${userId}/materials`,
		);
		return response.data.data || [];
	}

	// Obtener materiales populares
	async getPopularMaterials(): Promise<MaterialStats> {
		const response = await apiClient.get<ApiResponse<MaterialStats>>(
			'/api/materials/stats/popular',
		);
		return response.data.data || { mostViewed: [], mostDownloaded: [] };
	}

	// Obtener materias
	async getSubjects(): Promise<Subject[]> {
		const response =
			await apiClient.get<ApiResponse<Subject[]>>('/api/subjects');
		return response.data.data || [];
	}

	// Obtener tipos de recursos
	async getResourceTypes(): Promise<ResourceType[]> {
		const response = await apiClient.get<ApiResponse<ResourceType[]>>(
			'/api/resource-types',
		);
		return response.data.data || [];
	}
}

export const materialsService = new MaterialsService();
