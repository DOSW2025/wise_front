/**
 * Student Dashboard Types
 * Tipos para el dashboard del estudiante
 */

export interface StudentStats {
	tutoriasCompletadas: number;
	proximasTutorias: number;
	progresoAcademico: number;
	materialesGuardados: number;
}

export interface UpcomingTutoring {
	id: string;
	subject: string;
	tutorName: string;
	tutorAvatar?: string;
	date: string;
	time: string;
	modality: 'presencial' | 'virtual';
	location?: string;
	status: 'confirmed' | 'pending';
}

export interface RecommendedTutor {
	id: string;
	name: string;
	avatar?: string;
	subject: string;
	rating: number;
	reviewCount: number;
	availability: 'available' | 'busy' | 'offline';
	hourlyRate?: number;
}

export interface RecentMaterial {
	id: string;
	nombre: string;
	name?: string; // para compatibilidad hacia atrás
	userId: string;
	userName: string;
	extension: string;
	url: string;
	descripcion: string;
	vistos: number;
	descargas: number;
	createdAt: string;
	updatedAt: string;
	tags: string[];
	totalComentarios: number;
	subject?: string; // para compatibilidad hacia atrás
	rating?: number; // para compatibilidad hacia atrás
	calificacionPromedio?: number; // para compatibilidad hacia atrás
	downloadedAt?: string; // para compatibilidad hacia atrás
	type?: 'downloaded' | 'saved'; // para compatibilidad hacia atrás
}

export interface RecentActivity {
	id: string;
	type:
		| 'tutoring_completed'
		| 'material_downloaded'
		| 'material_saved'
		| 'tutor_rated';
	title: string;
	description: string;
	createdAt: string;
}

export interface StudentDashboardData {
	stats: StudentStats;
	upcomingTutoring: UpcomingTutoring[];
	recommendedTutors: RecommendedTutor[];
	recentMaterials: RecentMaterial[];
	recentActivity: RecentActivity[];
}
