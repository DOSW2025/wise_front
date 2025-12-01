import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	ScrollShadow,
} from '@heroui/react';
import { Send, X } from 'lucide-react';
import { useState } from 'react';

interface ChatMessage {
	id: string;
	senderId: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

interface ChatWindowProps {
	isOpen: boolean;
	onClose: () => void;
	participantName: string;
	participantAvatar?: string;
	participantRole: 'student' | 'tutor' | 'admin';
	messages: ChatMessage[];
	currentUserId: string;
}

const formatMessageTime = (date: Date) => {
	return date.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export function ChatWindow({
	isOpen,
	onClose,
	participantName,
	participantAvatar,
	participantRole,
	messages,
	currentUserId,
}: ChatWindowProps) {
	const [newMessage, setNewMessage] = useState('');

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// Aquí conectarás con el backend para enviar el mensaje
			console.log('Enviando mensaje:', newMessage);
			setNewMessage('');
		}
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

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md h-[600px] flex flex-col">
				<CardHeader className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center gap-3">
						<Avatar
							name={participantName}
							size="sm"
							src={participantAvatar}
							showFallback
						/>
						<div>
							<p className="font-semibold text-sm">{participantName}</p>
							<p className={`text-xs ${getRoleColor(participantRole)}`}>
								{participantRole === 'tutor'
									? 'Tutor'
									: participantRole === 'admin'
										? 'Administrador'
										: 'Estudiante'}
							</p>
						</div>
					</div>
					<Button isIconOnly size="sm" variant="light" onPress={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</CardHeader>

				<CardBody className="flex-1 p-0">
					<ScrollShadow className="flex-1 p-4 space-y-3">
						{messages.map((message) => {
							const isCurrentUser = message.senderId === currentUserId;
							return (
								<div
									key={message.id}
									className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-[70%] p-3 rounded-lg ${
											isCurrentUser
												? 'bg-primary text-primary-foreground'
												: 'bg-gray-100 text-gray-900'
										}`}
									>
										<p className="text-sm">{message.content}</p>
										<p
											className={`text-xs mt-1 ${
												isCurrentUser
													? 'text-primary-foreground/70'
													: 'text-gray-500'
											}`}
										>
											{formatMessageTime(message.timestamp)}
										</p>
									</div>
								</div>
							);
						})}
					</ScrollShadow>

					<div className="p-4 border-t">
						<div className="flex gap-2">
							<Input
								placeholder="Escribe un mensaje..."
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage();
									}
								}}
								className="flex-1"
							/>
							<Button
								isIconOnly
								color="primary"
								onPress={handleSendMessage}
								isDisabled={!newMessage.trim()}
							>
								<Send className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
