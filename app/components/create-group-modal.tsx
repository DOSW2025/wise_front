import {
	Avatar,
	Button,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Contact {
	id: string;
	name: string;
	initials: string;
	isOnline: boolean;
}

interface CreateGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateGroup: (groupName: string, selectedContacts: string[]) => void;
	recentChats?: { id: string; tutorName: string; tutorInitials: string }[];
}

export function CreateGroupModal({
	isOpen,
	onClose,
	onCreateGroup,
	recentChats = [],
}: CreateGroupModalProps) {
	const [groupName, setGroupName] = useState('');
	const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
	const [searchUsers, setSearchUsers] = useState('');

	// Convertir chats recientes a contactos
	const mockContacts: Contact[] = recentChats.map((chat) => ({
		id: chat.id,
		name: chat.tutorName,
		initials: chat.tutorInitials,
		isOnline: Math.random() > 0.5, // Mock random online status
	}));

	const filteredContacts = mockContacts.filter((contact) =>
		contact.name.toLowerCase().includes(searchUsers.toLowerCase()),
	);

	const handleContactToggle = (contactId: string) => {
		setSelectedContacts((prev) =>
			prev.includes(contactId)
				? prev.filter((id) => id !== contactId)
				: [...prev, contactId],
		);
	};

	const handleCreate = () => {
		if (groupName.trim() && selectedContacts.length > 0) {
			onCreateGroup(groupName, selectedContacts);
			setGroupName('');
			setSelectedContacts([]);
			onClose();
		}
	};

	const handleClose = () => {
		setGroupName('');
		setSelectedContacts([]);
		setSearchUsers('');
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="md">
			<ModalContent>
				<ModalHeader>Crear Grupo</ModalHeader>
				<ModalBody>
					<div className="space-y-4">
						<Input
							label="Nombre del grupo"
							placeholder="Ej: Estudio de Cálculo"
							value={groupName}
							onValueChange={setGroupName}
							variant="bordered"
						/>

						<div>
							<p className="text-sm font-medium mb-3">Agregar participantes:</p>
							<Input
								placeholder="Buscar usuarios..."
								value={searchUsers}
								onValueChange={setSearchUsers}
								startContent={<Search className="w-4 h-4 text-default-400" />}
								size="sm"
								isClearable
								className="mb-3"
							/>
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{filteredContacts.map((contact) => (
									<div
										key={contact.id}
										className="flex items-center gap-3 p-2 hover:bg-default-50 rounded-lg"
									>
										<Checkbox
											isSelected={selectedContacts.includes(contact.id)}
											onValueChange={() => handleContactToggle(contact.id)}
										/>
										<Avatar name={contact.initials} color="danger" size="sm" />
										<div className="flex-1">
											<p className="text-sm font-medium">{contact.name}</p>
											<p className="text-xs text-default-500">
												{contact.isOnline ? 'En línea' : 'Desconectado'}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={handleClose}>
						Cancelar
					</Button>
					<Button
						color="danger"
						onPress={handleCreate}
						isDisabled={!groupName.trim() || selectedContacts.length === 0}
					>
						Crear Grupo
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
