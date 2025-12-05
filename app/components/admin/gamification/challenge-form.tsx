import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Textarea,
} from '@heroui/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { Challenge } from '~/lib/types/gamification.types';

interface ChallengeFormProps {
	challenge?: Challenge;
	onSubmit: (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function ChallengeForm({
	challenge,
	onSubmit,
	onCancel,
	isLoading = false,
}: ChallengeFormProps) {
	const [formData, setFormData] = useState({
		titulo: challenge?.titulo || '',
		descripcion: challenge?.descripcion || '',
		recompensaXP: challenge?.recompensaXP || 50,
		objetivo1: challenge?.objetivos?.[0]?.descripcion || '',
		objetivo2: challenge?.objetivos?.[1]?.descripcion || '',
		objetivo3: challenge?.objetivos?.[2]?.descripcion || '',
		icon: challenge?.icon || '🎯',
		inicioDate: challenge?.periodo?.inicio?.split('T')[0] || '',
		finDate: challenge?.periodo?.fin?.split('T')[0] || '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const objetivos = [
			formData.objetivo1,
			formData.objetivo2,
			formData.objetivo3,
		]
			.filter(Boolean)
			.map((descripcion) => ({
				descripcion,
				completado: false,
			}));

		onSubmit({
			titulo: formData.titulo,
			descripcion: formData.descripcion,
			recompensaXP: Number(formData.recompensaXP),
			objetivos,
			icon: formData.icon,
			periodo: {
				inicio: new Date(formData.inicioDate).toISOString(),
				fin: new Date(formData.finDate).toISOString(),
			},
		});
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					{challenge ? 'Editar Desafío' : 'Crear Desafío'}
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
							label="Título del Desafío"
							placeholder="Ej: Maestro del Backend"
							value={formData.titulo}
							onChange={(e) =>
								setFormData({ ...formData, titulo: e.target.value })
							}
							isRequired
						/>
						<Input
							label="Icono"
							placeholder="Ej: 🎯"
							value={formData.icon}
							onChange={(e) =>
								setFormData({ ...formData, icon: e.target.value })
							}
						/>
					</div>

					<Textarea
						label="Descripción"
						placeholder="Describe el desafío"
						value={formData.descripcion}
						onChange={(e) =>
							setFormData({ ...formData, descripcion: e.target.value })
						}
						isRequired
					/>

					<div className="bg-default-50 p-4 rounded-lg space-y-3">
						<h4 className="font-semibold text-sm">Objetivos</h4>
						<Input
							label="Objetivo 1"
							placeholder="Primer objetivo"
							value={formData.objetivo1}
							onChange={(e) =>
								setFormData({ ...formData, objetivo1: e.target.value })
							}
						/>
						<Input
							label="Objetivo 2"
							placeholder="Segundo objetivo"
							value={formData.objetivo2}
							onChange={(e) =>
								setFormData({ ...formData, objetivo2: e.target.value })
							}
						/>
						<Input
							label="Objetivo 3"
							placeholder="Tercer objetivo"
							value={formData.objetivo3}
							onChange={(e) =>
								setFormData({ ...formData, objetivo3: e.target.value })
							}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Input
							type="number"
							label="Recompensa XP"
							value={String(formData.recompensaXP)}
							onChange={(e) =>
								setFormData({
									...formData,
									recompensaXP: Number(e.target.value),
								})
							}
							isRequired
						/>
						<Input
							type="date"
							label="Fecha Inicio"
							value={formData.inicioDate}
							onChange={(e) =>
								setFormData({ ...formData, inicioDate: e.target.value })
							}
							isRequired
						/>
						<Input
							type="date"
							label="Fecha Fin"
							value={formData.finDate}
							onChange={(e) =>
								setFormData({ ...formData, finDate: e.target.value })
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
							{challenge ? 'Actualizar' : 'Crear'} Desafío
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
