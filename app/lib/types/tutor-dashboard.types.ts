/**
 * Tutor Dashboard Types
 * Tipos para el dashboard del tutor
 */

export interface TutorStats {
	tutoriasRealizadas: number;
	calificacionPromedio: number;
	estudiantesAtendidos: number;
	solicitudesPendientes: number;
	totalRatings: number;
}

export interface SessionRequest {
	id: string;
	studentName: string;
	studentAvatar?: string;
	subject: string;
	topic: string;
	date: string;
	time: string;
	duration: number;
	modality: 'presencial' | 'virtual';
	location?: string;
	description: string;
	status: 'pending' | 'confirmed' | 'cancelled';
	createdAt: string;
}

export interface UpcomingSession {
	id: string;
	studentName: string;
	studentAvatar?: string;
	subject: string;
	date: string;
	time: string;
	modality: 'presencial' | 'virtual';
	location?: string;
	status: 'confirmed' | 'pending';
}

export interface PopularMaterial {
	id: string;
	nombre: string;
	materia: string;
	descargas: number;
	calificacion: number;
	weeklyGrowth: number;
}

export interface RecentReview {
	id: string;
	studentName: string;
	studentAvatar?: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface TutorDashboardData {
	stats: TutorStats;
	upcomingSessions: UpcomingSession[];
	recentRequests: SessionRequest[];
	popularMaterials: PopularMaterial[];
	recentReviews: RecentReview[];
}
