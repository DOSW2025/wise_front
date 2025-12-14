import type {
	MonthlyStats,
	SessionMetrics,
	StudentFeedback,
	SubjectExpertise,
	TutorPerformanceMetrics,
} from '~/lib/types/tutor-performance.types';

// Mock tutor performance data
export const mockTutorPerformance: TutorPerformanceMetrics = {
	tutorId: 'tutor-001',
	totalSessions: 45,
	totalStudents: 28,
	averageRating: 4.7,
	totalHours: 67.5,
	completionRate: 94,
	responseTime: 2.5,
	periodStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
	periodEnd: new Date().toISOString(),
};

// Mock recent sessions
export const mockRecentSessions: SessionMetrics[] = [
	{
		sessionId: 'session-001',
		studentName: 'Ana Martínez',
		subject: 'JavaScript Avanzado',
		date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 90,
		rating: 5,
		attended: true,
		feedback: 'Excelente explicación, muy clara y práctica',
	},
	{
		sessionId: 'session-002',
		studentName: 'Carlos Ruiz',
		subject: 'React Hooks',
		date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 60,
		rating: 5,
		attended: true,
		feedback: 'Gran apoyo, resolvió todas mis dudas',
	},
	{
		sessionId: 'session-003',
		studentName: 'Laura Pérez',
		subject: 'Node.js y Express',
		date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 75,
		rating: 4,
		attended: true,
	},
	{
		sessionId: 'session-004',
		studentName: 'Diego Torres',
		subject: 'TypeScript',
		date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 90,
		rating: 5,
		attended: true,
		feedback: 'Muy profesional y paciente',
	},
	{
		sessionId: 'session-005',
		studentName: 'Sofia Gómez',
		subject: 'Bases de Datos',
		date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 60,
		rating: 4,
		attended: false,
	},
];

// Mock monthly statistics
export const mockMonthlyStats: MonthlyStats[] = [
	{
		month: 'Septiembre',
		sessions: 12,
		students: 8,
		averageRating: 4.6,
		totalHours: 18,
	},
	{
		month: 'Octubre',
		sessions: 16,
		students: 12,
		averageRating: 4.8,
		totalHours: 24,
	},
	{
		month: 'Noviembre',
		sessions: 17,
		students: 14,
		averageRating: 4.7,
		totalHours: 25.5,
	},
];

// Mock subject expertise
export const mockSubjectExpertise: SubjectExpertise[] = [
	{
		subject: 'JavaScript Avanzado',
		sessionCount: 15,
		averageRating: 4.8,
		totalHours: 22.5,
	},
	{
		subject: 'React y Hooks',
		sessionCount: 12,
		averageRating: 4.7,
		totalHours: 18,
	},
	{
		subject: 'Node.js y Express',
		sessionCount: 10,
		averageRating: 4.6,
		totalHours: 15,
	},
	{
		subject: 'TypeScript',
		sessionCount: 8,
		averageRating: 4.9,
		totalHours: 12,
	},
];

// Mock student feedback
export const mockStudentFeedback: StudentFeedback[] = [
	{
		id: 'feedback-001',
		studentName: 'Ana Martínez',
		date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		rating: 5,
		comment:
			'Excelente explicación, muy clara y práctica. Me ayudó a entender conceptos complejos de forma sencilla.',
		subject: 'JavaScript Avanzado',
	},
	{
		id: 'feedback-002',
		studentName: 'Carlos Ruiz',
		date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		rating: 5,
		comment: 'Gran apoyo, resolvió todas mis dudas con mucha paciencia.',
		subject: 'React Hooks',
	},
	{
		id: 'feedback-003',
		studentName: 'Diego Torres',
		date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		rating: 5,
		comment: 'Muy profesional y paciente. Excelente metodología de enseñanza.',
		subject: 'TypeScript',
	},
	{
		id: 'feedback-004',
		studentName: 'María López',
		date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
		rating: 4,
		comment: 'Buena sesión, me gustaría más ejemplos prácticos.',
		subject: 'Node.js',
	},
];
