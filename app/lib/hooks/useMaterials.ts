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

			return Promise.resolve(filtered);
		},
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
		queryFn: () => {
			// MOCK DATA para desarrollo
			return Promise.resolve([
				{ id: '1', nombre: 'Programación I' },
				{ id: '2', nombre: 'Estructuras de Datos' },
				{ id: '3', nombre: 'Cálculo I' },
				{ id: '4', nombre: 'Álgebra Lineal' },
				{ id: '5', nombre: 'Bases de Datos' },
			]);
		},
		staleTime: 30 * 60 * 1000, // 30 minutos
	});
}

// Hook para obtener tipos de recursos
export function useResourceTypes() {
	return useQuery({
		queryKey: MATERIALS_QUERY_KEYS.resourceTypes,
		queryFn: () => {
			// MOCK DATA para desarrollo
			return Promise.resolve([
				{ id: '1', nombre: 'PDF' },
				{ id: '2', nombre: 'DOCX' },
				{ id: '3', nombre: 'PPT' },
			]);
		},
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
		mutationFn: ({ id, data }: { id: string; data: UpdateMaterialRequest }) =>
			materialsService.updateMaterial(id, data),
		onSuccess: (_, { id }) => {
			// Invalidar queries relacionadas
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.detail(id),
			});
		},
	});
}

// Hook para eliminar material
export function useDeleteMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => materialsService.deleteMaterial(id),
		onSuccess: () => {
			// Invalidar queries relacionadas
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.popular });
		},
	});
}

// Hook para registrar vista
export function useViewMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => materialsService.viewMaterial(id),
		onSuccess: (_, id) => {
			// Actualizar el material específico
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.detail(id),
			});
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
	});
}

// Hook para calificar material
export function useRateMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, rating }: { id: string; rating: number }) =>
			materialsService.rateMaterial(id, rating),
		onSuccess: (_, { id }) => {
			// Invalidar queries relacionadas
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.detail(id),
			});
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.ratings(id),
			});
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
	});
}

// Hook para descargar material
export function useDownloadMaterial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => materialsService.downloadMaterial(id),
		onSuccess: (_, id) => {
			// Actualizar contadores
			queryClient.invalidateQueries({
				queryKey: MATERIALS_QUERY_KEYS.detail(id),
			});
			queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
		},
	});
}
