import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Spinner,
	Tooltip,
} from '@heroui/react';
import { MessageSquare, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useChats, useCreateChat } from '~/lib/hooks/useChats';
import { CreateGroupModal } from './create-group-modal';

interface Chat {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	timestamp: Date;
	unread: boolean;
}

interface ChatDropdownProps {
	onOpenChat?: (data: {
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
		groupId?: string;
	}) => void;
}

export function ChatDropdown({ onOpenChat }: Readonly<ChatDropdownProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

	const { data: chatsData, isLoading, error } = useChats();
	const createChatMutation = useCreateChat();

	const chats = useMemo<Chat[]>(() => {
		if (!chatsData) {
			console.log('ChatDropdown: No chatsData available');
			return [];
		}
		console.log('ChatDropdown: Chats loaded:', chatsData);
		return chatsData.map((group) => ({
			id: group.id,
			name: group.nombre,
			avatar: group.nombre
				.split(' ')
				.map((word) => word[0])
				.join('')
				.substring(0, 2)
				.toUpperCase(),
			lastMessage: 'Grupo creado',
			timestamp: new Date(group.fechaCreacion),
			unread: false,
		}));
	}, [chatsData]);

	const unreadCount = chats.filter((c) => c.unread).length;

	if (error) {
		console.error('ChatDropdown: Error loading chats:', error);
	}

	const formatTime = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);

		if (minutes < 60) return `${minutes}m`;
		if (hours < 24) return `${hours}h`;
		return date.toLocaleDateString();
	};

	const handleChatClick = (chat: Chat) => {
		if (onOpenChat) {
			const id = Number.parseInt(chat.id, 10);
			onOpenChat({
				id,
				name: chat.name,
				title: 'Grupo',
				avatarInitials: chat.avatar,
				groupId: chat.id,
			});
			setIsOpen(false);
		}
	};

	const handleGroupCreated = async (groupData: {
		name: string;
		description: string;
		emails: string[];
	}) => {
		try {
			await createChatMutation.mutateAsync({
				nombre: groupData.name,
				emails: groupData.emails,
			});
			setIsCreateGroupOpen(false);
		} catch (error) {
			console.error('Error al crear grupo:', error);
		}
	};

	return (
		<>
			<Dropdown placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
				<DropdownTrigger>
					<Button isIconOnly variant="light" size="md" className="relative">
						<MessageSquare className="w-6 h-6" />
						{unreadCount > 0 && (
							<span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></span>
						)}
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Chats" className="w-80" closeOnSelect={false}>
					<DropdownItem
						key="header"
						className="h-auto py-3 cursor-default"
						textValue="Chats Header"
						isReadOnly
					>
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Chats</h3>
							<Tooltip content="Crear grupo">
								<Button
									isIconOnly
									size="sm"
									variant="light"
									onPress={() => setIsCreateGroupOpen(true)}
								>
									<Plus className="w-5 h-5" />
								</Button>
							</Tooltip>
						</div>
					</DropdownItem>
					{isLoading ? (
						<DropdownItem key="loading" textValue="Cargando...">
							<div className="flex justify-center items-center py-8">
								<Spinner size="sm" />
							</div>
						</DropdownItem>
					) : chats.length === 0 ? (
						<DropdownItem key="empty" textValue="No hay chats">
							<p className="text-center text-default-500 py-4">
								{error ? 'Error al cargar chats' : 'No hay chats'}
							</p>
						</DropdownItem>
					) : (
						chats.map((chat) => (
							<DropdownItem
								key={chat.id}
								className={`h-auto py-3 cursor-pointer ${chat.unread ? 'bg-blue-50 data-[hover=true]:bg-blue-100' : 'data-[hover=true]:bg-default-100'}`}
								textValue={chat.name}
								onPress={() => handleChatClick(chat)}
							>
								<div className="flex gap-3 w-full">
									<Avatar name={chat.avatar} size="md" color="primary" />
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start">
											<p
												className={`text-sm truncate ${chat.unread ? 'font-semibold' : 'font-medium'}`}
											>
												{chat.name}
											</p>
											<p className="text-tiny text-default-400 ml-2">
												{formatTime(chat.timestamp)}
											</p>
										</div>
										<p
											className={`text-tiny mt-1 truncate ${chat.unread ? 'text-default-700 font-medium' : 'text-default-500'}`}
										>
											{chat.lastMessage}
										</p>
										{chat.unread && (
											<div className="flex justify-end mt-1">
												<span className="w-2 h-2 bg-primary rounded-full"></span>
											</div>
										)}
									</div>
								</div>
							</DropdownItem>
						))
					)}
				</DropdownMenu>
			</Dropdown>

			<CreateGroupModal
				isOpen={isCreateGroupOpen}
				onClose={() => setIsCreateGroupOpen(false)}
				onCreateGroup={handleGroupCreated}
			/>
		</>
	);
}
