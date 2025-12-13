/**
 * Tutoria Types
 * Tipos TypeScript para el microservicio de tutorías
 */

/**
 * Disponibilidad por día de la semana
 */
export interface DisponibilidadSlot {
	start: string; // Formato: "HH:mm"
	end: string; // Formato: "HH:mm"
	modalidad: 'VIRTUAL' | 'PRESENCIAL';
	lugar: string; // URL para virtual o ubicación física
}

/**
 * Disponibilidad semanal del tutor
 */
export interface DisponibilidadSemanal {
	monday: DisponibilidadSlot[];
	tuesday: DisponibilidadSlot[];
	wednesday: DisponibilidadSlot[];
	thursday: DisponibilidadSlot[];
	friday: DisponibilidadSlot[];
	saturday: DisponibilidadSlot[];
	sunday: DisponibilidadSlot[];
}

/**
 * Rol del usuario
 */
export interface Rol {
	id: number;
	nombre: string;
	activo: boolean;
}

/**
 * Estado del usuario
 */
export interface Estado {
	id: number;
	nombre: string;
	activo: boolean;
}

/**
 * Perfil de tutoría con calificaciones
 */
export interface TutorProfileData {
	usuarioId: string;
	bio: string;
	reputacion: number;
	tutorMaterias: TutorMateria[];
	calificacion: number; // Promedio de calificaciones (1-5)
	comentarios: number; // Cantidad total de calificaciones
}

/**
 * Perfil completo del tutor
 */
export interface TutorProfile {
	id: string;
	email: string;
	nombre: string;
	apellido: string;
	semestre: number;
	rolId: number;
	estadoId: number;
	disponibilidad: DisponibilidadSemanal;
	created_at: string;
	updated_at: string;
	rol: Rol;
	estado: Estado;
	tutorProfile?: TutorProfileData; // Datos del perfil de tutoría (anidado)
	calificacion?: number; // También puede venir en el nivel superior (retrocompatibilidad)
	comentarios?: number; // También puede venir en el nivel superior (retrocompatibilidad)
}

/**
 * Estado de una sesión de tutoría
 */
export type SessionStatus =
	| 'PENDIENTE'
	| 'CONFIRMADA'
	| 'CANCELADA'
	| 'COMPLETADA';

/**
 * Modo de una sesión de tutoría
 */
export type SessionMode = 'VIRTUAL' | 'PRESENCIAL';

/**
 * Día de la semana en inglés
 */
export type WeekDay =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

/**
 * Sesión de tutoría del estudiante (respuesta del backend)
 */
export interface StudentSession {
	id: string;
	tutorId: string;
	studentId: string;
	materiaId: string;
	codigoMateria: string;
	scheduledAt: string;
	day: WeekDay;
	startTime: string;
	endTime: string;
	mode: SessionMode;
	status: SessionStatus;
	linkConexion: string | null;
	lugar: string | null;
	comentarios: string | null;
	createdAt: string;
	rated?: boolean; // Indica si el estudiante ya calificó la sesión
}

/**
 * Respuesta del endpoint de nombre del tutor
 */
export interface TutorNameResponse {
	nombreCompleto: string;
}

/**
 * Respuesta del endpoint de materia
 */
export interface MateriaResponse {
	id: string;
	codigo: string;
	nombre: string;
	temas: string[];
}

/**
 * Materia que puede dictar un tutor
 */
export interface TutorMateria {
	codigo: string;
	nombre: string;
}

/**
 * Respuesta del endpoint de materias de un tutor
 */
export interface TutorMateriasResponse {
	nombreTutor: string;
	materias: TutorMateria[];
}

/**
 * Request para crear una sesión de tutoría
 */
export interface CreateSessionRequest {
	tutorId: string;
	studentId: string;
	codigoMateria: string;
	scheduledAt: string;
	day: WeekDay;
	startTime: string;
	endTime: string;
	mode: SessionMode;
	comentarios?: string;
}

/**
 * Respuesta al crear una sesión de tutoría
 */
export interface CreateSessionResponse extends StudentSession {}

/**
 * Sesión de tutoría próxima (upcoming)
 */
export interface UpcomingSession {
	tutorName: string;
	studentName: string;
	subjectName: string;
	date: string; // ISO 8601 format
	day: WeekDay;
	startTime: string; // Formato: "HH:mm"
}

/**
 * Respuesta del endpoint de upcoming sessions
 */
export type UpcomingSessionsResponse = UpcomingSession[];

/**
 * Estadísticas de tutorías de un estudiante
 */
export interface TutoriaStats {
	totalSesiones: number;
	sesionesPendientes: number;
	sesionesConfirmadas: number;
	sesionesCompletadas: number;
	sesionesCanceladas: number;
	sesionesRechazadas: number;
	totalCalificaciones: number;
	horasDeTutoria: number;
}

/**
 * Request para cancelar una sesión de tutoría
 */
export interface CancelSessionRequest {
	userId: string;
	razon: string;
}

/**
 * Respuesta al cancelar una sesión de tutoría
 */
export interface CancelSessionResponse {
	message: string;
	session: StudentSession;
}

/**
 * Sesión pendiente de confirmación (para tutor)
 */
export interface PendingSession {
	sessionId: string;
	studentName: string;
	subjectCode: string;
	subjectName: string;
	scheduledAt: string; // ISO 8601 format
	day: WeekDay;
	startTime: string; // Formato: "HH:mm"
	endTime: string; // Formato: "HH:mm"
	mode: 'VIRTUAL' | 'PRESENCIAL';
	comentarios: string | null;
	createdAt: string; // ISO 8601 format
}

/**
 * Respuesta del endpoint de pending sessions
 */
export type PendingSessionsResponse = PendingSession[];

/**
 * Sesión confirmada (para tutor)
 */
export interface ConfirmedSession {
	sessionId: string;
	studentName: string;
	subjectCode: string;
	subjectName: string;
	scheduledAt: string; // ISO 8601 format
	day: WeekDay;
	startTime: string; // Formato: "HH:mm"
	endTime: string; // Formato: "HH:mm"
	mode: 'VIRTUAL' | 'PRESENCIAL';
	comentarios: string | null;
	linkConexion: string | null;
	lugar: string | null;
	createdAt: string; // ISO 8601 format
}

/**
 * Respuesta del endpoint de confirmed sessions
 */
export type ConfirmedSessionsResponse = ConfirmedSession[];

/**
 * Request para completar una sesión de tutoría
 */
export interface CompleteSessionRequest {
	tutorId: string;
	comentarios?: string;
}

/**
 * Respuesta al completar una sesión de tutoría
 */
export interface CompleteSessionResponse {
	message: string;
	session: StudentSession;
}

/**
 * Reputación del tutor
 */
export interface TutorReputacion {
	tutorId: string;
	nombreTutor: string;
	reputacion: number; // Calificación promedio (1-5)
	totalRatings: number; // Cantidad total de calificaciones
}
