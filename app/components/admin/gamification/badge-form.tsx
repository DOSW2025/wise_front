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
import type {
	Badge,
	BadgeTier,
	UserRole,
} from '~/lib/types/gamification.types';

interface BadgeFormProps {
	badge?: Badge;
	onSubmit: (badge: Omit<Badge, 'id'>) => void; // Badge base no tiene earnedAt
	onCancel: () => void;
	isLoading?: boolean;
}

const tiers: BadgeTier[] = ['bronze', 'silver', 'gold'];

const roles: { value: UserRole; label: string }[] = [
	{ value: 'student', label: 'Estudiantes' },
	{ value: 'tutor', label: 'Tutores/Docentes' },
	{ value: 'both', label: 'Ambos' },
];

export function BadgeForm({
	badge,
	onSubmit,
	onCancel,
	isLoading = false,
}: BadgeFormProps) {
	const [formData, setFormData] = useState({
		code: badge?.code || '',
		nombre: badge?.nombre || '',
		descripcion: badge?.descripcion || '',
		tier: badge?.tier || ('bronze' as BadgeTier),
		targetRole: badge?.targetRole || ('student' as UserRole),
		icon: badge?.icon || '🏅',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSubmit({
			code: formData.code.toLowerCase().replace(/\s+/g, '_'),
			nombre: formData.nombre,
			descripcion: formData.descripcion,
			tier: formData.tier,
			targetRole: formData.targetRole,
			icon: formData.icon,
		});
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					{badge ? 'Editar Insignia' : 'Crear Insignia'}
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
							label="Código de Insignia"
							placeholder="Ej: maestro_frontend, experto_react"
							value={formData.code}
							onChange={(e) =>
								setFormData({ ...formData, code: e.target.value })
							}
							description="Código único en minúsculas y guiones bajos"
							isRequired
						/>
						<Input
							label="Icono"
							placeholder="Ej: 🏅"
							value={formData.icon}
							onChange={(e) =>
								setFormData({ ...formData, icon: e.target.value })
							}
						/>
					</div>

					<Input
						label="Nombre de la Insignia"
						placeholder="Ej: Explorador"
						value={formData.nombre}
						onChange={(e) =>
							setFormData({ ...formData, nombre: e.target.value })
						}
						isRequired
					/>

					<Textarea
						label="Descripción"
						placeholder="Describe cómo obtener esta insignia"
						value={formData.descripcion}
						onChange={(e) =>
							setFormData({ ...formData, descripcion: e.target.value })
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
							description="Selecciona a quién aplica esta insignia"
							isRequired
						>
							{roles.map((role) => (
								<SelectItem key={role.value}>{role.label}</SelectItem>
							))}
						</Select>

						<Select
							label="Nivel de Insignia"
							selectedKeys={[formData.tier]}
							onChange={(e) =>
								setFormData({
									...formData,
									tier: e.target.value as BadgeTier,
								})
							}
							isRequired
						>
							{tiers.map((tier) => (
								<SelectItem key={tier}>
									{tier.charAt(0).toUpperCase() + tier.slice(1)}
								</SelectItem>
							))}
						</Select>
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
							{badge ? 'Actualizar' : 'Crear'} Insignia
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
