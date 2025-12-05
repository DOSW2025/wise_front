import {
	Autocomplete,
	AutocompleteItem,
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
import type { Material } from '~/lib/types/api.types';
import type {
	Challenge,
	ObjectiveType,
	UserRole,
} from '~/lib/types/gamification.types';

interface ChallengeFormProps {
	challenge?: Challenge;
	onSubmit: (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => void;
	onCancel: () => void;
	isLoading?: boolean;
	materials?: Material[]; // Lista de materiales disponibles
}

const roles: { value: UserRole; label: string }[] = [
	{ value: 'student', label: 'Estudiantes' },
	{ value: 'tutor', label: 'Tutores/Docentes' },
	{ value: 'both', label: 'Ambos' },
];

export function ChallengeForm({
	challenge,
	onSubmit,
	onCancel,
	isLoading = false,
	materials = [],
}: ChallengeFormProps) {
	const [formData, setFormData] = useState({
		titulo: challenge?.titulo || '',
		descripcion: challenge?.descripcion || '',
		recompensaXP: challenge?.recompensaXP || 50,
		icon: challenge?.icon || '🎯',
		inicioDate: challenge?.periodo?.inicio?.split('T')[0] || '',
		finDate: challenge?.periodo?.fin?.split('T')[0] || '',
		targetRole: challenge?.targetRole || ('student' as UserRole),
	});

	const [objetivos, setObjetivos] = useState<
		Array<{
			descripcion: string;
			tipo: ObjectiveType;
			materialId?: string;
			materialNombre?: string;
			count?: number;
		}>
	>(
		challenge?.objetivos?.map((obj) => ({
			descripcion: obj.descripcion,
			tipo: obj.tipo || 'custom',
			materialId: obj.materialId,
			materialNombre: obj.materialNombre,
			count: obj.count,
		})) || [
			{ descripcion: '', tipo: 'custom' },
			{ descripcion: '', tipo: 'custom' },
			{ descripcion: '', tipo: 'custom' },
		],
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const objetivosValidos = objetivos
			.filter((obj) => obj.descripcion.trim() !== '')
			.map((obj) => ({
				descripcion: obj.descripcion,
				completado: false,
				tipo: obj.tipo,
				materialId: obj.materialId,
				materialNombre: obj.materialNombre,
				count: obj.count,
			}));

		onSubmit({
			titulo: formData.titulo,
			descripcion: formData.descripcion,
			recompensaXP: Number(formData.recompensaXP),
			objetivos: objetivosValidos,
			icon: formData.icon,
			targetRole: formData.targetRole,
			periodo: {
				inicio: new Date(formData.inicioDate).toISOString(),
				fin: new Date(formData.finDate).toISOString(),
			},
		});
	};

	const updateObjetivo = (
		index: number,
		field: string,
		value: string | number,
	) => {
		const newObjetivos = [...objetivos];
		newObjetivos[index] = { ...newObjetivos[index], [field]: value };
		setObjetivos(newObjetivos);
	};

	const handleTipoChange = (index: number, tipo: ObjectiveType) => {
		const newObjetivos = [...objetivos];
		newObjetivos[index] = {
			...newObjetivos[index],
			tipo,
			materialId: undefined,
			materialNombre: undefined,
			count: tipo === 'material' ? 1 : undefined,
		};
		setObjetivos(newObjetivos);
	};

	const handleMaterialSelect = (index: number, materialId: string) => {
		const material = materials.find((m) => m.id === materialId);
		if (material) {
			const newObjetivos = [...objetivos];
			newObjetivos[index] = {
				...newObjetivos[index],
				materialId: material.id,
				materialNombre: material.nombre,
				descripcion: `Completar material: ${material.nombre}`,
			};
			setObjetivos(newObjetivos);
		}
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

					<Select
						label="Dirigido a"
						selectedKeys={[formData.targetRole]}
						onChange={(e) =>
							setFormData({
								...formData,
								targetRole: e.target.value as UserRole,
							})
						}
						description="Selecciona a quién aplica este desafío"
						isRequired
					>
						{roles.map((role) => (
							<SelectItem key={role.value}>{role.label}</SelectItem>
						))}
					</Select>

					<div className="bg-default-50 p-4 rounded-lg space-y-4">
						<h4 className="font-semibold text-sm">Objetivos</h4>
						{objetivos.map((objetivo, index) => (
							<div
								key={index}
								className="bg-white p-3 rounded-lg space-y-3 border border-default-200"
							>
								<div className="flex items-center gap-2">
									<span className="text-xs font-medium text-default-500">
										Objetivo {index + 1}
									</span>
								</div>

								<Select
									label="Tipo de Objetivo"
									placeholder="Selecciona un tipo"
									selectedKeys={[objetivo.tipo]}
									onChange={(e) =>
										handleTipoChange(index, e.target.value as ObjectiveType)
									}
								>
									<SelectItem key="custom">Personalizado</SelectItem>
									<SelectItem key="material">Material Específico</SelectItem>
									<SelectItem key="tutoring">Tutoría</SelectItem>
								</Select>

								{objetivo.tipo === 'material' && (
									<>
										<Autocomplete
											label="Buscar Material"
											placeholder="Escribe para buscar..."
											defaultItems={materials}
											onSelectionChange={(key) =>
												handleMaterialSelect(index, key as string)
											}
										>
											{(material) => (
												<AutocompleteItem key={material.id}>
													{material.nombre} - {material.materia}
												</AutocompleteItem>
											)}
										</Autocomplete>
										<Input
											type="number"
											label="Cantidad"
											placeholder="1"
											value={String(objetivo.count || 1)}
											onChange={(e) =>
												updateObjetivo(index, 'count', Number(e.target.value))
											}
											min={1}
										/>
									</>
								)}

								<Input
									label={
										objetivo.tipo === 'material'
											? 'Descripción (generada automáticamente)'
											: 'Descripción'
									}
									placeholder="Describe el objetivo"
									value={objetivo.descripcion}
									onChange={(e) =>
										updateObjetivo(index, 'descripcion', e.target.value)
									}
									isReadOnly={
										objetivo.tipo === 'material' && !!objetivo.materialId
									}
								/>
							</div>
						))}
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
