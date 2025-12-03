import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Input,
	Tooltip,
} from '@heroui/react';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { CreateGroupModal } from './create-group-modal';

interface Chat {
	id: string;
	tutorName: string;
	tutorInitials: string;
	lastMessage: string;
	timestamp: string;
	unread: boolean;
}

interface ChatsPanelProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSelectChat: (tutor: {
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
	}) => void;
}

export function ChatsPanel({ isOpen, onClose, onSelectChat }: ChatsPanelProps) {
	const [chats] = useState<Chat[]>([
		{
			id: '1',
			tutorName: 'Dr. María García',
			tutorInitials: 'MG',
			lastMessage: 'Perfecto, nos vemos mañana a las 3pm',
			timestamp: '10:30 AM',
			unread: true,
		},
		{
			id: '2',
			tutorName: 'Ing. Carlos Rodríguez',
			tutorInitials: 'CR',
			lastMessage: 'Te envié el material de React que me pediste',
			timestamp: 'Ayer',
			unread: true,
		},
		{
			id: '3',
			tutorName: 'Prof. Ana López',
			tutorInitials: 'AL',
			lastMessage: 'Gracias por la sesión de hoy',
			timestamp: '2 días',
			unread: false,
		},
	]);

	const [searchValue, setSearchValue] = useState('');
	const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

	const filteredChats = chats.filter((chat) =>
		chat.tutorName.toLowerCase().includes(searchValue.toLowerCase()),
	);

	const handleCreateGroup = (groupName: string, selectedContacts: string[]) => {
		console.log('Grupo creado:', { groupName, selectedContacts });
		// Aquí se conectaría con la API
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 lg:inset-auto lg:top-16 lg:right-4 lg:w-80">
			{/* Overlay for mobile */}
			<button
				type="button"
				className="lg:hidden fixed inset-0 bg-black/50 border-none cursor-default"
				onClick={onClose}
				onKeyDown={(e) => e.key === 'Escape' && onClose()}
				aria-label="Close panel"
			/>

			<Card className="h-full lg:h-[500px] lg:shadow-xl">
				<CardHeader className="flex justify-between items-center">
					<h3 className="text-lg font-semibold">Chats</h3>
					<div className="flex items-center gap-2">
						<Tooltip content="Crear grupo">
							<Button
								isIconOnly
								size="sm"
								color="danger"
								onPress={() => setIsCreateGroupOpen(true)}
							>
								<Plus className="w-4 h-4" />
							</Button>
						</Tooltip>
						<button
							type="button"
							onClick={onClose}
							className="p-1 hover:bg-default-100 rounded"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</CardHeader>
				<div className="px-4 pb-2">
					<Input
						placeholder="Buscar chats..."
						value={searchValue}
						onValueChange={setSearchValue}
						startContent={<Search className="w-4 h-4 text-default-400" />}
						size="sm"
						isClearable
					/>
				</div>
				<Divider />
				<CardBody className="p-0">
					<div className="space-y-1">
						{filteredChats.map((chat) => (
							<button
								type="button"
								key={chat.id}
								className={`w-full text-left p-4 hover:bg-default-50 cursor-pointer border-l-4 ${
									chat.unread
										? 'border-l-primary bg-primary-50/50'
										: 'border-l-transparent'
								}`}
								onClick={() => {
									onSelectChat({
										id: Number(chat.id),
										name: chat.tutorName,
										title: 'Tutor',
										avatarInitials: chat.tutorInitials,
									});
									onClose();
								}}
							>
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 bg-danger text-white rounded-full flex items-center justify-center text-sm font-semibold">
										{chat.tutorInitials}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start">
											<p
												className={`font-medium text-sm ${chat.unread ? 'text-foreground' : 'text-default-600'}`}
											>
												{chat.tutorName}
											</p>
											<span className="text-xs text-default-400">
												{chat.timestamp}
											</span>
										</div>
										<p
											className={`text-sm mt-1 truncate ${chat.unread ? 'text-default-700 font-medium' : 'text-default-500'}`}
										>
											{chat.lastMessage}
										</p>
									</div>
								</div>
							</button>
						))}
					</div>
				</CardBody>
			</Card>

			<CreateGroupModal
				isOpen={isCreateGroupOpen}
				onClose={() => setIsCreateGroupOpen(false)}
				onCreateGroup={handleCreateGroup}
				recentChats={chats}
			/>
		</div>
	);
}
