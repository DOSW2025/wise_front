import apiClient from '../api/client';

/**
 * Interfaz para Forum
 */
export interface Forum {
	id: string;
	materiaId: string;
	title: string;
	description?: string;
	likes_count: number;
	views_count: number;
	creator_id?: string;
	closed: boolean;
	created_at: string;
	updated_at?: string;
	creator?: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
		avatar_url?: string;
	};
	threads?: Thread[];
	materia?: {
		id: string;
		codigo: string;
		nombre: string;
	};
}

/**
 * Interfaz para Thread (Hilo)
 */
export interface Thread {
	id: string;
	author_id: string;
	title: string;
	content: string;
	status: 'open' | 'closed' | 'archived';
	replies_count: number;
	views_count: number;
	likes_count: number;
	pinned: boolean;
	created_at: string;
	updated_at?: string;
	deleted_at?: string;
	forum_id?: string;
	author?: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
		avatar_url?: string;
	};
	responses?: Response[];
}

/**
 * Interfaz para Response (Respuesta)
 */
export interface Response {
	id: string;
	thread_id: string;
	author_id: string;
	content: string;
	is_accepted: boolean;
	created_at: string;
	updated_at?: string;
	deleted_at?: string;
	author?: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
		avatar_url?: string;
	};
}

/**
 * Interfaz para Materia
 */
export interface Materia {
	id: string;
	codigo: string;
	nombre: string;
}

/**
 * Clase para gestionar los servicios de Foros
 */
export class ForumsService {
	private forumsUrl = '/wise/forums';
	private threadsUrl = '/wise/threads';
	private responsesUrl = '/wise/responses';

	// ============ FORUMS ============

	/**
	 * Obtener todas las materias disponibles
	 */
	async getMaterias(): Promise<Materia[]> {
		try {
			const response = await apiClient.get<{
				status: string;
				materias: Materia[];
			}>(`${this.forumsUrl}/materias`);
			return response.data.materias;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener las materias');
		}
	}

	/**
	 * Crear un nuevo foro
	 */
	async createForum(
		title: string,
		materiaId: string,
		creatorId: string,
		description?: string,
	): Promise<Forum> {
		try {
			const response = await apiClient.post<{ status: string; forum: Forum }>(
				this.forumsUrl,
				{
					title,
					materiaId,
					creatorId,
					description,
				},
			);
			return response.data.forum;
		} catch (error) {
			throw this.handleError(error, 'Error al crear el foro');
		}
	}

	/**
	 * Obtener todos los foros
	 */
	async getAllForums(): Promise<Forum[]> {
		try {
			const response = await apiClient.get<{ status: string; forums: Forum[] }>(
				this.forumsUrl,
			);
			return response.data.forums;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener los foros');
		}
	}

	/**
	 * Obtener un foro por ID (incluye hilos)
	 */
	async getForumById(forumId: string): Promise<Forum> {
		try {
			const response = await apiClient.get<{ status: string; forum: Forum }>(
				`${this.forumsUrl}/${forumId}`,
			);
			return response.data.forum;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener el foro');
		}
	}

	/**
	 * Editar un foro
	 */
	async editForum(
		forumId: string,
		updates: {
			title?: string;
			description?: string;
		},
	): Promise<Forum> {
		try {
			const response = await apiClient.post<{ status: string; forum: Forum }>(
				`${this.forumsUrl}/${forumId}/edit`,
				updates,
			);
			return response.data.forum;
		} catch (error) {
			throw this.handleError(error, 'Error al editar el foro');
		}
	}

	/**
	 * Cerrar un foro
	 */
	async closeForum(forumId: string, editorId: string): Promise<Forum> {
		try {
			const response = await apiClient.post<{ status: string; forum: Forum }>(
				`${this.forumsUrl}/${forumId}/close`,
				{ editorId },
			);
			return response.data.forum;
		} catch (error) {
			throw this.handleError(error, 'Error al cerrar el foro');
		}
	}

	/**
	 * Reabrir un foro
	 */
	async reopenForum(forumId: string, editorId: string): Promise<Forum> {
		try {
			const response = await apiClient.post<{ status: string; forum: Forum }>(
				`${this.forumsUrl}/${forumId}/reopen`,
				{ editorId },
			);
			return response.data.forum;
		} catch (error) {
			throw this.handleError(error, 'Error al reabrir el foro');
		}
	}

