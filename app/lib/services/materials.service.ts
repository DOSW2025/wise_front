/**
 * Materials Service
 * Servicio para gestionar materiales educativos
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
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
	async createMaterial(
		data: CreateMaterialRequest & { userId: string },
	): Promise<Material> {
		const formData = new FormData();
		formData.append('title', data.nombre);
		formData.append('subject', data.materia);
		formData.append('description', data.descripcion || '');
		formData.append('userId', data.userId);
		formData.append('file', data.file);

		try {
			const response = await apiClient.post<any>(
				API_ENDPOINTS.MATERIALS.UPLOAD,
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				},
			);

			console.log('API Response:', response.data);

			// Mapear respuesta del API Gateway a estructura Material
			const apiResponse = response.data;

			// Validar que la respuesta tenga los campos esperados
			if (!apiResponse?.id || !apiResponse?.title) {
				throw new Error('Respuesta inválida del servidor');
			}

			// Mapear campos de la respuesta del API Gateway a Material
			const material: Material = {
				id: apiResponse.id,
				nombre: apiResponse.title,
				materia: apiResponse.subject,
				descripcion: apiResponse.description || '',
				fileUrl: apiResponse.fileUrl,
				createdAt: apiResponse.createdAt,
				updatedAt: apiResponse.createdAt, // El API no retorna updatedAt, usar createdAt
				// Campos por defecto (el API no los retorna)
				tipo: 'PDF',
				semestre: 1,
				tutor: 'Usuario',
				calificacion: 0,
				vistas: 0,
				descargas: 0,
			};

			console.log('Material procesado:', material);
			return material;
		} catch (error: any) {
			console.error('Error en createMaterial:', error);

			// Manejar errores de validación (422 - Unprocessable Entity)
			if (error?.response?.status === 422) {
				const errorData = error.response.data;
				const errorMessage = errorData?.message || 'Validación del PDF fallida';
				console.error('Error de validación:', errorMessage);
				throw new Error(errorMessage);
			}

			// Re-lanzar errores conocidos
			if (error instanceof Error) {
				throw error;
			}

			throw new Error('Error al crear material');
		}
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
