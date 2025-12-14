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
	UpdateMaterialRequest,
	UserMaterialsResponse,
} from '../types/api.types';

export class MaterialsService {
	// Mapear errores del API a mensajes amigables
	private mapErrorMessage(error: any): string {
		const axiosError = error as { response?: AxiosErrorResponse };
		const status = axiosError?.response?.status;
		const message = axiosError?.response?.data?.message;

		// Errores de validación del PDF (422)
		if (status === 422) {
			return 'Documento marcado como inválido por nuestro sistema.';
		}

		// Conflicto - Material duplicado (409)
		if (status === 409) {
			if (message?.includes('already exists')) {
				return 'Ya existe un material con el mismo contenido. Por favor, usa un documento diferente.';
			}
			return message || 'Conflicto al guardar el material. Intenta nuevamente.';
		}

		// Otros errores
		return message || 'Error al procesar el material. Intenta nuevamente.';
	}

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
			// Usar endpoint de búsqueda si hay query de búsqueda
			const isSearching = filters?.search && filters.search.trim().length > 0;
			const endpoint = isSearching
				? API_ENDPOINTS.MATERIALS.SEARCH
				: API_ENDPOINTS.MATERIALS.GET_ALL;

			console.log('Obteniendo materiales de:', endpoint);
			console.log('Con filtros:', filters);

			// Construir parámetros de query
			const params: Record<string, number | string> = {};
			if (filters?.skip !== undefined) params.skip = filters.skip;
			if (filters?.take !== undefined) params.take = filters.take;

			if (isSearching && filters?.search) {
				// Para búsqueda, usar el parámetro 'nombre'
				params.nombre = filters.search;
			} else {
				// Para GET_ALL, usar 'search'
				if (filters?.search) params.search = filters.search;
			}

			if (filters?.subject) params.subject = filters.subject;

