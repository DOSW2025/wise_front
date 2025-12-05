export type ActivityType =
	| 'MATERIAL_COMPLETED'
	| 'TUTORING_ATTENDED'
	| 'TUTORING_HOSTED'
	| 'ANSWER_ACCEPTED'
	| 'ANSWER_UPVOTE_MILESTONES'
	| 'RESOURCE_SHARED_APPROVED'
	| 'COMMENT_HELPFUL'
	| 'ISSUE_REPORT_VALIDATED'
	| 'EVENT_ATTENDED';

export type BadgeTier = 'bronze' | 'silver' | 'gold';

// El código de insignia ahora es un string libre para permitir insignias personalizadas
export type BadgeCode = string;

export type UserRole = 'student' | 'tutor' | 'both';

export type UserLevel =
	| 'Novato'
	| 'Aprendiz'
	| 'Colaborador'
	| 'Avanzado'
	| 'Mentor'
	| 'Embajador';

// Definición base de una insignia (configurada por admin)
export interface Badge {
	id: string;
	code: string; // Código único de la insignia (ej: 'explorador', 'maestro_react')
	nombre: string;
	descripcion: string;
	tier: BadgeTier;
	targetRole: UserRole; // A quién aplica: estudiantes, tutores o ambos
	icon: string;
}

// Insignia obtenida por un usuario
export interface UserBadge extends Badge {
	earnedAt: string; // Fecha en que el usuario obtuvo la insignia
}

export interface ActivityEvent {
	id: string;
	userId: string;
	scopeId?: string;
	tipo: ActivityType;
	metadata?: Record<string, any>;
	actividadId: string;
	occurredAt: string;
	pointsAwarded: number;
}

export interface UserGamification {
	userId: string;
	xpTotal: number;
	xpSemanal: number;
	nivel: UserLevel;
	rachaSemanas: number;
	ultimaActividadAt: string;
	badges: UserBadge[]; // Insignias obtenidas por el usuario
	metaSemanalObjetivo: number;
	metaSemanalProgreso: number;
}

export interface LeaderboardEntry {
	rank: number;
	userAlias: string;
	userId: string;
	xpPeriodo: number;
	badges: number;
	avatarUrl?: string;
	isCurrentUser?: boolean;
}

export interface CategoryProgress {
	categoryId: string;
	categoryName: string;
	totalMaterials: number;
	completedMaterials: number;
	percentage: number;
}

export interface Challenge {
	id: string;
	titulo: string;
	descripcion: string;
	periodo: {
		inicio: string;
		fin: string;
	};
	objetivos: ChallengeObjective[];
	recompensaXP: number;
	estadoUsuario:
		| 'no_iniciado'
		| 'en_progreso'
		| 'listo_reclamar'
		| 'completado';
	progreso: number;
	icon: string;
	targetRole: UserRole; // A quién aplica este desafío
}

export type ObjectiveType = 'material' | 'tutoring' | 'custom';

export interface ChallengeObjective {
	descripcion: string;
	completado: boolean;
	tipo?: ObjectiveType;
	materialId?: string; // ID del material específico si tipo === 'material'
	materialNombre?: string; // Nombre del material para mostrar
	count?: number; // Cantidad requerida (ej: completar 3 materiales)
}

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
	Novato: 0,
	Aprendiz: 300,
	Colaborador: 900,
	Avanzado: 1800,
	Mentor: 3000,
	Embajador: 5000,
};

// Logro/Achievement (configurado por admin)
export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	target: number; // Meta a alcanzar
	reward: number; // Puntos de recompensa
	targetRole: UserRole; // A quién aplica
}

// Logro con progreso de un usuario
export interface UserAchievement extends Achievement {
	progress: number; // Progreso actual
	completed: boolean; // Si ya fue completado
}

// Recompensa/Reward (configurado por admin)
export interface Reward {
	id: string;
	title: string;
	description: string;
	pointsCost: number; // Costo en puntos
	icon: string;
	targetRole: UserRole; // A quién aplica
}

// Recompensa con estado de un usuario
export interface UserReward extends Reward {
	unlocked: boolean; // Si el usuario tiene suficientes puntos
	claimed: boolean; // Si ya fue reclamada
}

// BADGE_DEFINITIONS ha sido removido - ahora las insignias son dinámicas y configurables por el admin
// La información de la insignia (nombre, descripción, icono) viene directamente de la base de datos
