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
} from '@heroui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { TutorReward } from '~/lib/types/tutor-gamification.types';
import { RewardForm } from './reward-form';

interface RewardsManagementProps {
	rewards: TutorReward[];
	onAdd: (reward: Omit<TutorReward, 'id' | 'unlocked' | 'claimed'>) => void;
	onUpdate: (
		id: string,
		reward: Omit<TutorReward, 'id' | 'unlocked' | 'claimed'>,
	) => void;
	onDelete: (id: string) => void;
	isLoading?: boolean;
}

export function RewardsManagement({
	rewards,
	onAdd,
	onUpdate,
	onDelete,
	isLoading = false,
}: RewardsManagementProps) {
	const [editingReward, setEditingReward] = useState<TutorReward | undefined>();
	const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

	const handleAdd = () => {
		setEditingReward(undefined);
	};

	const handleEdit = (reward: TutorReward) => {
		setEditingReward(reward);
	};

	const handleSubmit = (
		reward: Omit<TutorReward, 'id' | 'unlocked' | 'claimed'>,
	) => {
		if (editingReward) {
			onUpdate(editingReward.id, reward);
		} else {
			onAdd(reward);
		}
		setEditingReward(undefined);
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
					Gestión de Beneficios
				</h3>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onClick={handleAdd}
					isDisabled={isLoading}
				>
					Nuevo Beneficio
				</Button>
			</div>

			{editingReward !== undefined && (
				<RewardForm
					reward={editingReward}
					onSubmit={handleSubmit}
					onCancel={() => setEditingReward(undefined)}
					isLoading={isLoading}
				/>
			)}

			<Card>
				<CardBody>
					<Table aria-label="Beneficios">
						<TableHeader>
							<TableColumn>TÍTULO</TableColumn>
							<TableColumn>DESCRIPCIÓN</TableColumn>
							<TableColumn>COSTO</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody>
							{rewards.map((reward) => (
								<tr key={reward.id}>
									<TableCell>
										<span className="font-semibold">{reward.title}</span>
									</TableCell>
									<TableCell className="text-sm text-default-500">
										{reward.description}
									</TableCell>
									<TableCell>
										<Chip size="sm" color="warning" variant="flat">
											{reward.pointsCost} puntos
										</Chip>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleEdit(reward)}
												isDisabled={isLoading}
											>
												<Edit2 className="w-4 h-4 text-primary" />
											</Button>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleDelete(reward.id)}
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

			<Modal
				isOpen={!!selectedDeleteId}
				onOpenChange={() => setSelectedDeleteId(null)}
			>
				<ModalContent>
					<ModalHeader>Confirmar eliminación</ModalHeader>
					<ModalBody>
						<p>¿Estás seguro de que deseas eliminar este beneficio?</p>
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