			const response = await apiClient.get<
				ApiMaterialRawResponse[] | { data: ApiMaterialRawResponse[] }
			>(endpoint, { params });

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
				calificacion: item.calificación || item.calificacionPromedio || 0, // Opcional, viene en GET /:id
				vistas: data.vistos || data.views || 0,
				descargas: data.descargas || data.downloads || 0,
				totalComentarios: data.totalComentarios || 0,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt || data.createdAt,
				fileUrl: item.previewURL || data.url || data.fileUrl,
				descripcion: data.descripcion || data.description || '',
				tags: data.tags || [],
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
		const response = await apiClient.get<ApiResponse<Material>>(
			`/api/materials/${id}`,
		);
		if (!response.data.data) throw new Error('Material no encontrado');
		return response.data.data;
	}

	// Crear nuevo material
	async createMaterial(data: CreateMaterialRequest): Promise<Material> {
		const formData = new FormData();
		formData.append('title', data.nombre);
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
				nombre: apiResponse.title, // El API retorna 'title'
				materia: apiResponse.subject || '', // El API retorna 'subject'
				descripcion: apiResponse.description || '', // El API retorna 'description'
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

			// Manejar errores con estructura de respuesta del API
			const mappedError = this.mapErrorMessage(error);
			throw new Error(mappedError);
		}
	}

	// Actualizar material
	async updateMaterial(
		id: string,
		data: UpdateMaterialRequest | FormData,
	): Promise<Material> {
		try {
			const config: any = {};

			// Si es FormData, establecer header multipart/form-data
			if (data instanceof FormData) {
				config.headers = { 'Content-Type': 'multipart/form-data' };
			}

			const response = await apiClient.put<any>(
				`${API_ENDPOINTS.MATERIALS.BASE}/${id}`,
				data,
				config,
			);

			// Manejar diferentes estructuras de respuesta
			const result = response.data.data || response.data;
			if (result && typeof result === 'object') {
				return result;
			}

			// Si la respuesta es exitosa pero vacía, asumimos que fue exitosa
			return { id } as Material;
		} catch (error) {
			console.error('Error al actualizar material:', error);

			// Manejar errores con estructura de respuesta del API
			const mappedError = this.mapErrorMessage(error);
			throw new Error(mappedError);
		}
	}

	// Eliminar material
	async deleteMaterial(id: string): Promise<void> {
		await apiClient.delete(`${API_ENDPOINTS.MATERIALS.BASE}/${id}`);
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

	// Obtener resumen de ratings del material
	async getMaterialRatingSummary(id: string): Promise<{
		materialId: string;
		calificacionPromedio: number;
		totalCalificaciones: number;
		totalDescargas: number;
		totalVistas: number;
	}> {
		try {
			const response = await apiClient.get<any>(
				API_ENDPOINTS.MATERIALS.GET_RATINGS(id),
			);
			return response.data;
		} catch (error) {
			console.error('Error al obtener resumen de ratings:', error);
			// Retornar valores por defecto si hay error
			return {
				materialId: id,
				calificacionPromedio: 0,
				totalCalificaciones: 0,
				totalDescargas: 0,
				totalVistas: 0,
			};
		}
	}

	// Obtener materiales del usuario
	async getUserMaterials(userId: string): Promise<Material[]> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_USER_MATERIALS(userId);
			console.log('Obteniendo materiales del usuario desde:', endpoint);

			const response = await apiClient.get<UserMaterialsResponse>(endpoint);

			console.log('API GET User Materials Response:', response.data);

			const { materials = [] } = response.data;

			// Mapear los materiales a la estructura interna
			const mappedMaterials = materials.map((item) =>
				this.mapApiMaterialToMaterial(item),
			);

			console.log('Materiales del usuario mapeados:', mappedMaterials);
			return mappedMaterials;
		} catch (error) {
			console.error('Error al obtener materiales del usuario:', error);
			return [];
		}
	}

	// Obtener comentarios y ratings de un material
	async getMaterialComments(id: string): Promise<MaterialRating[]> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_RATINGS_LIST(id);
			console.log('Obteniendo comentarios desde:', endpoint);

			const response = await apiClient.get<MaterialRating[]>(endpoint);

			console.log('API GET Material Comments Response:', response.data);
			return response.data || [];
		} catch (error) {
			console.error('Error al obtener comentarios del material:', error);
			return [];
		}
	}

	// Exportar estadísticas en PDF
	async exportStatsPdf(id: string): Promise<void> {
		try {
			const endpoint = API_ENDPOINTS.PDF_EXPORT.STATS(id);
			console.log('Exportando PDF de estadísticas desde:', endpoint);

			const response = await apiClient.get<Blob>(endpoint, {
				responseType: 'blob',
			});

			// Crear URL temporal para descargar el archivo
			const url = window.URL.createObjectURL(response.data);
			const link = document.createElement('a');
			link.href = url;
			link.download = `estadisticas_${id}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			console.log('PDF de estadísticas descargado exitosamente');
		} catch (error) {
			console.error('Error al exportar PDF de estadísticas:', error);
			throw error;
		}
	}

	// Obtener estadísticas del usuario
	async getUserStats(userId: string): Promise<{
		userId: string;
		calificacionPromedio: number;
		totalMateriales: number;
		totalDescargas: number;
		totalVistas: number;
	}> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_USER_STATS(userId);
			console.log('Obteniendo estadísticas del usuario desde:', endpoint);

			const response = await apiClient.get(endpoint);

			console.log('API GET User Stats Response:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error al obtener estadísticas del usuario:', error);
			// Retornar valores por defecto si hay error
			return {
				userId,
				calificacionPromedio: 0,
				totalMateriales: 0,
				totalDescargas: 0,
				totalVistas: 0,
			};
		}
	}

	// Obtener top 3 materiales más vistos
	async getTopViewedMaterials(userId: string): Promise<
		Array<{
			id: string;
			nombre: string;
			descargas: number;
			vistos: number;
			calificacionPromedio: number;
		}>
	> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_TOP_VIEWED(userId);
			console.log('Obteniendo top vistos desde:', endpoint);

			const response = await apiClient.get<{
				userId: string;
				topViewed?: Array<{
					id: string;
					nombre: string;
					descargas: number;
					vistos: number;
					calificacionPromedio: number;
				}>;
			}>(endpoint);

			console.log('API GET Top Viewed Response:', response.data);
			return response.data.topViewed || [];
		} catch (error) {
			console.error('Error al obtener top materiales vistos:', error);
			return [];
		}
	}

	// Obtener top 3 materiales más descargados
	async getTopDownloadedMaterials(userId: string): Promise<
		Array<{
			id: string;
			nombre: string;
			descargas: number;
			vistos: number;
			calificacionPromedio: number;
		}>
	> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_TOP_DOWNLOADED(userId);
			console.log('Obteniendo top descargados desde:', endpoint);

			const response = await apiClient.get<{
				userId: string;
				topDownloaded?: Array<{
					id: string;
					nombre: string;
					descargas: number;
					vistos: number;
					calificacionPromedio: number;
				}>;
			}>(endpoint);

			console.log('API GET Top Downloaded Response:', response.data);
			return response.data.topDownloaded || [];
		} catch (error) {
			console.error('Error al obtener top materiales descargados:', error);
			return [];
		}
	}

	// Obtener porcentaje de tags del usuario
	async getTagsPercentage(userId: string): Promise<
		Array<{
			tag: string;
			porcentaje: number;
		}>
	> {
		try {
			const endpoint = API_ENDPOINTS.MATERIALS.GET_TAGS_PERCENTAGE(userId);
			console.log('Obteniendo porcentaje de tags desde:', endpoint);

			const response = await apiClient.get<{
				userId: string;
				tags?: Array<{
					tag: string;
					porcentaje: number;
				}>;
			}>(endpoint);

			console.log('API GET Tags Percentage Response:', response.data);
			return response.data.tags || [];
		} catch (error) {
			console.error('Error al obtener porcentaje de tags:', error);
			return [];
		}
	}
}

export const materialsService = new MaterialsService();
