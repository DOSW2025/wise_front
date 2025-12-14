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
		queryFn: () => materialsService.getMaterials(filters),
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}

// Hook para obtener un material específico
export function useMaterial(id: string) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.detail(id),
		queryFn: () => materialsService.getMaterialById(id),
		enabled: !!id,
	});
}

// Hook para obtener materias
export function useSubjects() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.subjects,
		queryFn: () => materialsService.getSubjects(),
		staleTime: 30 * 60 * 1000, // 30 minutos
	});
}

// Hook para obtener tipos de recursos
export function useResourceTypes() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.resourceTypes,
		queryFn: () => materialsService.getResourceTypes(),
		staleTime: 30 * 60 * 1000, // 30 minutos
	});
}

// Hook para obtener materiales del usuario
export function useUserMaterials(userId: string) {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.userMaterials(userId),
		queryFn: () => materialsService.getUserMaterials(userId),
		enabled: !!userId,
	});
}

// Hook para obtener materiales populares
export function usePopularMaterials() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.popular,
		queryFn: () => materialsService.getPopularMaterials(),
		staleTime: 10 * 60 * 1000, // 10 minutos
	});
}

// Hook para crear material
export function useCreateMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMaterialRequest & { userId: string }) =>
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
		mutationFn: ({ id, data }: { id: string; data: UpdateMaterialRequest }) => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.updateMaterial(id, data);
			// Simular PUT /api/materials/:id
			console.log(`Actualizando material ${id}:`, data);
			return Promise.resolve();
		},
		onSuccess: (_, { id, data }) => {
			// Actualizar el material en el cache
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.detail(id),
				(oldData: any) => {
					if (oldData) {
						return {
							...oldData,
							...data,
							updatedAt: new Date().toISOString(),
						};
					}
					return oldData;
				},
			);

			// Invalidar listas para refrescar
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.userMaterials('dev-tutor-1'),
			});
		},
	});
}

// Hook para eliminar material
export function useDeleteMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => {
			// TODO: PRODUCCIÓN - Reemplazar con: return materialsService.deleteMaterial(id);
			// Simular DELETE /api/materials/:id
			console.log(`Eliminando material ${id}`);
			return Promise.resolve();
		},
		onSuccess: (_, id) => {
			// Remover el material del cache inmediatamente
			queryClient.removeQueries({ queryKey: MATERIALS_QUERY_KEYS.detail(id) });

			// Actualizar listas removiendo el elemento
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.userMaterials('dev-tutor-1'),
				(oldData: any[]) => {
					if (oldData) {
						return oldData.filter((material) => material.id !== id);
					}
					return oldData;
				},
			);

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
				(oldData: any) => {
					if (oldData) {
						return {
							...oldData,
							vistas: oldData.vistas + 1,
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
				(oldData: any) => {
					if (oldData) {
						// Simular cálculo de nuevo promedio
						const currentRating = oldData.calificacion;
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
			} catch (error: any) {
				console.error('Hook: Error del servicio:', error);
				throw error;
			}
		},
		onSuccess: (_, id) => {
			console.log('Hook: Descarga completada para', id);
			// Actualizar el contador de descargas en el cache
			queryClient.setQueryData(
				MATERIALS_QUERY_KEYS.detail(id),
				(oldData: any) => {
					if (oldData) {
						return {
							...oldData,
							descargas: oldData.descargas + 1,
						};
					}
					return oldData;
				},
			);

			// Actualizar también en la lista
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
		onError: (error: any) => {
			console.error('Hook: Error en descarga:', error);
			console.error('Hook: Error completo:', {
				message: error?.message,
				status: error?.response?.status,
				statusText: error?.response?.statusText,
			});
		},
	});
}
