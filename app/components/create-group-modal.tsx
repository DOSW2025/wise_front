import {
	Avatar,
	Button,
	Checkbox,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Textarea,
} from '@heroui/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useUsers } from '~/lib/hooks/useUsers';

interface User {
	id: string;
	email: string;
	name: string;
	avatar: string;
	role: string;
}

interface CreateGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateGroup: (groupData: {
		name: string;
		description: string;
		emails: string[];
	}) => void;
}

export function CreateGroupModal({
	isOpen,
	onClose,
	onCreateGroup,
}: Readonly<CreateGroupModalProps>) {
	const [groupName, setGroupName] = useState('');
	const [groupDescription, setGroupDescription] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

	const { data: usersData, isLoading } = useUsers(searchValue);

	const users = useMemo<User[]>(() => {
		if (!usersData?.data) return [];
		return usersData.data.map((user) => ({
			id: user.id,
			email: user.email,
			name: `${user.nombre} ${user.apellido}`,
			avatar:
				user.avatarUrl || `${user.nombre[0]}${user.apellido[0]}`.toUpperCase(),
			role: user.rol,
		}));
	}, [usersData]);

	const filteredUsers = useMemo(
		() =>
			users.filter(
				(user) =>
					user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					user.email.toLowerCase().includes(searchValue.toLowerCase()),
			),
		[users, searchValue],
	);

	const handleMemberToggle = (user: User) => {
		setSelectedMembers((prev) => {
			const isSelected = prev.some((member) => member.id === user.id);
			if (isSelected) {
				return prev.filter((member) => member.id !== user.id);
			} else {
				return [...prev, user];
			}
		});
	};

	const removeMember = (userId: string) => {
		setSelectedMembers((prev) => prev.filter((member) => member.id !== userId));
	};

	const handleCreate = () => {
		if (groupName.trim() && selectedMembers.length > 0) {
			onCreateGroup({
				name: groupName,
				description: groupDescription,
				emails: selectedMembers.map((m) => m.email),
			});
			handleClose();
		}
	};

	const handleClose = () => {
		setGroupName('');
		setGroupDescription('');
		setSearchValue('');
		setSelectedMembers([]);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			scrollBehavior="inside"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h2 className="text-xl font-semibold">Crear Nuevo Grupo</h2>
					<p className="text-sm text-default-500">
						Crea un grupo de estudio o trabajo colaborativo
					</p>
				</ModalHeader>
				<ModalBody className="gap-4">
					<Input
						label="Nombre del grupo"
						placeholder="Ej: Grupo Cálculo 2024-1"
						value={groupName}
						onValueChange={setGroupName}
						variant="bordered"
						isRequired
					/>

					<Textarea
						label="Descripción (opcional)"
						placeholder="Describe el propósito del grupo..."
						value={groupDescription}
						onValueChange={setGroupDescription}
						variant="bordered"
						minRows={2}
						maxRows={4}
					/>

					<div>
						<p className="text-sm font-medium mb-2">
							Miembros seleccionados ({selectedMembers.length})
						</p>
						{selectedMembers.length > 0 ? (
							<div className="flex flex-wrap gap-2 mb-3">
								{selectedMembers.map((member) => (
									<Chip
										key={member.id}
										onClose={() => removeMember(member.id)}
										variant="flat"
										color="primary"
										avatar={<Avatar name={member.avatar} size="sm" />}
									>
										{member.name}
									</Chip>
								))}
							</div>
						) : (
							<p className="text-sm text-default-400 mb-3">
								No hay miembros seleccionados
							</p>
						)}
					</div>

					<Input
						placeholder="Buscar usuarios..."
						value={searchValue}
						onValueChange={setSearchValue}
						startContent={<Search className="w-4 h-4 text-default-400" />}
						variant="bordered"
						isClearable
						onClear={() => setSearchValue('')}
					/>

					<div className="max-h-48 overflow-y-auto">
						{isLoading ? (
							<div className="flex justify-center items-center py-8">
								<Spinner size="sm" />
							</div>
						) : (
							<>
								{filteredUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center gap-3 p-2 hover:bg-default-100 rounded-lg"
									>
										<Checkbox
											isSelected={selectedMembers.some(
												(member) => member.id === user.id,
											)}
											onValueChange={() => handleMemberToggle(user)}
										/>
										<Avatar name={user.avatar} size="sm" color="primary" />
										<div className="flex-1">
											<p className="text-sm font-medium">{user.name}</p>
											<p className="text-xs text-default-500">{user.email}</p>
										</div>
									</div>
								))}
								{filteredUsers.length === 0 && !isLoading && (
									<p className="text-center text-default-500 py-4">
										No se encontraron usuarios
									</p>
								)}
							</>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={handleClose}>
						Cancelar
					</Button>
					<Button
						color="primary"
						onPress={handleCreate}
						isDisabled={!groupName.trim() || selectedMembers.length === 0}
					>
						Crear Grupo
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
