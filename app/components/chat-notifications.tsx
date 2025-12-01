import {
	Avatar,
	Badge,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/react';
import { Bell, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChat } from '~/contexts/chat-context';
import { useChatNotifications } from '~/lib/hooks/use-chat-notifications';
import { ChatWindow } from './chat-window';

const formatTime = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return 'Ahora';
	if (minutes < 60) return `${minutes}m`;
	if (hours < 24) return `${hours}h`;
	return `${days}d`;
};

const getRoleColor = (role: string) => {
	switch (role) {
		case 'tutor':
			return 'text-blue-600';
		case 'admin':
			return 'text-purple-600';
		default:
			return 'text-gray-600';
	}
};

export function ChatNotifications() {
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const { selectedConversation, setSelectedConversation, conversationData } =
		useChat();

	const {
		conversations,
		notifications,
		unreadChatsCount,
		unreadNotificationsCount,
		markNotificationAsRead,
		markConversationAsRead,
	} = useChatNotifications();

	const handleConversationClick = (conversationId: string) => {
		setSelectedConversation(conversationId);
		setIsChatOpen(false);
		markConversationAsRead(conversationId);
	};

	// Cerrar dropdown cuando se abre chat desde contexto externo
	useEffect(() => {
		if (selectedConversation) {
			setIsChatOpen(false);
			setIsNotificationsOpen(false);
		}
	}, [selectedConversation]);

	const handleNotificationClick = (notificationId: string) => {
		markNotificationAsRead(notificationId);
		setIsNotificationsOpen(false);
	};

	const selectedConv = conversations.find((c) => c.id === selectedConversation);

	// Mock messages para el chat seleccionado
	const mockMessages = [
		{
			id: '1',
			senderId:
				selectedConv?.participantName === 'Ana García'
					? 'tutor-1'
					: 'student-1',
			content: '¡Hola! ¿Cómo estás?',
			timestamp: new Date(Date.now() - 60 * 60 * 1000),
			isRead: true,
		},
		{
			id: '2',
			senderId: 'current-user',
			content: 'Muy bien, gracias. ¿Podemos revisar el ejercicio?',
			timestamp: new Date(Date.now() - 30 * 60 * 1000),
			isRead: true,
		},
		{
			id: '3',
			senderId:
				selectedConv?.participantName === 'Ana García'
					? 'tutor-1'
					: 'student-1',
			content: selectedConv?.lastMessage.content || 'Claro, empezemos',
			timestamp: selectedConv?.lastMessage.timestamp || new Date(),
			isRead: false,
		},
	];

	return (
		<div className="flex items-center gap-3 p-2">
			{/* Chat Dropdown */}
			<Dropdown
				isOpen={isChatOpen}
				onOpenChange={setIsChatOpen}
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button
						isIconOnly
						variant="light"
						className="relative w-10 h-10"
						aria-label="Chat"
					>
						<MessageCircle className="w-5 h-5" />
						{unreadChatsCount > 0 && (
							<div className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold z-10">
								{unreadChatsCount > 9 ? '9+' : unreadChatsCount}
							</div>
						)}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Chat conversations"
					className="w-80"
					closeOnSelect={false}
				>
					<DropdownItem
						key="header"
						className="h-auto p-0"
						textValue="Chat header"
					>
						<div className="flex items-center justify-between p-3 border-b">
							<h3 className="font-semibold">Mensajes</h3>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								onPress={() => setIsChatOpen(false)}
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</DropdownItem>
					{conversations.map((conversation) => (
						<DropdownItem
							key={conversation.id}
							className="h-auto p-0"
							textValue={conversation.participantName}
						>
							<button
								type="button"
								className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer w-full text-left"
								onClick={() => handleConversationClick(conversation.id)}
							>
								<Avatar
									name={conversation.participantName}
									size="sm"
									src={conversation.participantAvatar}
									showFallback
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<p className="font-medium text-sm truncate">
											{conversation.participantName}
										</p>
										<span className="text-xs text-gray-500">
											{formatTime(conversation.lastMessage.timestamp)}
										</span>
									</div>
									<p
										className={`text-xs ${getRoleColor(conversation.participantRole)} mb-1`}
									>
										{conversation.participantRole === 'tutor'
											? 'Tutor'
											: conversation.participantRole === 'admin'
												? 'Administrador'
												: 'Estudiante'}
									</p>
									<p className="text-sm text-gray-600 truncate">
										{conversation.lastMessage.content}
									</p>
									{conversation.unreadCount > 0 && (
										<Badge
											content={conversation.unreadCount}
											color="danger"
											size="sm"
											className="mt-1"
										/>
									)}
								</div>
							</button>
						</DropdownItem>
					))}
					<DropdownItem
						key="view-all"
						className="h-auto p-0"
						textValue="Ver todos"
					>
						<div className="p-3 border-t">
							<Button
								variant="light"
								color="primary"
								className="w-full"
								size="sm"
							>
								Ver todos los mensajes
							</Button>
						</div>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			{/* Notifications Dropdown */}
			<Dropdown
				isOpen={isNotificationsOpen}
				onOpenChange={setIsNotificationsOpen}
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button
						isIconOnly
						variant="light"
						className="relative w-10 h-10"
						aria-label="Notificaciones"
					>
						<Bell className="w-5 h-5" />
						{unreadNotificationsCount > 0 && (
							<div className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold z-10">
								{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
							</div>
						)}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Notifications"
					className="w-80"
					closeOnSelect={false}
				>
					<DropdownItem
						key="header"
						className="h-auto p-0"
						textValue="Notifications header"
					>
						<div className="flex items-center justify-between p-3 border-b">
							<h3 className="font-semibold">Notificaciones</h3>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								onPress={() => setIsNotificationsOpen(false)}
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</DropdownItem>
					{notifications.map((notification) => (
						<DropdownItem
							key={notification.id}
							className="h-auto p-0"
							textValue={notification.title}
						>
							<button
								type="button"
								className={`p-3 hover:bg-gray-50 cursor-pointer border-l-4 w-full text-left ${
									notification.type === 'info'
										? 'border-blue-500'
										: notification.type === 'success'
											? 'border-green-500'
											: notification.type === 'warning'
												? 'border-yellow-500'
												: 'border-red-500'
								} ${!notification.isRead ? 'bg-blue-50' : ''}`}
								onClick={() => handleNotificationClick(notification.id)}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<p className="font-medium text-sm">{notification.title}</p>
										<p className="text-sm text-gray-600 mt-1">
											{notification.message}
										</p>
									</div>
									<span className="text-xs text-gray-500 ml-2">
										{formatTime(notification.timestamp)}
									</span>
								</div>
								{!notification.isRead && (
									<div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
								)}
							</button>
						</DropdownItem>
					))}
					<DropdownItem
						key="view-all"
						className="h-auto p-0"
						textValue="Ver todas"
					>
						<div className="p-3 border-t">
							<Button
								variant="light"
								color="primary"
								className="w-full"
								size="sm"
							>
								Ver todas las notificaciones
							</Button>
						</div>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			{/* Chat Window */}
			{selectedConversation && (
				<ChatWindow
					isOpen={!!selectedConversation}
					onClose={() => setSelectedConversation(null)}
					participantName={
						selectedConv?.participantName ||
						conversationData[selectedConversation]?.name ||
						'Usuario'
					}
					participantAvatar={selectedConv?.participantAvatar}
					participantRole={
						(selectedConv?.participantRole ||
							conversationData[selectedConversation]?.role ||
							'tutor') as 'student' | 'tutor' | 'admin'
					}
					messages={mockMessages}
					currentUserId="current-user"
				/>
			)}
		</div>
	);
}
