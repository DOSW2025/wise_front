import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { Achievement, UserRole } from '~/lib/types/gamification.types';

interface AchievementFormProps {
	achievement?: Achievement;
	onSubmit: (achievement: Omit<Achievement, 'id'>) => void; // Achievement base no tiene progress ni completed
	onCancel: () => void;
	isLoading?: boolean;
}

const roles: { value: UserRole; label: string }[] = [
	{ value: 'student', label: 'Estudiantes' },
	{ value: 'tutor', label: 'Tutores/Docentes' },
	{ value: 'both', label: 'Ambos' },
];

export function AchievementForm({
	achievement,
	onSubmit,
	onCancel,
	isLoading = false,
}: AchievementFormProps) {
	const [formData, setFormData] = useState({
		title: achievement?.title || '',
		description: achievement?.description || '',
		icon: achievement?.icon || 'Target',
		target: achievement?.target || 100,
		reward: achievement?.reward || 100,
		targetRole: achievement?.targetRole || ('tutor' as UserRole),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSubmit({
			title: formData.title,
			description: formData.description,
			icon: formData.icon,
			target: Number(formData.target),
			reward: Number(formData.reward),
			targetRole: formData.targetRole,
		});
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					{achievement ? 'Editar Objetivo' : 'Crear Objetivo'}
				</h3>
				<Button
					isIconOnly
					variant="light"
					onClick={onCancel}
					isDisabled={isLoading}
				>
					<X className="w-5 h-5" />
				</Button>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Título del Objetivo"
							placeholder="Ej: Sesiones Completas"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							isRequired
						/>
						<Input
							label="Icono (nombre de icono)"
							placeholder="Ej: Target, Users, Star"
							value={formData.icon}
							onChange={(e) =>
								setFormData({ ...formData, icon: e.target.value })
							}
						/>
					</div>

					<Textarea
						label="Descripción"
						placeholder="Describe el objetivo"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						isRequired
					/>

					<Select
						label="Dirigido a"
						selectedKeys={[formData.targetRole]}
						onChange={(e) =>
							setFormData({
								...formData,
								targetRole: e.target.value as UserRole,
							})
						}
						description="Selecciona a quién aplica este logro"
						isRequired
					>
						{roles.map((role) => (
							<SelectItem key={role.value}>{role.label}</SelectItem>
						))}
					</Select>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							type="number"
							label="Meta a Alcanzar"
							value={String(formData.target)}
							onChange={(e) =>
								setFormData({
									...formData,
									target: Number(e.target.value),
								})
							}
							isRequired
						/>
						<Input
							type="number"
							label="Puntos de Recompensa"
							value={String(formData.reward)}
							onChange={(e) =>
								setFormData({
									...formData,
									reward: Number(e.target.value),
								})
							}
							isRequired
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							color="default"
							variant="light"
							onClick={onCancel}
							isDisabled={isLoading}
						>
							Cancelar
						</Button>
						<Button color="primary" type="submit" isLoading={isLoading}>
							{achievement ? 'Actualizar' : 'Crear'} Objetivo
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
