/**
 * Materials Hooks
 * Hooks personalizados para gestionar materiales con React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { materialsService } from '../services/materials.service';
import type {
	CreateMaterialRequest,
	MaterialFilters,
	UpdateMaterialRequest,
} from '../types/api.types';

// Query keys
export const MATERIALS_QUERY_KEYS = {
	all: ['materials'] as const,
	lists: () => [...MATERIALS_QUERY_KEYS.all, 'list'] as const,
	list: (filters?: MaterialFilters) =>
		[...MATERIALS_QUERY_KEYS.lists(), filters] as const,
	details: () => [...MATERIALS_QUERY_KEYS.all, 'detail'] as const,
	detail: (id: string) => [...MATERIALS_QUERY_KEYS.details(), id] as const,
	subjects: ['subjects'] as const,
	resourceTypes: ['resource-types'] as const,
	userMaterials: (userId: string) => ['user-materials', userId] as const,
	popular: ['materials', 'popular'] as const,
	ratings: (materialId: string) =>
		['materials', materialId, 'ratings'] as const,
};

// Hook para obtener materiales con filtros
export function useMaterials(filters?: MaterialFilters) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.list(filters),
		queryFn: () => {
			// TODO: PRODUCCIÓN - Descomentar para usar backend real:
			// return materialsService.getMaterials(filters);

			// MOCK DATA - Eliminar cuando se conecte con backend
			// MOCK DATA completo
			const allMaterials = [
				{
					id: '1',
					nombre: 'Introducción a Algoritmos',
					materia: 'Programación I',
					tipo: 'PDF',
					semestre: 2,
					tutor: 'Dr. Juan Pérez',
					calificacion: 4.5,
					vistas: 125,
					descargas: 89,
					createdAt: '2024-01-15T10:00:00Z',
					updatedAt: '2024-01-15T10:00:00Z',
				},
				{
					id: '2',
					nombre: 'Estructuras de Datos Básicas',
					materia: 'Estructuras de Datos',
					tipo: 'DOCX',
					semestre: 3,
					tutor: 'Dra. María García',
					calificacion: 4.8,
					vistas: 203,
					descargas: 156,
					createdAt: '2024-01-10T14:30:00Z',
					updatedAt: '2024-01-10T14:30:00Z',
				},
				{
					id: '3',
					nombre: 'Ejercicios de Cálculo Diferencial',
					materia: 'Cálculo I',
					tipo: 'PDF',
					semestre: 1,
					tutor: 'Prof. Carlos López',
					calificacion: 4.2,
					vistas: 87,
					descargas: 45,
					createdAt: '2024-01-08T09:15:00Z',
					updatedAt: '2024-01-08T09:15:00Z',
				},
				{
					id: '4',
					nombre: 'Matrices y Vectores',
					materia: 'Álgebra Lineal',
					tipo: 'PPT',
					semestre: 2,
					tutor: 'Dr. Ana Martínez',
					calificacion: 4.6,
					vistas: 95,
					descargas: 67,
					createdAt: '2024-01-12T16:20:00Z',
					updatedAt: '2024-01-12T16:20:00Z',
				},
				{
					id: '5',
					nombre: 'Consultas SQL Básicas',
					materia: 'Bases de Datos',
					tipo: 'DOCX',
					semestre: 4,
					tutor: 'Prof. Luis Rodríguez',
					calificacion: 4.3,
					vistas: 112,
					descargas: 78,
					createdAt: '2024-01-05T11:45:00Z',
					updatedAt: '2024-01-05T11:45:00Z',
				},
			];

			// Simular filtrado
			let filtered = allMaterials;
			if (filters?.subject) {
				filtered = filtered.filter((m) => m.materia === filters.subject);
			}
			if (filters?.resourceType) {
				filtered = filtered.filter((m) => m.tipo === filters.resourceType);
			}
			if (filters?.semester) {
				filtered = filtered.filter((m) => m.semestre === filters.semester);
			}
			if (filters?.search) {
				const searchLower = filters.search.toLowerCase();
				filtered = filtered.filter(
					(m) =>
						m.nombre.toLowerCase().includes(searchLower) ||
						m.materia.toLowerCase().includes(searchLower) ||
						m.tutor.toLowerCase().includes(searchLower),
				);
			}

			// Simular paginación del backend
			const page = filters?.page || 1;
			const limit = filters?.limit || 12;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedData = filtered.slice(startIndex, endIndex);

			// Retornar estructura esperada del backend
			return Promise.resolve({
				data: paginatedData,
				pagination: {
					page,
					limit,
					totalItems: filtered.length,
					totalPages: Math.ceil(filtered.length / limit),
				},
			});
		},
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}

// Hook para obtener un material específico
export function useMaterial(id: string) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.detail(id),
		queryFn: () => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.getMaterialById(id);
			// MOCK DATA - buscar material por ID
			const allMaterials = [
				{
					id: '1',
					nombre: 'Introducción a Algoritmos',
					materia: 'Programación I',
					tipo: 'PDF',
					semestre: 2,
					tutor: 'Dr. Juan Pérez',
					calificacion: 4.5,
					vistas: 125,
					descargas: 89,
					createdAt: '2024-01-15T10:00:00Z',
					updatedAt: '2024-01-15T10:00:00Z',
					descripcion:
						'Material completo sobre algoritmos básicos y estructuras de control.',
				},
				{
					id: '2',
					nombre: 'Estructuras de Datos Básicas',
					materia: 'Estructuras de Datos',
					tipo: 'DOCX',
					semestre: 3,
					tutor: 'Dra. María García',
					calificacion: 4.8,
					vistas: 203,
					descargas: 156,
					createdAt: '2024-01-10T14:30:00Z',
					updatedAt: '2024-01-10T14:30:00Z',
					descripcion: 'Guía práctica sobre listas, pilas y colas.',
				},
				{
					id: '3',
					nombre: 'Ejercicios de Cálculo Diferencial',
					materia: 'Cálculo I',
					tipo: 'PDF',
					semestre: 1,
					tutor: 'Prof. Carlos López',
					calificacion: 4.2,
					vistas: 87,
					descargas: 45,
					createdAt: '2024-01-08T09:15:00Z',
					updatedAt: '2024-01-08T09:15:00Z',
					descripcion: 'Colección de ejercicios resueltos de derivadas.',
				},
				{
					id: '4',
					nombre: 'Matrices y Vectores',
					materia: 'Álgebra Lineal',
					tipo: 'PPT',
					semestre: 2,
					tutor: 'Dr. Ana Martínez',
					calificacion: 4.6,
					vistas: 95,
					descargas: 67,
					createdAt: '2024-01-12T16:20:00Z',
					updatedAt: '2024-01-12T16:20:00Z',
					descripcion: 'Presentación sobre operaciones con matrices.',
				},
				{
					id: '5',
					nombre: 'Consultas SQL Básicas',
					materia: 'Bases de Datos',
					tipo: 'DOCX',
					semestre: 4,
					tutor: 'Prof. Luis Rodríguez',
					calificacion: 4.3,
					vistas: 112,
					descargas: 78,
					createdAt: '2024-01-05T11:45:00Z',
					updatedAt: '2024-01-05T11:45:00Z',
					descripcion: 'Manual de consultas SELECT, INSERT, UPDATE y DELETE.',
				},
			];

			const material = allMaterials.find((m) => m.id === id);
			if (!material) {
				throw new Error('Material no encontrado');
			}

			return Promise.resolve(material);
		},
		enabled: !!id,
	});
}

// Hook para obtener materias
export function useSubjects() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.subjects,
		staleTime: 30 * 60 * 1000, // 30 minutos
	});
}

// Hook para obtener tipos de recursos
export function useResourceTypes() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.resourceTypes,
		staleTime: 30 * 60 * 1000, // 30 minutos
	});
}

// Hook para obtener materiales del usuario
export function useUserMaterials(userId: string) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.userMaterials(userId),
		queryFn: () => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.getUserMaterials(userId);
			// MOCK DATA - materiales del usuario logueado
			const userMaterials = [
				{
					id: '1',
					nombre: 'Introducción a Algoritmos',
					materia: 'Programación I',
					tipo: 'PDF',
					semestre: 2,
					tutor: 'Tutor Desarrollo',
					calificacion: 4.5,
					vistas: 125,
					descargas: 89,
					createdAt: '2024-01-15T10:00:00Z',
					updatedAt: '2024-01-15T10:00:00Z',
					descripcion: 'Material completo sobre algoritmos básicos.',
				},
				{
					id: '6',
					nombre: 'Ejercicios de Programación',
					materia: 'Programación I',
					tipo: 'DOCX',
					semestre: 2,
					tutor: 'Tutor Desarrollo',
					calificacion: 4.2,
					vistas: 67,
					descargas: 34,
					createdAt: '2024-01-20T09:30:00Z',
					updatedAt: '2024-01-20T09:30:00Z',
					descripcion: 'Colección de ejercicios prácticos.',
				},
			];

			return Promise.resolve(userMaterials);
		},
		enabled: !!userId,
	});
}

// Hook para obtener resumen de ratings del material
export function useMaterialRatingSummary(materialId: string) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.ratings(materialId),
		queryFn: () => materialsService.getMaterialRatingSummary(materialId),
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}

// Hook para obtener comentarios del material
export function useMaterialComments(materialId: string) {
	return useQuery({
		queryKey: [...MATERIALS_QUERY_KEYS.ratings(materialId), 'list'],
		queryFn: () => materialsService.getMaterialComments(materialId),
		staleTime: 5 * 60 * 1000, // 5 minutos
		enabled: !!materialId,
	});
}

// Hook para obtener estadísticas del usuario
export function useUserStats(userId: string) {
	return useQuery({
		queryKey: ['user-stats', userId],
		queryFn: () => materialsService.getUserStats(userId),
		staleTime: 5 * 60 * 1000, // 5 minutos
		enabled: !!userId,
	});
}

// Hook para obtener top 3 materiales más vistos
export function useTopViewedMaterials(userId: string) {
	return useQuery({
		queryKey: ['top-viewed', userId],
		queryFn: () => materialsService.getTopViewedMaterials(userId),
		staleTime: 5 * 60 * 1000, // 5 minutos
		enabled: !!userId,
	});
}

// Hook para obtener top 3 materiales más descargados
export function useTopDownloadedMaterials(userId: string) {
	return useQuery({
		queryKey: ['top-downloaded', userId],
		queryFn: () => materialsService.getTopDownloadedMaterials(userId),
		staleTime: 5 * 60 * 1000, // 5 minutos
		enabled: !!userId,
	});
}

// Hook para obtener porcentaje de tags del usuario
export function useTagsPercentage(userId: string) {
	return useQuery({
		queryKey: ['tags-percentage', userId],
		queryFn: () => materialsService.getTagsPercentage(userId),
		staleTime: 5 * 60 * 1000, // 5 minutos
		enabled: !!userId,
	});
}

// Hook para crear material
export function useCreateMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMaterialRequest) =>
			materialsService.createMaterial(data),
		onSuccess: () => {
			// Invalidar queries relacionadas
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.popular });
		},
	});
}

// Hook para actualizar material
export function useUpdateMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateMaterialRequest | FormData;
		}) => {
			return materialsService.updateMaterial(id, data);
		},
		onSuccess: (_, { id }) => {
			// Remover el material del cache de detalle
			queryClient.removeQueries({ queryKey: MATERIALS_QUERY_KEYS.detail(id) });

			// Invalidar todas las queries de materiales del usuario
			queryClient.invalidateQueries({
				queryKey: ['user-materials'],
			});

			// Invalidar otras queries
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.popular });
		},
		onError: (error: unknown) => {
			console.error('Error al actualizar material:', error);
		},
	});
}

// Hook para eliminar material
export function useDeleteMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => {
			return materialsService.deleteMaterial(id);
		},
		onSuccess: (_, id) => {
			// Remover el material del cache inmediatamente
			queryClient.removeQueries({ queryKey: MATERIALS_QUERY_KEYS.detail(id) });

			// Invalidar todas las queries de materiales del usuario
			queryClient.invalidateQueries({
				queryKey: ['user-materials'],
			});

			// Invalidar otras queries
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.popular });
		},
		onError: () => {
			// El error se maneja en el componente
			console.error('Error al eliminar material');
		},
	});
}

// Hook para registrar vista
export function useViewMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.viewMaterial(id);
			// Simular POST /api/materials/:id/view
			console.log(`Registrando vista para material ${id}`);
			return Promise.resolve();
		},
		onSuccess: (_, id) => {
			// Actualizar el contador de vistas en el cache
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.detail(id),
				(oldData: unknown) => {
					if (oldData && typeof oldData === 'object' && 'vistas' in oldData) {
						return {
							...oldData,
							vistas: (oldData as { vistas: number }).vistas + 1,
						};
					}
					return oldData;
				},
			);

			// Actualizar también en la lista
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
	});
}

// Hook para calificar material
export function useRateMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, rating }: { id: string; rating: number }) => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.rateMaterial(id, rating);
			// Simular POST /api/materials/:id/ratings
			console.log(`Calificando material ${id} con ${rating} estrellas`);
			return Promise.resolve();
		},
		onSuccess: (_, { id, rating }) => {
			// Actualizar calificación promedio en el cache
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.detail(id),
				(oldData: unknown) => {
					if (
						oldData &&
						typeof oldData === 'object' &&
						'calificacion' in oldData
					) {
						// Simular cálculo de nuevo promedio
						const currentRating = (oldData as { calificacion: number })
							.calificacion;
						const newRating = (currentRating + rating) / 2; // Simplificado
						return {
							...oldData,
							calificacion: newRating,
						};
					}
					return oldData;
				},
			);

			// Actualizar también en la lista
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
	});
}

// Hook para descargar material
export function useDownloadMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			console.log('Hook: Iniciando descarga de material', id);
			try {
				await materialsService.downloadMaterial(id);
				console.log('Hook: Servicio completó descarga');
			} catch (error: unknown) {
				console.error('Hook: Error del servicio:', error);
				throw error;
			}

			return Promise.resolve();
		},
		onSuccess: (_, id) => {
			// Actualizar el contador de descargas en el cache
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.detail(id),
				(oldData: unknown) => {
					if (
						oldData &&
						typeof oldData === 'object' &&
						'descargas' in oldData
					) {
						return {
							...oldData,
							descargas: (oldData as { descargas: number }).descargas + 1,
						};
					}
					return oldData;
				},
			);

			// Actualizar también en la lista
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
		onError: (error: unknown) => {
			console.error('Hook: Error en descarga:', error);
			const response = (
				error as { response?: { status?: unknown; statusText?: unknown } }
			).response;
			console.error('Hook: Error completo:', {
				message: error instanceof Error ? error.message : String(error),
				status: response?.status,
				statusText: response?.statusText,
			});
		},
	});
}
