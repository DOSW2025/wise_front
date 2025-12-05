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

export type BadgeCode =
	| 'explorador'
	| 'constante'
	| 'mentor_en_accion'
	| 'respuesta_util'
	| 'aporte_valioso'
	| 'guardian_de_materiales'
	| 'comunidad_activa';

export type UserLevel =
	| 'Novato'
	| 'Aprendiz'
	| 'Colaborador'
	| 'Avanzado'
	| 'Mentor'
	| 'Embajador';

export interface Badge {
	id: string;
	code: BadgeCode;
	nombre: string;
	descripcion: string;
	tier: BadgeTier;
	earnedAt: string;
	icon: string;
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
	badges: Badge[];
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
}

export interface ChallengeObjective {
	descripcion: string;
	completado: boolean;
}

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
	Novato: 0,
	Aprendiz: 300,
	Colaborador: 900,
	Avanzado: 1800,
	Mentor: 3000,
	Embajador: 5000,
};

export const BADGE_DEFINITIONS: Record<
	BadgeCode,
	{
		nombre: string;
		descripcion: Record<BadgeTier, string>;
		icon: string;
	}
> = {
	explorador: {
		nombre: 'Explorador',
		descripcion: {
			bronze: 'Completa 5 materiales',
			silver: 'Completa 15 materiales',
			gold: 'Completa 40 materiales',
		},
		icon: '🗺️',
	},
	constante: {
		nombre: 'Constante',
		descripcion: {
			bronze: 'Racha de 2 semanas',
			silver: 'Racha de 4 semanas',
			gold: 'Racha de 8 semanas',
		},
		icon: '🔥',
	},
	mentor_en_accion: {
		nombre: 'Mentor en Acción',
		descripcion: {
			bronze: 'Imparte 1 tutoría con rating ≥4.5',
			silver: 'Imparte 5 tutorías con rating ≥4.5',
			gold: 'Imparte 15 tutorías con rating ≥4.5',
		},
		icon: '👨‍🏫',
	},
	respuesta_util: {
		nombre: 'Respuesta Útil',
		descripcion: {
			bronze: '1 respuesta aceptada',
			silver: '5 respuestas aceptadas',
			gold: '15 respuestas aceptadas',
		},
		icon: '💡',
	},
	aporte_valioso: {
		nombre: 'Aporte Valioso',
		descripcion: {
			bronze: 'Publica 1 recurso aprobado',
			silver: 'Publica 5 recursos aprobados',
			gold: '5 recursos con 5 reacciones totales',
		},
		icon: '📚',
	},
	guardian_de_materiales: {
		nombre: 'Guardián de Materiales',
		descripcion: {
			bronze: '1 reporte válido confirmado',
			silver: '5 reportes válidos confirmados',
			gold: '10 reportes válidos confirmados',
		},
		icon: '🛡️',
	},
	comunidad_activa: {
		nombre: 'Comunidad Activa',
		descripcion: {
			bronze: 'Asiste a 2 eventos',
			silver: 'Asiste a 6 eventos',
			gold: 'Asiste a 12 eventos',
		},
		icon: '🌟',
	},
};
