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
	modalidad: 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDA';
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
