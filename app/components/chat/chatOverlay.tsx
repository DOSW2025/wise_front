import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
} from '@heroui/react';
import { Flag, MoreVertical, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '~/contexts/auth-context';
import { useWebSocket } from '~/lib/hooks/useWebSocket';
import { type ChatMessage, chatsService } from '~/lib/services/chats.service';
import MessageInput from './messageInput';
import MessageList from './messageList';
import ReportChatModal from './reportContent/reportChatModal';

interface Message {
	id: string;
	type: 'text' | 'file';
	content: string;
	name?: string;
	sender: 'student' | 'tutor';
	timestamp: Date;
	userAvatar?: string;
	userName?: string;
	userId?: string;
}

interface ChatOverlayProps {
	groupId?: string;
	tutor: {
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
	} | null;
	onClose: () => void;
}

export default function ChatOverlay({
	groupId,
	tutor,
	onClose,
}: ChatOverlayProps) {
	const { user } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [typingUsers, setTypingUsers] = useState<string[]>([]);

	const {
		isConnected,
		onNewMessage,
		onUserTyping,
		onUserStoppedTyping,
		onUserJoined,
		onUserLeft,
		sendMessage: sendWebSocketMessage,
		sendTyping,
		sendStopTyping,
	} = useWebSocket(groupId);

	const loadMessages = useCallback(async () => {
		if (!groupId) return;
		setIsLoading(true);
		try {
			const data = await chatsService.getGroupMessages(groupId);
			const convertedMessages = data.map((msg: ChatMessage) => {
				const isCurrentUser = msg.usuarioId === user?.id;
				const sender: 'student' | 'tutor' = isCurrentUser ? 'student' : 'tutor';
				return {
					id: msg.id,
					type: 'text' as const,
					content: msg.contenido,
					sender,
					timestamp: new Date(msg.fechaCreacion),
					userAvatar:
						msg.usuario?.avatar_url ||
						(isCurrentUser ? user?.avatarUrl : undefined),
					userName: msg.usuario
						? `${msg.usuario.nombre} ${msg.usuario.apellido}`
						: isCurrentUser
							? user?.name
							: 'Usuario',
					userId: msg.usuarioId,
				};
			});
			setMessages(convertedMessages);
		} catch (error) {
			console.error('Error loading messages:', error);
		} finally {
			setIsLoading(false);
		}
	}, [groupId, user]);

	useEffect(() => {
		if (groupId) {
			// Marcar como loading y cargar mensajes
			setIsLoading(true);
			loadMessages();
		} else if (tutor) {
			// Mensaje de bienvenida automático del tutor si no hay groupId
			setIsLoading(false);
			setMessages([
				{
					id: 'welcome',
					type: 'text',
					content: `¡Hola! Soy ${tutor.name}. ¿En qué puedo ayudarte hoy?`,
					sender: 'tutor',
					timestamp: new Date(),
				},
			]);
		}
	}, [tutor, groupId, loadMessages]);

	useEffect(() => {
		if (!groupId || !isConnected) return;

		const unsubscribeNewMessage = onNewMessage((message) => {
			console.log('[ChatOverlay] New message received via WebSocket:', message);
			const isCurrentUser = message.usuario.id === user?.id;
			const sender: 'student' | 'tutor' = isCurrentUser ? 'student' : 'tutor';

			const newMessage: Message = {
				id: message.id,
				type: 'text',
				content: message.contenido,
				sender,
				timestamp: new Date(message.fechaCreacion),
				userAvatar: message.usuario.avatar_url,
				userName: `${message.usuario.nombre} ${message.usuario.apellido}`,
				userId: message.usuario.id,
			};

			setMessages((prev) => {
				// Evitar duplicados: buscar si ya existe el mensaje o un temporal con el mismo contenido
				const existingIndex = prev.findIndex(
					(m) =>
						m.id === message.id ||
						(m.id.startsWith('temp-') &&
							m.content === message.contenido &&
							m.userId === message.usuario.id),
				);

				if (existingIndex !== -1) {
					// Reemplazar el mensaje temporal/existente con el real del servidor
					const updated = [...prev];
					updated[existingIndex] = newMessage;
					return updated;
				}

				// Si no existe y no es nuestro mensaje (ya lo agregamos optimistamente), agregarlo
				if (!isCurrentUser) {
					return [...prev, newMessage];
				}

				// Si es nuestro mensaje pero no encontramos el temporal, agregarlo de todas formas
				return [...prev, newMessage];
			});
		});

		const unsubscribeUserTyping = onUserTyping((data) => {
			console.log('[ChatOverlay] User typing:', data.email);
			if (data.userId !== user?.id) {
				setTypingUsers((prev) =>
					prev.includes(data.userId) ? prev : [...prev, data.userId],
				);
			}
		});

		const unsubscribeUserStoppedTyping = onUserStoppedTyping((data) => {
			console.log('[ChatOverlay] User stopped typing:', data.userId);
			setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
		});

		const unsubscribeUserJoined = onUserJoined((data) => {
			console.log('[ChatOverlay] User joined:', data.email);
		});

		const unsubscribeUserLeft = onUserLeft((data) => {
			console.log('[ChatOverlay] User left:', data.email);
		});

		return () => {
			unsubscribeNewMessage();
			unsubscribeUserTyping();
			unsubscribeUserStoppedTyping();
			unsubscribeUserJoined();
			unsubscribeUserLeft();
		};
	}, [
		groupId,
		isConnected,
		onNewMessage,
		onUserTyping,
		onUserStoppedTyping,
		onUserJoined,
		onUserLeft,
		user?.id,
	]);

	async function sendText(text: string) {
		if (!groupId) {
			// Comportamiento local si no hay groupId
			const newMessage: Message = {
				id: Date.now().toString(),
				type: 'text',
				content: text,
				sender: 'student',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, newMessage]);

			setTimeout(() => {
				const reply: Message = {
					id: (Date.now() + 1).toString(),
					type: 'text',
					content: 'Gracias por tu mensaje. Te responderé pronto.',
					sender: 'tutor',
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, reply]);
			}, 1500);
			return;
		}

		// Crear mensaje temporal para mostrar inmediatamente (optimistic update)
		const tempId = `temp-${Date.now()}`;
		const optimisticMessage: Message = {
			id: tempId,
			type: 'text',
			content: text,
			sender: 'student',
			timestamp: new Date(),
			userAvatar: user?.avatarUrl,
			userName: user?.name || 'Tú',
			userId: user?.id,
		};

		// Agregar mensaje inmediatamente a la UI
		setMessages((prev) => [...prev, optimisticMessage]);

		try {
			if (isConnected) {
				console.log('[ChatOverlay] Sending message via WebSocket');
				await sendWebSocketMessage(text);
				// El evento 'newMessage' del WebSocket actualizará el mensaje automáticamente
			} else {
				console.log(
					'[ChatOverlay] Sending message via HTTP (WebSocket not connected)',
				);
				const newMsg = await chatsService.sendMessage(groupId, text);

				// Reemplazar mensaje temporal con el del servidor
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === tempId
							? {
									id: newMsg.id,
									type: 'text',
									content: newMsg.contenido,
									sender: 'student',
									timestamp: new Date(newMsg.fechaCreacion),
									userAvatar: newMsg.usuario?.avatar_url || user?.avatarUrl,
									userName: newMsg.usuario
										? `${newMsg.usuario.nombre} ${newMsg.usuario.apellido}`
										: user?.name || 'Usuario',
									userId: newMsg.usuarioId,
								}
							: msg,
					),
				);
			}
		} catch (error) {
			console.error('[ChatOverlay] Error sending message:', error);
			// Remover mensaje temporal si hay error
			setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
		}
	}

	function sendFile(file: File) {
		// Crear URL local para el archivo
		const url = URL.createObjectURL(file);
		const newMessage: Message = {
			id: Date.now().toString(),
			type: 'file',
			content: url,
			name: file.name,
			sender: 'student',
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, newMessage]);

		// TODO: Implementar envío de archivos al backend si es necesario
	}

	function handleReport(reason: string, details: string) {
		console.log('Reporte enviado:', {
			tutorId: tutor?.id,
			tutorName: tutor?.name,
			reason,
			details,
			timestamp: new Date(),
		});

		// Mostrar notificación de éxito
		alert('Reporte enviado exitosamente. Nuestro equipo lo revisará pronto.');
	}

	function handleDeleteChat() {
		setIsDeleteModalOpen(true);
	}

	function confirmDeleteChat() {
		console.log('Chat eliminado:', tutor?.id);
		// TODO: Implementar eliminación del chat en el backend
		setIsDeleteModalOpen(false);
		onClose();
	}

	if (!tutor) return null;

	return (
		<>
			<Modal
				isOpen={true}
				onClose={onClose}
				size="lg"
				scrollBehavior="inside"
				isDismissable={false}
				hideCloseButton={true}
				classNames={{
					backdrop: 'bg-transparent',
					wrapper: '!justify-end !items-stretch',
					base: 'rounded-3xl',
					body: 'rounded-3xl',
				}}
				motionProps={{
					variants: {
						enter: {
							x: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: 'easeOut',
							},
						},
						exit: {
							x: 50,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: 'easeIn',
							},
						},
					},
				}}
			>
				<ModalContent>
					<ModalBody className="p-0 flex flex-col h-[600px]">
						{/* Header del chat */}
						<div className="flex justify-between items-center p-4 border-b bg-gray-50">
							<div className="flex items-center gap-3 flex-1">
								<div className="relative">
									<Avatar
										name={tutor.avatarInitials}
										color="danger"
										size="sm"
									/>
									{isConnected && (
										<span
											className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
											title="En línea"
										/>
									)}
								</div>
								<div>
									<h2 className="font-semibold text-gray-800">{tutor.name}</h2>
									<p className="text-xs text-gray-500">
										{isConnected ? 'En línea' : tutor.title}
									</p>
								</div>
							</div>

							{/* Botones alineados */}
							<div className="flex items-center gap-1">
								<Dropdown>
									<DropdownTrigger>
										<Button
											isIconOnly
											variant="light"
											size="sm"
											aria-label="Opciones"
										>
											<MoreVertical className="w-5 h-5 text-gray-600" />
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Opciones del chat">
										<DropdownItem
											key="delete"
											color="danger"
											startContent={<Trash2 className="w-4 h-4" />}
											onPress={handleDeleteChat}
										>
											Eliminar chat
										</DropdownItem>
										<DropdownItem
											key="report"
											color="danger"
											startContent={<Flag className="w-4 h-4" />}
											onPress={() => setIsReportModalOpen(true)}
										>
											Reportar conversación
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>

								<Button
									isIconOnly
									variant="light"
									size="sm"
									onPress={onClose}
									aria-label="Cerrar"
								>
									<X className="w-5 h-5 text-gray-600" />
								</Button>
							</div>
						</div>

						{/* Área de mensajes */}
						<div className="flex-1 overflow-y-auto bg-white">
							<MessageList
								messages={messages}
								tutorName={tutor.name}
								typingUsers={typingUsers}
								isLoading={isLoading}
							/>
						</div>

						{/* Input de mensajes */}
						<MessageInput
							onSendText={sendText}
							onSendFile={sendFile}
							onTyping={sendTyping}
							onStopTyping={sendStopTyping}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Modal de reporte */}
			<ReportChatModal
				isOpen={isReportModalOpen}
				onClose={() => setIsReportModalOpen(false)}
				tutorName={tutor.name}
				onSubmitReport={handleReport}
			/>

			{/* Modal de confirmación de eliminación */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				size="sm"
			>
				<ModalContent>
					<ModalBody className="p-6">
						<div className="flex flex-col items-center text-center gap-4">
							<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
								<Trash2 className="w-6 h-6 text-red-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									¿Eliminar chat?
								</h3>
								<p className="text-sm text-gray-500 mt-2">
									¿Estás seguro de que quieres eliminar este chat con{' '}
									<span className="font-medium">{tutor?.name}</span>? Esta
									acción no se puede deshacer.
								</p>
							</div>
							<div className="flex gap-3 w-full mt-2">
								<Button
									variant="light"
									onPress={() => setIsDeleteModalOpen(false)}
									className="flex-1"
								>
									Cancelar
								</Button>
								<Button
									color="danger"
									onPress={confirmDeleteChat}
									className="flex-1"
								>
									Eliminar
								</Button>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
