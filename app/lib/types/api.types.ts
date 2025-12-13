/**
 * API Types
 * Tipos TypeScript para las respuestas de la API
 */

export interface LoginRequest {
	email: string;
	contraseña: string;
}

export interface AuthUserDto {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	rol: 'estudiante' | 'tutor' | 'admin';
	avatarUrl?: string | null;
}

export interface RoleDto {
	id: number;
	nombre: string;
}

export interface StatusDto {
	id: number;
	nombre: string;
}

export interface AdminUserDto {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	rol: RoleDto;
	estado: StatusDto;
	avatar_url: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface LoginResponse {
	access_token: string;
	user: AuthUserDto;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string | Record<string, string[]>;
	message?: string;
}

export interface ApiError {
	success: false;
	error: string | Record<string, string[]>;
	message: string;
}

export interface PaginationParams {
	page: number;
	limit: number;
	search?: string;
	role?: 'estudiante' | 'tutor' | 'admin';
	status?: 'active' | 'suspended';
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		totalPages: number;
		totalItems: number;
	};
}

export interface UpdateRoleRequest {
	role: 'estudiante' | 'tutor' | 'admin';
}

export interface UpdateUserStatusRequest {
	estadoId: number;
}

// Material Types
export interface Material {
	id: string;
	nombre: string;
	materia: string;
	tipo: string;
	semestre: number;
	tutor: string;
	calificacion: number;
	vistas: number;
	descargas: number;
	createdAt: string;
	updatedAt: string;
	fileUrl?: string;
	descripcion?: string;
}

export interface Subject {
	id: string;
	nombre: string;
}

export interface ResourceType {
	id: string;
	nombre: string;
}

export interface MaterialFilters {
	subject?: string;
	resourceType?: string;
	semester?: number;
	search?: string;
	skip?: number;
	take?: number;
}

export interface MaterialCountResponse {
	Count: number;
}

export interface MaterialRating {
	id: string;
	materialId: string;
	userId: string;
	calificacion: number;
	createdAt: string;
}

export interface CreateMaterialRequest {
	nombre: string;
	materia: string;
	tipo: string;
	semestre: number;
	descripcion?: string;
	file: File;
}

export interface UpdateMaterialRequest {
	nombre?: string;
	materia?: string;
	tipo?: string;
	semestre?: number;
	descripcion?: string;
}

export interface MaterialStats {
	mostViewed: Material[];
	mostDownloaded: Material[];
}

// User Statistics Types
export interface UserStatusStats {
	conteo: number;
	porcentaje: number;
}

export interface UserStatisticsResumen {
	total: number;
	activos: UserStatusStats;
	suspendidos: UserStatusStats;
	inactivos: UserStatusStats;
}

export interface UserStatisticsResponse {
	resumen: UserStatisticsResumen;
}

// Role Statistics Types
export interface RoleStats {
	rolId: number;
	rol: string;
	conteo: number;
	porcentaje: number;
}

export interface RoleStatisticsResponse {
	totalUsuarios: number;
	roles: RoleStats[];
}

// User Growth Statistics Types
export interface UserGrowthParams {
	weeks?: number;
}

export interface GrowthDataPoint {
	semana: string;
	conteo: number;
	fecha: string;
}

export interface UserGrowthResponse {
	period: {
		inicio: string;
		fin: string;
		semanas: number;
	};
	totalUsuariosNuevos: number;
	data: GrowthDataPoint[];
}

// Notification Types
export interface NotificationDto {
	id: string;
	asunto: string;
	resumen: string;
	type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
	fechaCreacion: string;
	visto: boolean;
	userId: string;
	avatar?: string;
}

export interface CreateNotificationRequest {
	title: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
	userId?: string;
	avatar?: string;
}

export interface NotificationsResponse {
	notifications: NotificationDto[];
}

export interface UnreadCountResponse {
	unreadCount: number;
}

// API Response Types para el mapeo de materiales
export interface ApiMaterialRawResponse {
	id: string;
	nombre?: string;
	title?: string;
	materia?: string;
	subject?: string;
	tags?: string[];
	extension?: string;
	userName?: string;
	calificación?: number;
	vistos?: number;
	views?: number;
	descargas?: number;
	downloads?: number;
	createdAt: string;
	updatedAt?: string;
	previewURL?: string;
	url?: string;
	fileUrl?: string;
	descripcion?: string;
	description?: string;
	metadata?: ApiMaterialRawResponse;
	userId?: string;
}

// Axios Error Response Type
export interface AxiosErrorResponse {
	status?: number;
	statusText?: string;
	data?: {
		message?: string;
		[key: string]: unknown;
	};
}
