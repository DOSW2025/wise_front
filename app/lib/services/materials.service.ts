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
	// Obtener materiales con paginación desde API Gateway
	async getMaterials(
		filters?: MaterialFilters,
	): Promise<PaginatedResponse<Material>> {
		try {
			console.log('Obteniendo materiales de:', API_ENDPOINTS.MATERIALS.GET_ALL);

			const response = await apiClient.get<any>(
				API_ENDPOINTS.MATERIALS.GET_ALL,
			);

			console.log('API GET Materials Raw Response:', response);
			console.log('API GET Materials Response Data:', response.data);
			console.log('Response Data Type:', typeof response.data);
			console.log('Is Array:', Array.isArray(response.data));

			// La respuesta es un array directo de materiales
			let materials: Material[] = [];

			if (Array.isArray(response.data)) {
				console.log(
					'Detectado array directo, mapeando',
					response.data.length,
					'materiales',
				);
				materials = response.data.map((item: any) =>
					this.mapApiMaterialToMaterial(item),
				);
			} else if (Array.isArray(response.data?.data)) {
				console.log(
					'Detectado response.data.data array, mapeando',
					response.data.data.length,
					'materiales',
				);
				materials = response.data.data.map((item: any) =>
					this.mapApiMaterialToMaterial(item),
				);
			} else {
				console.warn('Estructura de respuesta inesperada:', response.data);
			}

			console.log('Materiales mapeados:', materials);

			// Aplicar filtros en cliente si es necesario
			let filtered = materials;

			if (filters?.search) {
				const searchLower = filters.search.toLowerCase();
				filtered = filtered.filter(
					(m) =>
						m.nombre.toLowerCase().includes(searchLower) ||
						m.materia.toLowerCase().includes(searchLower) ||
						m.tutor.toLowerCase().includes(searchLower),
				);
			}

			if (filters?.subject) {
				filtered = filtered.filter((m) => m.materia === filters.subject);
			}

			// Simular paginación
			const page = filters?.page || 1;
			const limit = filters?.limit || 12;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedData = filtered.slice(startIndex, endIndex);

			return {
				data: paginatedData,
				pagination: {
					page,
					limit,
					totalItems: filtered.length,
					totalPages: Math.ceil(filtered.length / limit),
				},
			};
		} catch (error) {
			console.error('Error al obtener materiales:', error);
			throw error;
		}
	}

	// Mapear respuesta del API Gateway a estructura Material
	private mapApiMaterialToMaterial(item: any): Material {
		console.log('🔄 Mapeando item del API:', item);

		try {
			const mapped: Material = {
				id: item.id,
				nombre: item.nombre || item.title || 'Sin título',
				materia: item.subject || item.tags?.[0] || 'Sin categoría',
				tipo: item.extension?.toUpperCase() || 'PDF',
				semestre: 1, // No viene en respuesta
				tutor: item.userName || 'Usuario desconocido',
				calificacion: 0, // No viene en respuesta
				vistas: item.vistos || item.views || 0,
				descargas: item.descargas || item.downloads || 0,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				fileUrl: item.url || item.fileUrl,
				descripcion: item.descripcion || item.description || '',
			};

			console.log('✨ Material mapeado:', mapped);
			console.log('📎 FileUrl mapeado:', mapped.fileUrl);
			return mapped;
		} catch (error) {
			console.error('❌ Error al mapear material:', error);
			throw error;
		}
	}

	// Obtener material por ID
	async getMaterialById(id: string): Promise<Material> {
		try {
			console.log('🔍 Obteniendo material por ID:', id);
			const endpoint = API_ENDPOINTS.MATERIALS.GET_BY_ID(id);
			console.log('📍 Endpoint:', endpoint);

			const response = await apiClient.get<any>(endpoint);

			console.log('✅ API GET Material by ID Raw Response:', response);
			console.log('📦 Response Data:', response.data);
			console.log('� Response Status:', response.status);

			// Mapear respuesta a Material
			if (response.data) {
				console.log('🔗 Response tiene data, mapeando...');
				const mapped = this.mapApiMaterialToMaterial(response.data);
				console.log('✨ Material por ID mapeado:', mapped);
				return mapped;
			}

			throw new Error('Material no encontrado en la respuesta');
		} catch (error: any) {
			console.error('❌ Error al obtener material por ID:', error);
			console.error('Error status:', error?.response?.status);
			console.error('Error data:', error?.response?.data);
			console.error('Error message:', error?.message);
			throw error;
		}
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
	async downloadMaterial(id: string): Promise<void> {
		try {
			console.log('📥 Iniciando descarga del material:', id);
			const endpoint = `${API_ENDPOINTS.MATERIALS.BASE}/${id}/download`;
			console.log(
				'📍 URL completa:',
				`${apiClient.defaults.baseURL}${endpoint}`,
			);
			console.log('📍 Endpoint relativo:', endpoint);

			const response = await apiClient.get<any>(endpoint, {
				responseType: 'blob',
			});

			console.log('✅ Respuesta recibida - Status:', response.status);
			console.log('📦 Blob Size:', response.data.size);
			console.log('📦 Blob Type:', response.data.type);

			// Crear un blob y descargarlo
			const blob = response.data;

			if (!blob || blob.size === 0) {
				throw new Error('El archivo descargado está vacío');
			}

			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Usar el nombre del archivo de la respuesta o un nombre por defecto
			const contentDisposition = response.headers['content-disposition'];
			let filename = `material-${id}.pdf`;

			if (contentDisposition) {
				console.log('📄 Content-Disposition:', contentDisposition);
				const filenameMatch = contentDisposition.match(
					/filename="?(.+?)"?(?:;|$)/,
				);
				if (filenameMatch) {
					filename = filenameMatch[1];
					console.log('📄 Nombre extraído:', filename);
				}
			}

			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			console.log('✨ Archivo descargado:', filename);
		} catch (error: any) {
			console.error('❌ Error al descargar material');
			console.error('📊 Status:', error?.response?.status);
			console.error('📊 StatusText:', error?.response?.statusText);
			console.error('📊 Message:', error?.message);

			// Si es 500, es error del servidor
			if (error?.response?.status === 500) {
				throw new Error(
					'Error del servidor (500). El endpoint /wise/materiales/:id/download devolvió un error interno. Verifica los logs del backend.',
				);
			}

			// Si es otro error
			throw new Error(
				`Error ${error?.response?.status || 'desconocido'}: ${error?.response?.statusText || error?.message || 'Error al descargar'}`,
			);
		}
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
		try {
			const response = await apiClient.get<any>(
				API_ENDPOINTS.MATERIALS.GET_ALL,
			);

			console.log('API GET User Materials Response:', response.data);

			// Filtrar solo materiales del usuario actual
			let materials: Material[] = [];

			if (Array.isArray(response.data)) {
				materials = response.data
					.filter((item: any) => item.userId === userId)
					.map((item: any) => this.mapApiMaterialToMaterial(item));
			} else if (Array.isArray(response.data?.data)) {
				materials = response.data.data
					.filter((item: any) => item.userId === userId)
					.map((item: any) => this.mapApiMaterialToMaterial(item));
			}

			return materials;
		} catch (error) {
			console.error('Error al obtener materiales del usuario:', error);
			return [];
		}
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
