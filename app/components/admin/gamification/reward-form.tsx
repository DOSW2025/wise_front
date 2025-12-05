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
import type { Reward, UserRole } from '~/lib/types/gamification.types';

interface RewardFormProps {
	reward?: Reward;
	onSubmit: (reward: Omit<Reward, 'id'>) => void; // Reward base no tiene unlocked ni claimed
	onCancel: () => void;
	isLoading?: boolean;
}

const roles: { value: UserRole; label: string }[] = [
	{ value: 'student', label: 'Estudiantes' },
	{ value: 'tutor', label: 'Tutores/Docentes' },
	{ value: 'both', label: 'Ambos' },
];

export function RewardForm({
	reward,
	onSubmit,
	onCancel,
	isLoading = false,
}: RewardFormProps) {
	const [formData, setFormData] = useState({
		title: reward?.title || '',
		description: reward?.description || '',
		icon: reward?.icon || 'Gift',
		pointsCost: reward?.pointsCost || 100,
		targetRole: reward?.targetRole || ('tutor' as UserRole),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSubmit({
			title: formData.title,
			description: formData.description,
			icon: formData.icon,
			pointsCost: Number(formData.pointsCost),
			targetRole: formData.targetRole,
		});
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					{reward ? 'Editar Beneficio' : 'Crear Beneficio'}
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
							label="Título del Beneficio"
							placeholder="Ej: Tutoría Premium Mensual"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							isRequired
						/>
						<Input
							label="Icono (nombre de icono)"
							placeholder="Ej: Gift, Star, Trophy"
							value={formData.icon}
							onChange={(e) =>
								setFormData({ ...formData, icon: e.target.value })
							}
						/>
					</div>

					<Textarea
						label="Descripción"
						placeholder="Describe el beneficio"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						isRequired
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Select
							label="Dirigido a"
							selectedKeys={[formData.targetRole]}
							onChange={(e) =>
								setFormData({
									...formData,
									targetRole: e.target.value as UserRole,
								})
							}
							description="Selecciona a quién aplica este beneficio"
							isRequired
						>
							{roles.map((role) => (
								<SelectItem key={role.value}>{role.label}</SelectItem>
							))}
						</Select>

						<Input
							type="number"
							label="Costo en Puntos"
							value={String(formData.pointsCost)}
							onChange={(e) =>
								setFormData({
									...formData,
									pointsCost: Number(e.target.value),
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
							{reward ? 'Actualizar' : 'Crear'} Beneficio
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
