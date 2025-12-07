import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Tooltip,
} from '@heroui/react';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Fragment, useState } from 'react';
import { CreateGroupModal } from './create-group-modal';

interface Chat {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	timestamp: Date;
	unread: boolean;
}

const mockChats: Chat[] = [
	{
		id: '1',
		name: 'Dr. María García',
		avatar: 'MG',
		lastMessage:
			'¡Perfecto! Nos vemos mañana a las 15:00 para la tutoría de Cálculo',
		timestamp: new Date(Date.now() - 5 * 60 * 1000),
		unread: true,
	},
	{
		id: '2',
		name: 'Ing. Carlos Rodríguez',
		avatar: 'CR',
		lastMessage: 'Te envié el material de React que me pediste',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
		unread: false,
	},
	{
		id: '3',
		name: 'Grupo Cálculo 2024-1',
		avatar: 'GC',
		lastMessage: 'Ana: ¿Alguien tiene las notas de la clase de hoy?',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
		unread: true,
	},
];

interface ChatDropdownProps {
	onOpenChat?: (tutor: {
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
	}) => void;
}

export function ChatDropdown({ onOpenChat }: Readonly<ChatDropdownProps>) {
	const [chats, setChats] = useState<Chat[]>(mockChats);
	const [searchValue, setSearchValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
	const unreadCount = chats.filter((c) => c.unread).length;

	const filteredChats = chats.filter(
		(chat) =>
			chat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			chat.lastMessage.toLowerCase().includes(searchValue.toLowerCase()),
	);

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
			let title = 'Grupo';
			if (chat.name.includes('Dr.')) title = 'Profesor';
			else if (chat.name.includes('Ing.')) title = 'Tutor';

			onOpenChat({
				id,
				name: chat.name,
				title,
				avatarInitials: chat.avatar,
			});
			setIsOpen(false);
		}
	};

	const handleCreateGroup = () => {
		setIsCreateGroupOpen(true);
		setIsOpen(false);
	};

	const handleGroupCreated = (groupData: {
		name: string;
		description: string;
		members: any[];
	}) => {
		const newGroup: Chat = {
			id: (chats.length + 1).toString(),
			name: groupData.name,
			avatar: groupData.name
				.split(' ')
				.map((word) => word[0])
				.join('')
				.substring(0, 2)
				.toUpperCase(),
			lastMessage: 'Grupo creado',
			timestamp: new Date(),
			unread: false,
		};
		setChats((prev) => [newGroup, ...prev]);
		console.log('Grupo creado:', groupData);
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
						className="h-auto py-3 data-[hover=true]:bg-transparent"
						textValue="header"
					>
						<div className="flex flex-col gap-3 w-full">
							<div className="flex justify-between items-center">
								<p className="font-semibold text-lg">Chats</p>
								<Tooltip content="Crear grupo" placement="left">
									<Button
										isIconOnly
										size="sm"
										className="bg-red-500 hover:bg-red-600 text-white"
										onPress={handleCreateGroup}
									>
										<Plus className="w-4 h-4" />
									</Button>
								</Tooltip>
							</div>
							<Input
								placeholder="Buscar en chats..."
								value={searchValue}
								onValueChange={setSearchValue}
								startContent={<Search className="w-4 h-4 text-default-400" />}
								size="sm"
								variant="bordered"
								isClearable
								onClear={() => setSearchValue('')}
							/>
						</div>
					</DropdownItem>

					{filteredChats.length === 0 ? (
						<DropdownItem
							key="empty"
							className="data-[hover=true]:bg-transparent"
							textValue="empty"
						>
							<p className="text-center text-default-500 py-4">
								{searchValue ? 'No se encontraron chats' : 'No hay chats'}
							</p>
						</DropdownItem>
					) : null}
					<Fragment>
						{filteredChats.map((chat) => (
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
						))}
					</Fragment>
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
