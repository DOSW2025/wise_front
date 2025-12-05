export type TutorBadgeCode =
	| 'primer_paso'
	| 'dedicado'
	| 'mentor_estrella'
	| 'experto'
	| 'maestro'
	| 'excelencia'
	| 'especialista'
	| 'versatil'
	| 'comunicador'
	| 'impacto_positivo';

export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface TutorBadge {
	id: string;
	code: TutorBadgeCode;
	nombre: string;
	descripcion: string;
	tier: BadgeTier;
	earnedAt: string;
	icon: string;
}

export interface TutorGamification {
	tutorId: string;
	totalPoints: number;
	level: number;
	levelName: string;
	nextLevelPoints: number;
	currentLevelPoints: number;
	badges: TutorBadge[];
	totalSessions: number;
	totalStudents: number;
	averageRating: number;
	responseRate: number;
	streak: number; // consecutive weeks with activity
}

export interface TutorAchievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	progress: number;
	target: number;
	completed: boolean;
	reward: number; // points
}

export interface TutorReward {
	id: string;
	title: string;
	description: string;
	pointsCost: number;
	icon: string;
	unlocked: boolean;
	claimed: boolean;
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

export const TUTOR_BADGE_DEFINITIONS: Record<
	TutorBadgeCode,
	{
		nombre: string;
		descripcion: Record<BadgeTier, string>;
		icon: string;
	}
> = {
	primer_paso: {
		nombre: 'Primer Paso',
		descripcion: {
			bronze: 'Completa tu primera sesión',
			silver: 'Completa 10 sesiones',
			gold: 'Completa 50 sesiones',
		},
		icon: 'Target',
	},
	dedicado: {
		nombre: 'Tutor Dedicado',
		descripcion: {
			bronze: 'Imparte 20 horas de tutoría',
			silver: 'Imparte 50 horas de tutoría',
			gold: 'Imparte 100 horas de tutoría',
		},
		icon: 'Clock',
	},
	mentor_estrella: {
		nombre: 'Mentor Estrella',
		descripcion: {
			bronze: 'Calificación promedio de 4.0',
			silver: 'Calificación promedio de 4.5',
			gold: 'Calificación promedio de 4.8',
		},
		icon: 'Star',
	},
	experto: {
		nombre: 'Experto en Materia',
		descripcion: {
			bronze: '15 sesiones en una materia',
			silver: '30 sesiones en una materia',
			gold: '50 sesiones en una materia',
		},
		icon: 'BookOpen',
	},
	maestro: {
		nombre: 'Maestro del Conocimiento',
		descripcion: {
			bronze: 'Ayuda a 10 estudiantes diferentes',
			silver: 'Ayuda a 25 estudiantes diferentes',
			gold: 'Ayuda a 50 estudiantes diferentes',
		},
		icon: 'GraduationCap',
	},
	excelencia: {
		nombre: 'Excelencia Continua',
		descripcion: {
			bronze: 'Racha de 2 semanas',
			silver: 'Racha de 4 semanas',
			gold: 'Racha de 8 semanas',
		},
		icon: 'Flame',
	},
	especialista: {
		nombre: 'Especialista',
		descripcion: {
			bronze: 'Domina 2 materias',
			silver: 'Domina 4 materias',
			gold: 'Domina 6 materias',
		},
		icon: 'Trophy',
	},
	versatil: {
		nombre: 'Tutor Versátil',
		descripcion: {
			bronze: 'Imparte 3 materias diferentes',
			silver: 'Imparte 5 materias diferentes',
			gold: 'Imparte 8 materias diferentes',
		},
		icon: 'Sparkles',
	},
	comunicador: {
		nombre: 'Gran Comunicador',
		descripcion: {
			bronze: 'Responde en menos de 6 horas',
			silver: 'Responde en menos de 3 horas',
			gold: 'Responde en menos de 1 hora',
		},
		icon: 'MessageCircle',
	},
	impacto_positivo: {
		nombre: 'Impacto Positivo',
		descripcion: {
			bronze: 'Recibe 10 comentarios positivos',
			silver: 'Recibe 25 comentarios positivos',
			gold: 'Recibe 50 comentarios positivos',
		},
		icon: 'Heart',
	},
};
