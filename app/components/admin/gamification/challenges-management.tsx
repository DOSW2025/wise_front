import {
	Button,
	Card,
	CardBody,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Material } from '~/lib/types/api.types';
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
}: Readonly<ChallengesManagementProps>) {
	type MaybeChallenge = Challenge | undefined;

	const [isCreating, setIsCreating] = useState(false);
	const [editingChallenge, setEditingChallenge] = useState<MaybeChallenge>();
	const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
	const [materials, setMaterials] = useState<Material[]>([]);
	const [, setLoadingMaterials] = useState(false);

	// Cargar materiales disponibles
	useEffect(() => {
		const fetchMaterials = async () => {
			setLoadingMaterials(true);
			try {
				const response = await fetch('/api/materials');
				if (response.ok) {
					const data = await response.json();
					setMaterials(data.materials || []);
				}
			} catch (error) {
				console.error('Error al cargar materiales:', error);
			} finally {
				setLoadingMaterials(false);
			}
		};

		if (isCreating || editingChallenge) {
			fetchMaterials();
		}
	}, [isCreating, editingChallenge]);

	const handleAdd = () => {
		setIsCreating(true);
		setEditingChallenge(undefined);
	};

	const handleEdit = (challenge: Challenge) => {
		setIsCreating(false);
		setEditingChallenge(challenge);
	};

	const handleSubmit = (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => {
		if (editingChallenge) {
			onUpdate(editingChallenge.id, challenge);
		} else {
			onAdd(challenge);
		}
		setIsCreating(false);
		setEditingChallenge(undefined);
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

			{(isCreating || editingChallenge) && (
				<ChallengeForm
					challenge={editingChallenge}
					onSubmit={handleSubmit}
					onCancel={() => {
						setIsCreating(false);
						setEditingChallenge(undefined);
					}}
					isLoading={isLoading}
					materials={materials}
				/>
			)}

			<Card>
				<CardBody>
					<Table aria-label="Desafíos">
						<TableHeader>
							<TableColumn>TÍTULO</TableColumn>
							<TableColumn>XP</TableColumn>
							<TableColumn>OBJETIVOS</TableColumn>
							<TableColumn>PERÍODO</TableColumn>
							<TableColumn>DIRIGIDO A</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody>
							{challenges.map((challenge) => (
								<TableRow key={challenge.id}>
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
										{(() => {
											let roleLabel = 'Ambos';
											if (challenge.targetRole === 'student')
												roleLabel = 'Estudiantes';
											else if (challenge.targetRole === 'tutor')
												roleLabel = 'Tutores';

											return (
												<Chip size="sm" color="primary" variant="flat">
													{roleLabel}
												</Chip>
											);
										})()}
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
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{selectedDeleteId && (
				<Card className="border-danger-200 bg-danger-50 dark:bg-danger-900/20">
					<CardBody className="space-y-4">
						<p className="font-semibold">
							¿Estás seguro de que deseas eliminar este desafío?
						</p>
						<div className="flex justify-end gap-2">
							<Button variant="light" onClick={() => setSelectedDeleteId(null)}>
								Cancelar
							</Button>
							<Button color="danger" onClick={confirmDelete}>
								Eliminar
							</Button>
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
