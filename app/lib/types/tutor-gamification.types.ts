// Re-exportar tipos comunes desde gamification.types para mantener compatibilidad
export type {
	Achievement,
	Badge,
	BadgeTier,
	Reward,
	UserAchievement,
	UserBadge,
	UserReward,
	UserRole,
} from './gamification.types';

// TutorBadge es ahora un alias de UserBadge para retrocompatibilidad
export type TutorBadge = import('./gamification.types').UserBadge;
export type TutorAchievement = import('./gamification.types').UserAchievement;
export type TutorReward = import('./gamification.types').UserReward;

import type { UserBadge } from './gamification.types';

export interface TutorGamification {
	tutorId: string;
	totalPoints: number;
	level: number;
	levelName: string;
	nextLevelPoints: number;
	currentLevelPoints: number;
	badges: UserBadge[]; // Usa el tipo unificado
	totalSessions: number;
	totalStudents: number;
	averageRating: number;
	responseRate: number;
	streak: number; // consecutive weeks with activity
}

export const TUTOR_LEVELS = [
	{ level: 1, name: 'Tutor Novato', minPoints: 0 },
	{ level: 2, name: 'Tutor Aprendiz', minPoints: 100 },
	{ level: 3, name: 'Tutor Experimentado', minPoints: 300 },
	{ level: 4, name: 'Tutor Experto', minPoints: 600 },
	{ level: 5, name: 'Tutor Maestro', minPoints: 1000 },
	{ level: 6, name: 'Tutor Elite', minPoints: 1500 },
	{ level: 7, name: 'Gran Maestro', minPoints: 2500 },
];

// TUTOR_BADGE_DEFINITIONS ha sido removido - ahora las insignias son dinámicas
// Las insignias se gestionan desde el panel de administración con targetRole='tutor' o 'both'
