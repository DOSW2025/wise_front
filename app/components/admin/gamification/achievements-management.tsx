import {
	Button,
	Card,
	CardBody,
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
	TableRow,
} from '@heroui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Achievement } from '~/lib/types/gamification.types';
import { AchievementForm } from './achievement-form';

interface AchievementsManagementProps {
	achievements: Achievement[];
	onAdd: (achievement: Omit<Achievement, 'id'>) => void;
	onUpdate: (id: string, achievement: Omit<Achievement, 'id'>) => void;
	onDelete: (id: string) => void;
	isLoading?: boolean;
}

export function AchievementsManagement({
	achievements,
	onAdd,
	onUpdate,
	onDelete,
	isLoading = false,
}: AchievementsManagementProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [editingAchievement, setEditingAchievement] = useState<
		Achievement | undefined
	>();
	const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

	const handleAdd = () => {
		setIsCreating(true);
		setEditingAchievement(undefined);
	};

	const handleEdit = (achievement: Achievement) => {
		setIsCreating(false);
		setEditingAchievement(achievement);
	};

	const handleSubmit = (achievement: Omit<Achievement, 'id'>) => {
		if (editingAchievement) {
			onUpdate(editingAchievement.id, achievement);
		} else {
			onAdd(achievement);
		}
		setIsCreating(false);
		setEditingAchievement(undefined);
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
					Gestión de Objetivos
				</h3>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onClick={handleAdd}
					isDisabled={isLoading}
				>
					Nuevo Objetivo
				</Button>
			</div>

			{(isCreating || editingAchievement) && (
				<AchievementForm
					achievement={editingAchievement}
					onSubmit={handleSubmit}
					onCancel={() => {
						setIsCreating(false);
						setEditingAchievement(undefined);
					}}
					isLoading={isLoading}
				/>
			)}

			<Card>
				<CardBody>
					<Table aria-label="Objetivos">
						<TableHeader>
							<TableColumn>TÍTULO</TableColumn>
							<TableColumn>DESCRIPCIÓN</TableColumn>
							<TableColumn>META</TableColumn>
							<TableColumn>RECOMPENSA</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody>
							{achievements.map((achievement) => (
								<TableRow key={achievement.id}>
									<TableCell>
										<span className="font-semibold">{achievement.title}</span>
									</TableCell>
									<TableCell className="text-sm text-default-500">
										{achievement.description}
									</TableCell>
									<TableCell>
										<Chip size="sm" color="default" variant="flat">
											{achievement.target}
										</Chip>
									</TableCell>
									<TableCell>
										<Chip size="sm" color="success" variant="flat">
											+{achievement.reward} pts
										</Chip>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleEdit(achievement)}
												isDisabled={isLoading}
											>
												<Edit2 className="w-4 h-4 text-primary" />
											</Button>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleDelete(achievement.id)}
												isDisabled={isLoading}
											>
												<Trash2 className="w-4 h-4 text-danger" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			<Modal
				isOpen={!!selectedDeleteId}
				onOpenChange={() => setSelectedDeleteId(null)}
			>
				<ModalContent>
					<ModalHeader>Confirmar eliminación</ModalHeader>
					<ModalBody>
						<p>¿Estás seguro de que deseas eliminar este objetivo?</p>
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
