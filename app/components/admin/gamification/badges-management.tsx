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
	useDisclosure,
} from '@heroui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Badge } from '~/lib/types/gamification.types';
import { BadgeForm } from './badge-form';

interface BadgesManagementProps {
	badges: Badge[];
	onAdd: (badge: Omit<Badge, 'id' | 'earnedAt'>) => void;
	onUpdate: (id: string, badge: Omit<Badge, 'id' | 'earnedAt'>) => void;
	onDelete: (id: string) => void;
	isLoading?: boolean;
}

const tierColors = {
	bronze: 'warning',
	silver: 'default',
	gold: 'success',
} as const;

export function BadgesManagement({
	badges,
	onAdd,
	onUpdate,
	onDelete,
	isLoading = false,
}: BadgesManagementProps) {
	const { isOpen, onOpenChange } = useDisclosure();
	const [editingBadge, setEditingBadge] = useState<Badge | undefined>();
	const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

	const handleAdd = () => {
		setEditingBadge(undefined);
	};

	const handleEdit = (badge: Badge) => {
		setEditingBadge(badge);
	};

	const handleSubmit = (badge: Omit<Badge, 'id' | 'earnedAt'>) => {
		if (editingBadge) {
			onUpdate(editingBadge.id, badge);
		} else {
			onAdd(badge);
		}
		setEditingBadge(undefined);
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
					Gestión de Insignias
				</h3>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onClick={handleAdd}
					isDisabled={isLoading}
				>
					Nueva Insignia
				</Button>
			</div>

			{editingBadge || !editingBadge ? (
				<BadgeForm
					badge={editingBadge}
					onSubmit={handleSubmit}
					onCancel={() => setEditingBadge(undefined)}
					isLoading={isLoading}
				/>
			) : null}

			<Card>
				<CardBody>
					<Table aria-label="Insignias">
						<TableHeader>
							<TableColumn>ICONO</TableColumn>
							<TableColumn>NOMBRE</TableColumn>
							<TableColumn>CÓDIGO</TableColumn>
							<TableColumn>DESCRIPCIÓN</TableColumn>
							<TableColumn>NIVEL</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody>
							{badges.map((badge) => (
								<tr key={badge.id}>
									<TableCell>
										<div className="text-2xl">{badge.icon}</div>
									</TableCell>
									<TableCell>
										<span className="font-semibold">{badge.nombre}</span>
									</TableCell>
									<TableCell>
										<code className="text-sm">{badge.code}</code>
									</TableCell>
									<TableCell className="text-sm text-default-500">
										{badge.descripcion}
									</TableCell>
									<TableCell>
										<Chip
											size="sm"
											color={tierColors[badge.tier]}
											variant="flat"
										>
											{badge.tier.toUpperCase()}
										</Chip>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleEdit(badge)}
												isDisabled={isLoading}
											>
												<Edit2 className="w-4 h-4 text-primary" />
											</Button>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onClick={() => handleDelete(badge.id)}
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
						<p>¿Estás seguro de que deseas eliminar esta insignia?</p>
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
