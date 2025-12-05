import type {
	ActivityEvent,
	Badge,
	CategoryProgress,
	Challenge,
	LeaderboardEntry,
	UserGamification,
} from '~/lib/types/gamification.types';

// Mock user gamification data
export const mockUserGamification: UserGamification = {
	userId: 'user-123',
	xpTotal: 1250,
	xpSemanal: 280,
	nivel: 'Colaborador',
	rachaSemanas: 3,
	ultimaActividadAt: new Date().toISOString(),
	badges: [
		{
			id: 'badge-1',
			code: 'explorador',
			nombre: 'Explorador',
			descripcion: 'Completa 5 materiales',
			tier: 'bronze',
			earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			icon: '🗺️',
		},
		{
			id: 'badge-2',
			code: 'constante',
			nombre: 'Constante',
			descripcion: 'Racha de 2 semanas',
			tier: 'bronze',
			earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			icon: '🔥',
		},
		{
			id: 'badge-3',
			code: 'respuesta_util',
			nombre: 'Respuesta Útil',
			descripcion: '1 respuesta aceptada',
			tier: 'bronze',
			earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
			icon: '💡',
		},
		{
			id: 'badge-4',
			code: 'comunidad_activa',
			nombre: 'Comunidad Activa',
			descripcion: 'Asiste a 2 eventos',
			tier: 'bronze',
			earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			icon: '🌟',
		},
	],
	metaSemanalObjetivo: 350,
	metaSemanalProgreso: 280,
};

// Mock challenges
export const mockChallenges: Challenge[] = [
	{
		id: 'challenge-1',
		titulo: 'Maestro del Backend',
		descripcion: 'Completa 3 materiales de Backend esta semana',
		periodo: {
			inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			fin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		},
		objetivos: [
			{ descripcion: 'Completar material de Node.js', completado: true },
			{ descripcion: 'Completar material de Express', completado: true },
			{
				descripcion: 'Completar material de Bases de Datos',
				completado: false,
			},
		],
		recompensaXP: 50,
		estadoUsuario: 'en_progreso',
		progreso: 66,
		icon: '⚙️',
	},
	{
		id: 'challenge-2',
		titulo: 'Aprendiz Activo',
		descripcion: 'Asiste a 1 tutoría y deja feedback',
		periodo: {
			inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			fin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		},
		objetivos: [
			{ descripcion: 'Asistir a una tutoría', completado: true },
			{ descripcion: 'Dejar feedback', completado: true },
		],
		recompensaXP: 60,
		estadoUsuario: 'listo_reclamar',
		progreso: 100,
		icon: '📖',
	},
	{
		id: 'challenge-3',
		titulo: 'Colaborador Estrella',
		descripcion: 'Comparte 1 recurso útil aprobado',
		periodo: {
			inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			fin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		},
		objetivos: [
			{ descripcion: 'Compartir un recurso', completado: false },
			{ descripcion: 'Obtener aprobación', completado: false },
		],
		recompensaXP: 50,
		estadoUsuario: 'no_iniciado',
		progreso: 0,
		icon: '🎁',
	},
];

// Mock leaderboard entries
export const mockLeaderboardGlobal: LeaderboardEntry[] = [
	{
		rank: 1,
		userAlias: 'CodeMaster',
		userId: 'user-001',
		xpPeriodo: 5200,
		badges: 12,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 2,
		userAlias: 'DevNinja',
		userId: 'user-002',
		xpPeriodo: 4800,
		badges: 10,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 3,
		userAlias: 'TechGuru',
		userId: 'user-003',
		xpPeriodo: 3900,
		badges: 9,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 4,
		userAlias: 'María García',
		userId: 'user-123',
		xpPeriodo: 1250,
		badges: 4,
		avatarUrl: undefined,
		isCurrentUser: true,
	},
	{
		rank: 5,
		userAlias: 'WebWizard',
		userId: 'user-005',
		xpPeriodo: 1100,
		badges: 3,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
];

export const mockLeaderboard30d: LeaderboardEntry[] = [
	{
		rank: 1,
		userAlias: 'DevNinja',
		userId: 'user-002',
		xpPeriodo: 890,
		badges: 10,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 2,
		userAlias: 'TechGuru',
		userId: 'user-003',
		xpPeriodo: 720,
		badges: 9,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 3,
		userAlias: 'CodeMaster',
		userId: 'user-001',
		xpPeriodo: 650,
		badges: 12,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 4,
		userAlias: 'WebWizard',
		userId: 'user-005',
		xpPeriodo: 580,
		badges: 3,
		avatarUrl: undefined,
		isCurrentUser: false,
	},
	{
		rank: 5,
		userAlias: 'María García',
		userId: 'user-123',
		xpPeriodo: 450,
		badges: 4,
		avatarUrl: undefined,
		isCurrentUser: true,
	},
];

// Mock category progress
export const mockCategoryProgress: CategoryProgress[] = [
	{
		categoryId: 'cat-1',
		categoryName: 'Frontend Development',
		totalMaterials: 20,
		completedMaterials: 12,
		percentage: 60,
	},
	{
		categoryId: 'cat-2',
		categoryName: 'Backend Development',
		totalMaterials: 15,
		completedMaterials: 8,
		percentage: 53,
	},
	{
		categoryId: 'cat-3',
		categoryName: 'Bases de Datos',
		totalMaterials: 10,
		completedMaterials: 5,
		percentage: 50,
	},
	{
		categoryId: 'cat-4',
		categoryName: 'DevOps',
		totalMaterials: 12,
		completedMaterials: 3,
		percentage: 25,
	},
];

// Mock activity events
export const mockActivityEvents: ActivityEvent[] = [
	{
		id: 'event-1',
		userId: 'user-123',
		tipo: 'MATERIAL_COMPLETED',
		actividadId: 'material-001',
		occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 48,
		metadata: { longitudMaterial: 'media' },
	},
	{
		id: 'event-2',
		userId: 'user-123',
		tipo: 'TUTORING_ATTENDED',
		actividadId: 'tutoring-001',
		occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 70,
		metadata: { feedback: true },
	},
	{
		id: 'event-3',
		userId: 'user-123',
		tipo: 'ANSWER_ACCEPTED',
		actividadId: 'answer-001',
		occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 80,
	},
	{
		id: 'event-4',
		userId: 'user-123',
		tipo: 'EVENT_ATTENDED',
		actividadId: 'event-001',
		occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 30,
	},
	{
		id: 'event-5',
		userId: 'user-123',
		tipo: 'COMMENT_HELPFUL',
		actividadId: 'comment-001',
		occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 10,
	},
	{
		id: 'event-6',
		userId: 'user-123',
		tipo: 'MATERIAL_COMPLETED',
		actividadId: 'material-002',
		occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		pointsAwarded: 40,
		metadata: { longitudMaterial: 'corta' },
	},
];
