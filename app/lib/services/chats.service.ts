import apiClient from '../api/client';

/**
 * Interfaz para Grupo de Chat
 */
export interface ChatGroup {
	id: string;
	nombre: string;
	creadoPor: string;
	fechaCreacion: string;
	fechaActualizacion: string;
	miembros?: ChatMember[];
	mensajes?: ChatMessage[];
}

/**
 * Interfaz para Miembro del Grupo
 */
export interface ChatMember {
	id: string;
	grupoId: string;
	usuarioId: string;
	fechaUnion: string;
	usuario?: {
		id: string;
		nombre: string;
		apellido: string;
		avatar_url?: string;
		email: string;
	};
}

/**
 * Interfaz para Mensaje de Chat
 */
export interface ChatMessage {
	id: string;
	grupoId: string;
	usuarioId: string;
	contenido: string;
	fechaCreacion: string;
	fechaEdicion?: string;
	usuario?: {
		id: string;
		nombre: string;
		apellido: string;
		avatar_url?: string;
	};
}

/**
 * Clase para gestionar los servicios de Chat
 */
export class ChatsService {
	private baseUrl = '/wise/chats';

	/**
	 * Crear un nuevo grupo de chat
	 */
	async createGroup(nombre: string, emails: string[]): Promise<ChatGroup> {
		try {
			const response = await apiClient.post<ChatGroup>(this.baseUrl, {
				nombre,
				emails,
			});
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al crear el grupo de chat');
		}
	}

	/**
	 * Obtener todos los grupos de chat del usuario
	 */
	async getAllGroups(): Promise<ChatGroup[]> {
		try {
			const response = await apiClient.get<ChatGroup[]>(this.baseUrl);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener los grupos de chat');
		}
	}

	/**
	 * Obtener un grupo de chat por ID
	 */
	async getGroupById(groupId: string): Promise<ChatGroup> {
		try {
			const response = await apiClient.get<ChatGroup>(
				`${this.baseUrl}/${groupId}`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener el grupo de chat');
		}
	}

	/**
	 * Obtener los mensajes de un grupo
	 */
	async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
		try {
			const response = await apiClient.get<ChatMessage[]>(
				`${this.baseUrl}/${groupId}/messages`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al obtener los mensajes');
		}
	}

	/**
	 * Enviar un mensaje a un grupo
	 */
	async sendMessage(groupId: string, contenido: string): Promise<ChatMessage> {
		try {
			const response = await apiClient.post<ChatMessage>(
				`${this.baseUrl}/${groupId}/messages`,
				{ contenido },
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al enviar el mensaje');
		}
	}

	/**
	 * Eliminar un grupo de chat
	 */
	async deleteGroup(groupId: string): Promise<{ message: string }> {
		try {
			const response = await apiClient.delete<{ message: string }>(
				`${this.baseUrl}/${groupId}`,
			);
			return response.data;
		} catch (error) {
			throw this.handleError(error, 'Error al eliminar el grupo');
		}
	}

	/**
	 * Manejo de errores
	 */
	private handleError(error: unknown, defaultMessage: string): Error {
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
export const chatsService = new ChatsService();
