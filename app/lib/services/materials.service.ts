/**
 * Materials Service
 * Servicio para gestionar materiales educativos
 */

import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
	ApiMaterialRawResponse,
	ApiResponse,
	AxiosErrorResponse,
	CreateMaterialRequest,
	Material,
	MaterialCountResponse,
	MaterialFilters,
	MaterialRating,
	MaterialStats,
	PaginatedResponse,
	ResourceType,
	Subject,
	UpdateMaterialRequest,
} from '../types/api.types';

export class MaterialsService {
	// Obtener total de materiales
	async getMaterialsCount(): Promise<number> {
		try {
			const response = await apiClient.get<MaterialCountResponse>(
				`${API_ENDPOINTS.MATERIALS.GET_ALL}/stats/count`,
			);
			console.log('Materials count response:', response.data);
			return response.data.Count || 0;
		} catch (error) {
			console.error('Error al obtener conteo de materiales:', error);
			return 0;
		}
	}

	// Obtener materiales con paginación desde API Gateway
	async getMaterials(
		filters?: MaterialFilters,
	): Promise<PaginatedResponse<Material>> {
		try {
			console.log('Obteniendo materiales de:', API_ENDPOINTS.MATERIALS.GET_ALL);
			console.log('Con filtros:', filters);

			// Construir parámetros de query
			const params: Record<string, number | string> = {};
			if (filters?.skip !== undefined) params.skip = filters.skip;
			if (filters?.take !== undefined) params.take = filters.take;
			if (filters?.search) params.search = filters.search;
			if (filters?.subject) params.subject = filters.subject;

			const response = await apiClient.get<
				ApiMaterialRawResponse[] | { data: ApiMaterialRawResponse[] }
			>(API_ENDPOINTS.MATERIALS.GET_ALL, { params });

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
				materials = response.data.map((item) =>
					this.mapApiMaterialToMaterial(item),
				);
			} else if (Array.isArray(response.data?.data)) {
				console.log(
					'Detectado response.data.data array, mapeando',
					response.data.data.length,
					'materiales',
				);
				materials = response.data.data.map((item) =>
					this.mapApiMaterialToMaterial(item),
				);
			} else {
				console.warn('Estructura de respuesta inesperada:', response.data);
			}

			console.log('Materiales mapeados:', materials);

			// Aplicar filtros adicionales en cliente si es necesario
			const filtered = materials;

			// Nota: search y subject ya se filtran en el backend si se envían como parámetros
			// Estos filtros en cliente son redundantes si el backend los maneja

			// Obtener total de items para calcular hasMore
			const total = await this.getMaterialsCount();

			// Calcular información de paginación
			const skip = filters?.skip || 0;
			const take = filters?.take || 15;

			return {
				data: filtered,
				pagination: {
					page: Math.floor(skip / take) + 1,
					limit: take,
					totalItems: total,
					totalPages: Math.ceil(total / take),
				},
			};
		} catch (error) {
			console.error('Error al obtener materiales:', error);
			throw error;
		}
	}

	// Mapear respuesta del API Gateway a estructura Material
	private mapApiMaterialToMaterial(item: ApiMaterialRawResponse): Material {
		console.log('Mapeando item del API:', item);

		try {
			// Detectar si la respuesta tiene estructura anidada (GET /:id) o plana (GET /)
			const data = item.metadata || item;

			console.log(
				'Estructura detectada:',
				item.metadata ? 'Con metadata' : 'Plana',
			);
			console.log('Datos a mapear:', data);

			const mapped: Material = {
				id: data.id,
				nombre: data.nombre || data.title || 'Sin título',
				materia: data.subject || data.tags?.[0] || 'Sin categoría',
				tipo: data.extension?.toUpperCase() || 'PDF',
				semestre: 1, // No viene en respuesta
				tutor: data.userName || 'Usuario desconocido',
				calificacion: item.calificación || 0, // En respuesta individual viene como "calificación"
				vistas: data.vistos || data.views || 0,
				descargas: data.descargas || data.downloads || 0,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt || data.createdAt,
				fileUrl: item.previewURL || data.url || data.fileUrl,
				descripcion: data.descripcion || data.description || '',
			};

			console.log('Material mapeado:', mapped);
			return mapped;
		} catch (error) {
			console.error('Error al mapear material:', error);
			throw error;
		}
	}

	// Obtener material por ID
	async getMaterialById(id: string): Promise<Material> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_BY_ID(id);

			const response = await apiClient.get<ApiMaterialRawResponse>(endpoint);

			console.log('API GET Material by ID Raw Response:', response);

			// Mapear respuesta a Material
			if (response.data) {
				const mapped = this.mapApiMaterialToMaterial(response.data);
				console.log('Material por ID mapeado:', mapped);
				return mapped;
			}

			throw new Error('Material no encontrado en la respuesta');
		} catch (error) {
			console.error('Error al obtener material por ID:', error);
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
			const response = await apiClient.post<Partial<Material>>(
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
			if (!apiResponse?.id || !apiResponse?.nombre) {
				throw new Error('Respuesta inválida del servidor');
			}

			// Mapear campos de la respuesta del API Gateway a Material
			const material: Material = {
				id: apiResponse.id,
				nombre: apiResponse.nombre,
				materia: apiResponse.materia || '',
				descripcion: apiResponse.descripcion || '',
				fileUrl: apiResponse.fileUrl,
				createdAt: apiResponse.createdAt || new Date().toISOString(),
				updatedAt: apiResponse.createdAt || new Date().toISOString(), // El API no retorna updatedAt, usar createdAt
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
		} catch (error) {
			console.error('Error en createMaterial:', error);

			// Manejar errores de validación (422 - Unprocessable Entity)
			const axiosError = error as { response?: AxiosErrorResponse };
			if (axiosError?.response?.status === 422) {
				const errorData = axiosError.response.data;
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
			console.log('Iniciando descarga del material:', id);
			const endpoint = `${API_ENDPOINTS.MATERIALS.BASE}/${id}/download`;

			const response = await apiClient.get<Blob>(endpoint, {
				responseType: 'blob',
			});

			// Crear un blob y descargarlo
			const blob = response.data;

			if (!blob || blob.size === 0) {
				throw new Error('El archivo descargado está vacío');
			}

			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Usar el nombre del archivo de la respuesta o un nombre por defecto
			const contentDisposition = response.headers[
				'content-disposition'
			] as string;
			let filename = `material-${id}.pdf`;

			if (contentDisposition) {
				console.log(' Content-Disposition:', contentDisposition);
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

			console.log(' Archivo descargado:', filename);
		} catch (error) {
			console.error(' Error al descargar material');

			// Si es 500, es error del servidor
			const axiosError = error as { response?: AxiosErrorResponse };
			if (axiosError?.response?.status === 500) {
				throw new Error(
					'Error del servidor (500). El endpoint /wise/materiales/:id/download devolvió un error interno. Verifica los logs del backend.',
				);
			}

			// Si es otro error
			const statusCode = axiosError?.response?.status || 'desconocido';
			const statusText = axiosError?.response?.statusText || '';
			const errorMessage =
				error instanceof Error ? error.message : 'Error al descargar';
			const statusDetail = statusText ? `: ${statusText}` : '';
			throw new Error(`Error ${statusCode}${statusDetail}: ${errorMessage}`);
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
			const response = await apiClient.get<
				ApiMaterialRawResponse[] | { data: ApiMaterialRawResponse[] }
			>(API_ENDPOINTS.MATERIALS.GET_ALL);

			console.log('API GET User Materials Response:', response.data);

			// Filtrar solo materiales del usuario actual
			let materials: Material[] = [];

			if (Array.isArray(response.data)) {
				materials = response.data
					.filter((item) => item.userId === userId)
					.map((item) => this.mapApiMaterialToMaterial(item));
			} else if (Array.isArray(response.data?.data)) {
				materials = response.data.data
					.filter((item) => item.userId === userId)
					.map((item) => this.mapApiMaterialToMaterial(item));
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
