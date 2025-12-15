import { io, type Socket } from 'socket.io-client';
import { authService } from '../api/auth';

export interface WebSocketMessage {
	id: string;
	grupoId: string;
	contenido: string;
	fechaCreacion: string;
	usuario: {
		id: string;
		nombre: string;
		apellido: string;
		email: string;
		avatar_url?: string;
	};
}

export interface TypingEvent {
	userId: string;
	email: string;
}

export interface UserJoinedEvent {
	userId: string;
	email: string;
	message: string;
	timestamp: Date;
}

export class WebSocketService {
	private socket: Socket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;

	private connect() {
		const token = authService.getToken();
		if (!token) {
			console.warn('[WebSocket] No token available, skipping connection');
			return;
		}

		// Obtener URL base y eliminar barra final si existe
		let wsUrl = import.meta.env.VITE_WS_COMUNIDAD_URL;
		if (!wsUrl) {
			console.error('[WebSocket] VITE_WS_COMUNIDAD_URL is not defined in .env');
			return;
		}
		wsUrl = wsUrl.replace(/\/$/, ''); // Eliminar barra final

		console.log('[WebSocket] Connecting to:', `${wsUrl}/chat`);

		this.socket = io(`${wsUrl}/chat`, {
			transports: ['websocket', 'polling'],
			auth: {
				token,
			},
			reconnection: true,
			reconnectionAttempts: this.maxReconnectAttempts,
			reconnectionDelay: this.reconnectDelay,
		});

		this.setupEventListeners();
	}

	private setupEventListeners() {
		if (!this.socket) return;

		this.socket.on('connect', () => {
			console.log('[WebSocket] Connected successfully');
			this.reconnectAttempts = 0;
		});

		this.socket.on('disconnect', (reason) => {
			console.log('[WebSocket] Disconnected:', reason);
		});

		this.socket.on('connect_error', (error) => {
			console.error('[WebSocket] Connection error:', error.message);
			this.reconnectAttempts++;

			if (this.reconnectAttempts >= this.maxReconnectAttempts) {
				console.error(
					'[WebSocket] Max reconnection attempts reached. Stopping reconnection.',
				);
				this.socket?.disconnect();
			}
		});

		this.socket.on('error', (error) => {
			console.error('[WebSocket] Error:', error);
		});
	}

	joinGroup(grupoId: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.socket || !this.socket.connected) {
				console.error('[WebSocket] Cannot join group: Socket not connected');
				reject(new Error('Socket not connected'));
				return;
			}

			console.log('[WebSocket] Joining group:', grupoId);

			this.socket.emit('joinGroup', { grupoId }, (response: any) => {
				if (response?.success) {
					console.log('[WebSocket] Successfully joined group:', grupoId);
					resolve(response);
				} else {
					console.error('[WebSocket] Failed to join group:', response?.message);
					reject(new Error(response?.message || 'Failed to join group'));
				}
			});
		});
	}

	leaveGroup(grupoId: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.socket) {
				reject(new Error('Socket not connected'));
				return;
			}

			console.log('[WebSocket] Leaving group:', grupoId);

			this.socket.emit('leaveGroup', { grupoId }, (response: any) => {
				if (response?.success) {
					console.log('[WebSocket] Successfully left group:', grupoId);
					resolve(response);
				} else {
					console.error(
						'[WebSocket] Failed to leave group:',
						response?.message,
					);
					reject(new Error(response?.message || 'Failed to leave group'));
				}
			});
		});
	}

	sendMessage(grupoId: string, contenido: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.socket || !this.socket.connected) {
				console.error('[WebSocket] Cannot send message: Socket not connected');
				reject(new Error('Socket not connected'));
				return;
			}

			console.log('[WebSocket] Sending message to group:', grupoId);

			this.socket.emit(
				'sendMessage',
				{ grupoId, contenido },
				(response: any) => {
					if (response?.success) {
						console.log('[WebSocket] Message sent successfully');
						resolve(response);
					} else {
						console.error(
							'[WebSocket] Failed to send message:',
							response?.message,
						);
						reject(new Error(response?.message || 'Failed to send message'));
					}
				},
			);
		});
	}

	sendTyping(grupoId: string) {
		if (!this.socket || !this.socket.connected) return;
		this.socket.emit('typing', { grupoId });
	}

	sendStopTyping(grupoId: string) {
		if (!this.socket || !this.socket.connected) return;
		this.socket.emit('stopTyping', { grupoId });
	}

	onNewMessage(callback: (message: WebSocketMessage) => void) {
		if (!this.socket) return () => {};

		this.socket.on('newMessage', callback);

		return () => {
			this.socket?.off('newMessage', callback);
		};
	}

	onUserTyping(callback: (data: TypingEvent) => void) {
		if (!this.socket) return () => {};

		this.socket.on('userTyping', callback);

		return () => {
			this.socket?.off('userTyping', callback);
		};
	}

	onUserStoppedTyping(callback: (data: { userId: string }) => void) {
		if (!this.socket) return () => {};

		this.socket.on('userStoppedTyping', callback);

		return () => {
			this.socket?.off('userStoppedTyping', callback);
		};
	}

	onUserJoined(callback: (data: UserJoinedEvent) => void) {
		if (!this.socket) return () => {};

		this.socket.on('userJoined', callback);

		return () => {
			this.socket?.off('userJoined', callback);
		};
	}

	onUserLeft(callback: (data: UserJoinedEvent) => void) {
		if (!this.socket) return () => {};

		this.socket.on('userLeft', callback);

		return () => {
			this.socket?.off('userLeft', callback);
		};
	}

	isConnected(): boolean {
		// Iniciar conexión si aún no está iniciada
		if (!this.socket) {
			this.connect();
		}
		return this.socket?.connected || false;
	}

	disconnect() {
		if (this.socket) {
			console.log('[WebSocket] Disconnecting...');
			this.socket.disconnect();
			this.socket = null;
		}
	}

	reconnect() {
		this.disconnect();
		this.connect();
	}
}

export const websocketService = new WebSocketService();