	/**
	 * Dar like a un foro
	 */
	async likeForum(forumId: string): Promise<{ status: string; likes: number }> {
		try {
			const response = await apiClient.post<{ status: string; likes: number }>(
				`${this.forumsUrl}/${forumId}/like`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al dar like al foro');
		}
	}

	// ============ THREADS ============

	/**
	 * Crear un hilo en un foro
	 */
	async createThread(
		forumId: string,
		title: string,
		content: string,
		authorId: string,
	): Promise<Thread> {
		try {
			const response = await apiClient.post<{ status: string; thread: Thread }>(
				`${this.forumsUrl}/${forumId}/threads`,
				{
					title,
					content,
					authorId,
					forumId,
				},
			);
			return response.data.thread;
		} catch (error) {
			throw this.handleError(error, 'Error al crear el hilo');
		}
	}

	/**
	 * Obtener un hilo por ID
	 */
	async getThreadById(threadId: string): Promise<Thread> {
		try {
			const response = await apiClient.get<{ status: string; thread: Thread }>(
				`${this.threadsUrl}/${threadId}`,
			);
			return response.data.thread;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener el hilo');
		}
	}

	/**
	 * Editar un hilo
	 */
	async editThread(
		threadId: string,
		title?: string,
		content?: string,
	): Promise<Thread> {
		try {
			const response = await apiClient.post<{ status: string; thread: Thread }>(
				`${this.threadsUrl}/${threadId}/edit`,
				{
					title,
					content,
				},
			);
			return response.data.thread;
		} catch (error) {
			throw this.handleError(error, 'Error al editar el hilo');
		}
	}

	/**
	 * Dar like a un hilo
	 */
	async likeThread(
		threadId: string,
	): Promise<{ status: string; likes: number }> {
		try {
			const response = await apiClient.post<{ status: string; likes: number }>(
				`${this.threadsUrl}/${threadId}/like`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al dar like al hilo');
		}
	}

	// ============ RESPONSES ============

	/**
	 * Crear una respuesta a un hilo
	 */
	async createResponse(
		threadId: string,
		content: string,
		authorId: string,
	): Promise<Response> {
		try {
			const response = await apiClient.post<{
				status: string;
				response: Response;
			}>(this.responsesUrl, {
				thread_id: threadId,
				content,
				author_id: authorId,
			});
			return response.data.response;
		} catch (error) {
			throw this.handleError(error, 'Error al crear la respuesta');
		}
	}

	/**
	 * Obtener todas las respuestas
	 */
	async getAllResponses(): Promise<Response[]> {
		try {
			const response = await apiClient.get<{
				status: string;
				responses: Response[];
			}>(this.responsesUrl);
			return response.data.responses;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener las respuestas');
		}
	}

	/**
	 * Obtener una respuesta por ID
	 */
	async getResponseById(responseId: string): Promise<Response> {
		try {
			const response = await apiClient.get<{
				status: string;
				response: Response;
			}>(`${this.responsesUrl}/${responseId}`);
			return response.data.response;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener la respuesta');
		}
	}

	/**
	 * Votar una respuesta
	 */
	async voteResponse(
		responseId: string,
		vote: 1 | -1,
	): Promise<{ status: string; votes: any }> {
		try {
			const response = await apiClient.post<{ status: string; votes: any }>(
				`${this.responsesUrl}/${responseId}/vote`,
				{ vote },
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al votar la respuesta');
		}
	}

	/**
	 * Obtener votos de una respuesta
	 */
	async getResponseVotes(responseId: string): Promise<any> {
		try {
			const response = await apiClient.get<any>(
				`${this.responsesUrl}/${responseId}/votes`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener los votos');
		}
	}

	/**
	 * Manejo de errores
	 */
	private handleError(error: any, defaultMessage: string): Error {
		if (error.response?.data?.message) {
			return new Error(error.response.data.message);
		}
		if (error.message) {
			return new Error(error.message);
		}
		return new Error(defaultMessage);
	}
}

// Crear instancia única del servicio
export const forumsService = new ForumsService();
