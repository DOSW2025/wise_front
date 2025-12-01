import { useEffect, useState } from 'react';

interface ChatMessage {
	id: string;
	senderId: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

interface ChatConversation {
	id: string;
	participantName: string;
	participantAvatar?: string;
	participantRole: 'student' | 'tutor' | 'admin';
	lastMessage: ChatMessage;
	unreadCount: number;
}

interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
	timestamp: Date;
	isRead: boolean;
}

// Mock data - reemplazar con llamadas al API
const mockConversations: ChatConversation[] = [
	{
		id: '1',
		participantName: 'Ana García',
		participantRole: 'tutor',
		lastMessage: {
			id: 'msg-1',
			senderId: 'tutor-1',
			content: '¿Tienes alguna duda sobre el ejercicio de cálculo?',
			timestamp: new Date(Date.now() - 5 * 60 * 1000),
			isRead: false,
		},
		unreadCount: 2,
	},
	{
		id: '2',
		participantName: 'Carlos Rodríguez',
		participantRole: 'student',
		lastMessage: {
			id: 'msg-2',
			senderId: 'current-user',
			content: 'Perfecto, nos vemos mañana a las 3pm',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			isRead: true,
		},
		unreadCount: 0,
	},
];

const mockNotifications: Notification[] = [
	{
		id: '1',
		title: 'Nueva tutoría programada',
		message:
			'Tienes una tutoría de Cálculo I programada para mañana a las 3:00 PM',
		type: 'info',
		timestamp: new Date(Date.now() - 10 * 60 * 1000),
		isRead: false,
	},
	{
		id: '2',
		title: 'Material subido',
		message: 'Se ha subido nuevo material para el curso de Programación',
		type: 'success',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
		isRead: false,
	},
];

export function useChatNotifications() {
	const [conversations, setConversations] = useState<ChatConversation[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);

	// Simular carga de datos - reemplazar con llamadas al API
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			// Simular delay de red
			await new Promise((resolve) => setTimeout(resolve, 500));

			setConversations(mockConversations);
			setNotifications(mockNotifications);
			setLoading(false);
		};

		loadData();
	}, []);

	const markNotificationAsRead = (notificationId: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === notificationId
					? { ...notification, isRead: true }
					: notification,
			),
		);
	};

	const markConversationAsRead = (conversationId: string) => {
		setConversations((prev) =>
			prev.map((conversation) =>
				conversation.id === conversationId
					? { ...conversation, unreadCount: 0 }
					: conversation,
			),
		);
	};

	const unreadChatsCount = conversations.reduce(
		(sum, conv) => sum + conv.unreadCount,
		0,
	);
	const unreadNotificationsCount = notifications.filter(
		(n) => !n.isRead,
	).length;

	return {
		conversations,
		notifications,
		loading,
		unreadChatsCount,
		unreadNotificationsCount,
		markNotificationAsRead,
		markConversationAsRead,
	};
}
