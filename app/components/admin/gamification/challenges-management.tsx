import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	useDisclosure,
} from '@heroui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Challenge } from '~/lib/types/gamification.types';
import { ChallengeForm } from './challenge-form';

interface ChallengesManagementProps {
	challenges: Challenge[];
	onAdd: (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => void;
	onUpdate: (
		id: string,
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => void;
	onDelete: (id: string) => void;
	isLoading?: boolean;
}

export function ChallengesManagement({
	challenges,
	onAdd,
	onUpdate,
	onDelete,
	isLoading = false,
}: ChallengesManagementProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [editingChallenge, setEditingChallenge] = useState<
		Challenge | undefined
	>();
	const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

	const handleAdd = () => {
		setEditingChallenge(undefined);
		onOpen();
	};

	const handleEdit = (challenge: Challenge) => {
		setEditingChallenge(challenge);
		onOpen();
	};

	const handleSubmit = (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => {
		if (editingChallenge) {
			onUpdate(editingChallenge.id, challenge);
		} else {
			onAdd(challenge);
		}
		onOpenChange();
	};

	const handleDelete = (id: string) => {
		setSelectedDeleteId(id);
	};

	const confirmDelete = () => {
		if (selectedDeleteId) {
			onDelete(selectedDeleteId);
			setSelectedDeleteId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold text-foreground">
					Gestión de Desafíos
				</h3>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onClick={handleAdd}
					isDisabled={isLoading}
				>
					Nuevo Desafío
				</Button>
			</div>

			<Card>
				<CardBody>
					<Table aria-label="Desafíos">
						<TableHeader>
							<TableColumn>TÍTULO</TableColumn>
							<TableColumn>XP</TableColumn>
							<TableColumn>OBJETIVOS</TableColumn>
							<TableColumn>PERÍODO</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody>
							{challenges.map((challenge) => (
								<tr key={challenge.id}>
									<TableCell>
										<div className="space-y-1">
											<div className="font-semibold">
												{challenge.icon} {challenge.titulo}
											</div>
											<div className="text-sm text-default-500">
												{challenge.descripcion}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Chip size="sm" color="warning" variant="flat">
											+{challenge.recompensaXP} XP
										</Chip>
									</TableCell>
									<TableCell>
										<Chip size="sm" color="default" variant="flat">
											{challenge.objetivos.length} objetivos
										</Chip>
									</TableCell>
									<TableCell className="text-sm">
										<div className="flex flex-col gap-1">
											<span>
												Inicio:{' '}
												{new Date(
													challenge.periodo.inicio,
												).toLocaleDateString()}
											</span>
											<span>
												Fin:{' '}
												{new Date(challenge.periodo.fin).toLocaleDateString()}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleEdit(challenge)}
												isDisabled={isLoading}
											>
												<Edit2 className="w-4 h-4 text-primary" />
											</Button>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleDelete(challenge.id)}
												isDisabled={isLoading}
											>
												<Trash2 className="w-4 h-4 text-danger" />
											</Button>
										</div>
									</TableCell>
								</tr>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
				<ModalContent>
					<ModalHeader>
						{editingChallenge ? 'Editar Desafío' : 'Crear Nuevo Desafío'}
					</ModalHeader>
					<ModalBody>
						<ChallengeForm
							challenge={editingChallenge}
							onSubmit={handleSubmit}
							onCancel={() => onOpenChange()}
							isLoading={isLoading}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={!!selectedDeleteId}
				onOpenChange={() => setSelectedDeleteId(null)}
			>
				<ModalContent>
					<ModalHeader>Confirmar eliminación</ModalHeader>
					<ModalBody>
						<p>¿Estás seguro de que deseas eliminar este desafío?</p>
						<div className="flex justify-end gap-2">
							<Button variant="light" onClick={() => setSelectedDeleteId(null)}>
								Cancelar
							</Button>
							<Button color="danger" onClick={confirmDelete}>
								Eliminar
							</Button>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
}
