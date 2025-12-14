import apiClient from '../api/client';

/**
 * Enums para tipos de contenido y motivos de reporte
 */
export enum TipoContenido {
	THREAD = 'THREAD',
	RESPONSE = 'RESPONSE',
	MENSAJE_CHAT = 'MENSAJE_CHAT',
}

export enum MotivoReporte {
	SPAM = 'SPAM',
	LENGUAJE_OFENSIVO = 'LENGUAJE_OFENSIVO',
	ACOSO = 'ACOSO',
	CONTENIDO_INAPROPIADO = 'CONTENIDO_INAPROPIADO',
	INCUMPLIMIENTO_NORMAS = 'INCUMPLIMIENTO_NORMAS',
	FRAUDE_ACADEMICO = 'FRAUDE_ACADEMICO',
	OTRO = 'OTRO',
}

export enum EstadoReporte {
	PENDIENTE = 'PENDIENTE',
	EN_REVISION = 'EN_REVISION',
	APROBADO = 'APROBADO',
	RECHAZADO = 'RECHAZADO',
	RESUELTO = 'RESUELTO',
}

/**
 * Interfaz para el reporte
 */
export interface Reporte {
	id: string;
	contenido_id: string;
	tipo_contenido: TipoContenido;
	usuario_reporta_id: string;
	motivo: MotivoReporte;
	descripcion?: string;
	estado: EstadoReporte;
	fecha_reporte: string;
	fecha_revision?: string;
	revisado_por?: string;
	notas_moderacion?: string;
	created_at: string;
	updated_at: string;
	usuario_reporta?: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
	};
}

/**
 * DTO para crear un reporte
 */
export interface CreateReportDto {
	contenido_id: string;
	tipo_contenido: TipoContenido;
	motivo: MotivoReporte;
	descripcion?: string;
}

/**
 * DTO para actualizar estado de un reporte
 */
export interface UpdateReportStatusDto {
	estado: EstadoReporte;
	notas_moderacion?: string;
}

/**
 * Estadísticas de reportes
 */
export interface ReportStatistics {
	total: number;
	por_estado: {
		pendientes: number;
		en_revision: number;
		aprobados: number;
		rechazados: number;
		resueltos: number;
	};
	por_tipo_contenido: Array<{
		tipo_contenido: TipoContenido;
		_count: number;
	}>;
	por_motivo: Array<{
		motivo: MotivoReporte;
		_count: number;
	}>;
}

/**
 * Mapeo de razones del frontend a enums del backend
 */
export const mapFrontendReasonToBackend = (reason: string): MotivoReporte => {
	const mapping: Record<string, MotivoReporte> = {
		harassment: MotivoReporte.ACOSO,
		inappropriate: MotivoReporte.CONTENIDO_INAPROPIADO,
		spam: MotivoReporte.SPAM,
		offensive: MotivoReporte.LENGUAJE_OFENSIVO,
		scam: MotivoReporte.FRAUDE_ACADEMICO,
		impersonation: MotivoReporte.INCUMPLIMIENTO_NORMAS,
		other: MotivoReporte.OTRO,
	};
	return mapping[reason] || MotivoReporte.OTRO;
};

/**
 * Clase para gestionar los servicios de Reportes
 */
export class ReportesService {
	private readonly baseUrl = '/wise/reportes';

	/**
	 * Crear un nuevo reporte de contenido
	 */
	async createReport(data: CreateReportDto): Promise<Reporte> {
		try {
			const response = await apiClient.post<{
				success: boolean;
				message: string;
				data: Reporte;
			}>(this.baseUrl, data);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error, 'Error al crear el reporte');
		}
	}

	/**
	 * Obtener todos los reportes (solo ADMIN)
	 */
	async getAllReports(filters?: {
		estado?: EstadoReporte;
		tipoContenido?: TipoContenido;
	}): Promise<Reporte[]> {
		try {
			const params = new URLSearchParams();
			if (filters?.estado) params.append('estado', filters.estado);
			if (filters?.tipoContenido)
				params.append('tipoContenido', filters.tipoContenido);

			const url = params.toString()
				? `${this.baseUrl}?${params.toString()}`
				: this.baseUrl;

			const response = await apiClient.get<{
				success: boolean;
				data: Reporte[];
				count: number;
			}>(url);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener los reportes');
		}
	}

	/**
	 * Obtener estadísticas de reportes (solo ADMIN)
	 */
	async getStatistics(): Promise<ReportStatistics> {
		try {
			const response = await apiClient.get<{
				success: boolean;
				data: ReportStatistics;
			}>(`${this.baseUrl}/estadisticas`);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener las estadísticas');
		}
	}

	/**
	 * Obtener mis reportes (usuario autenticado)
	 */
	async getMyReports(): Promise<Reporte[]> {
		try {
			const response = await apiClient.get<{
				success: boolean;
				data: Reporte[];
				count: number;
			}>(`${this.baseUrl}/mis-reportes`);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener tus reportes');
		}
	}

	/**
	 * Obtener un reporte por ID (solo ADMIN)
	 */
	async getReportById(reporteId: string): Promise<Reporte> {
		try {
			const response = await apiClient.get<{
				success: boolean;
				data: Reporte;
			}>(`${this.baseUrl}/${reporteId}`);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener el reporte');
		}
	}

	/**
	 * Actualizar estado de un reporte (solo ADMIN)
	 */
	async updateReportStatus(
		reporteId: string,
		data: UpdateReportStatusDto,
	): Promise<Reporte> {
		try {
			const response = await apiClient.patch<{
				success: boolean;
				message: string;
				data: Reporte;
			}>(`${this.baseUrl}/${reporteId}/estado`, data);
			return response.data.data;
		} catch (error) {
			throw this.handleError(
				error,
				'Error al actualizar el estado del reporte',
			);
		}
	}

	/**
	 * Manejo de errores
	 */
	private handleError(error: unknown, defaultMessage: string): Error {
		if (
			error &&
			typeof error === 'object' &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			'data' in error.response &&
			error.response.data &&
			typeof error.response.data === 'object' &&
			'message' in error.response.data
		) {
			return new Error(String(error.response.data.message));
		}
		if (error instanceof Error) {
			return new Error(error.message);
		}
		return new Error(defaultMessage);
	}
}

// Crear instancia única del servicio
export const reportesService = new ReportesService();
