import { useCallback, useEffect, useRef, useState } from 'react';
import {
	type TypingEvent,
	type UserJoinedEvent,
	type WebSocketMessage,
	websocketService,
} from '../services/websocket.service';

export function useWebSocket(groupId?: string) {
	const [isConnected, setIsConnected] = useState(false);
	const [usersTyping, setUsersTyping] = useState<Set<string>>(new Set());
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
	const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

	const checkConnection = useCallback(() => {
		const connected = websocketService.isConnected();
		setIsConnected(connected);
		return connected;
	}, []);

	useEffect(() => {
		const interval = setInterval(checkConnection, 1000);
		checkConnection();

		return () => clearInterval(interval);
	}, [checkConnection]);

	useEffect(() => {
		if (!groupId || !isConnected) return;

		console.log('[useWebSocket] Joining group:', groupId);
		websocketService
			.joinGroup(groupId)
			.then(() => {
				console.log('[useWebSocket] Successfully joined group');
			})
			.catch((error) => {
				console.error('[useWebSocket] Error joining group:', error);
			});

		return () => {
			console.log('[useWebSocket] Leaving group:', groupId);
			websocketService.leaveGroup(groupId).catch((error) => {
				console.error('[useWebSocket] Error leaving group:', error);
			});
		};
	}, [groupId, isConnected]);

	const onNewMessage = useCallback(
		(callback: (message: WebSocketMessage) => void) => {
			return websocketService.onNewMessage(callback);
		},
		[],
	);

	const onUserTyping = useCallback((callback: (data: TypingEvent) => void) => {
		const wrappedCallback = (data: TypingEvent) => {
			setUsersTyping((prev) => {
				const newSet = new Set(prev);
				newSet.add(data.userId);
				return newSet;
			});

			const existingTimeout = typingTimeoutRef.current.get(data.userId);
			if (existingTimeout) {
				clearTimeout(existingTimeout);
			}

			const timeout = setTimeout(() => {
				setUsersTyping((prev) => {
					const newSet = new Set(prev);
					newSet.delete(data.userId);
					return newSet;
				});
				typingTimeoutRef.current.delete(data.userId);
			}, 3000);

			typingTimeoutRef.current.set(data.userId, timeout);

			callback(data);
		};

		return websocketService.onUserTyping(wrappedCallback);
	}, []);

	const onUserStoppedTyping = useCallback(
		(callback: (data: { userId: string }) => void) => {
			const wrappedCallback = (data: { userId: string }) => {
				setUsersTyping((prev) => {
					const newSet = new Set(prev);
					newSet.delete(data.userId);
					return newSet;
				});

				const existingTimeout = typingTimeoutRef.current.get(data.userId);
				if (existingTimeout) {
					clearTimeout(existingTimeout);
					typingTimeoutRef.current.delete(data.userId);
				}

				callback(data);
			};

			return websocketService.onUserStoppedTyping(wrappedCallback);
		},
		[],
	);

	const onUserJoined = useCallback(
		(callback: (data: UserJoinedEvent) => void) => {
			const wrappedCallback = (data: UserJoinedEvent) => {
				setOnlineUsers((prev) => {
					const newSet = new Set(prev);
					newSet.add(data.userId);
					return newSet;
				});

				callback(data);
			};

			return websocketService.onUserJoined(wrappedCallback);
		},
		[],
	);

	const onUserLeft = useCallback(
		(callback: (data: UserJoinedEvent) => void) => {
			const wrappedCallback = (data: UserJoinedEvent) => {
				setOnlineUsers((prev) => {
					const newSet = new Set(prev);
					newSet.delete(data.userId);
					return newSet;
				});

				callback(data);
			};

			return websocketService.onUserLeft(wrappedCallback);
		},
		[],
	);

	const sendMessage = useCallback(
		async (contenido: string) => {
			if (!groupId) {
				throw new Error('No group ID provided');
			}
			return websocketService.sendMessage(groupId, contenido);
		},
		[groupId],
	);

	const sendTyping = useCallback(() => {
		if (!groupId) return;
		websocketService.sendTyping(groupId);
	}, [groupId]);

	const sendStopTyping = useCallback(() => {
		if (!groupId) return;
		websocketService.sendStopTyping(groupId);
	}, [groupId]);

	return {
		isConnected,
		usersTyping,
		onlineUsers,
		onNewMessage,
		onUserTyping,
		onUserStoppedTyping,
		onUserJoined,
		onUserLeft,
		sendMessage,
		sendTyping,
		sendStopTyping,
	};
}
