export interface TutorPerformanceMetrics {
	tutorId: string;
	totalSessions: number;
	totalStudents: number;
	averageRating: number;
	totalHours: number;
	completionRate: number;
	responseTime: number; // in hours
	periodStart: string;
	periodEnd: string;
}

export interface SessionMetrics {
	sessionId: string;
	studentName: string;
	subject: string;
	date: string;
	duration: number; // in minutes
	rating: number;
	attended: boolean;
	feedback?: string;
}

export interface MonthlyStats {
	month: string;
	sessions: number;
	students: number;
	averageRating: number;
	totalHours: number;
}

export interface SubjectExpertise {
	subject: string;
	sessionCount: number;
	averageRating: number;
	totalHours: number;
}

export interface StudentFeedback {
	id: string;
	studentName: string;
	date: string;
	rating: number;
	comment: string;
	subject: string;
}
