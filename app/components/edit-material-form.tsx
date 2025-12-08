/**
 * Edit Material Form Component
 * Formulario reutilizable para editar metadata de materiales
 */

import {
	Button,
	Card,
	CardBody,
	Input,
	Select,
	SelectItem,
	Spinner,
	Textarea,
} from '@heroui/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	useMaterial,
	useSubjects,
	useUpdateMaterial,
} from '~/lib/hooks/useMaterials';

interface EditMaterialFormProps {
	materialId: string;
	onClose: () => void;
	onSuccess?: () => void;
}

export function EditMaterialForm({
	materialId,
	onClose,
	onSuccess,
}: EditMaterialFormProps) {
	const { data: material, isLoading: isLoadingMaterial } =
		useMaterial(materialId);
	const { data: subjects = [] } = useSubjects();
	const updateMaterial = useUpdateMaterial();

	const [formData, setFormData] = useState({
		nombre: '',
		materia: '',
		semestre: '',
		descripcion: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Prellenar formulario cuando se carga el material
	useEffect(() => {
		if (material) {
			setFormData({
				nombre: material.nombre,
				materia: material.materia,
				semestre: material.semestre.toString(),
				descripcion: material.descripcion || '',
			});
		}
	}, [material]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
		if (!formData.materia) newErrors.materia = 'La materia es requerida';
		if (!formData.semestre) newErrors.semestre = 'El semestre es requerido';

		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		try {
			await updateMaterial.mutateAsync({
				id: materialId,
				data: {
					nombre: formData.nombre,
					materia: formData.materia,
					tipo: 'PDF',
					semestre: Number(formData.semestre),
					descripcion: formData.descripcion,
				},
			});

			onSuccess?.();
			onClose();
		} catch (_error) {
			setErrors({
				submit: 'Error al actualizar el material. Intente nuevamente.',
			});
		}
	};

	if (isLoadingMaterial) {
		return (
			<Card className="w-full max-w-2xl">
				<CardBody className="p-6">
					<div className="flex justify-center items-center py-12">
						<div className="text-center">
							<Spinner size="lg" color="primary" />
							<p className="mt-4 text-default-600">Cargando material...</p>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!material) {
		return (
			<Card className="w-full max-w-2xl">
				<CardBody className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-semibold">Error</h3>
						<Button isIconOnly variant="light" onPress={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>
					<p className="text-center text-danger py-8">
						No se pudo cargar el material. Intente nuevamente.
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-2xl">
			<CardBody className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold">Editar Material</h3>
					<Button isIconOnly variant="light" onPress={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Nombre del material"
						placeholder="Ej: Introducción a Algoritmos"
						value={formData.nombre}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, nombre: value }))
						}
						isInvalid={!!errors.nombre}
						errorMessage={errors.nombre}
						isRequired
					/>

					<Select
						label="Materia"
						placeholder="Seleccionar materia"
						selectedKeys={formData.materia ? [formData.materia] : []}
						onSelectionChange={(keys) => {
							const value = Array.from(keys)[0] as string;
							setFormData((prev) => ({ ...prev, materia: value }));
						}}
						isInvalid={!!errors.materia}
						errorMessage={errors.materia}
						isRequired
					>
						{subjects.map((subject) => (
							<SelectItem key={subject.nombre} textValue={subject.nombre}>
								{subject.nombre}
							</SelectItem>
						))}
					</Select>

					<Select
						label="Semestre"
						placeholder="Seleccionar semestre"
						selectedKeys={formData.semestre ? [formData.semestre] : []}
						onSelectionChange={(keys) => {
							const value = Array.from(keys)[0] as string;
							setFormData((prev) => ({ ...prev, semestre: value }));
						}}
						isInvalid={!!errors.semestre}
						errorMessage={errors.semestre}
						isRequired
					>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semester) => (
							<SelectItem key={semester} textValue={`Semestre ${semester}`}>
								Semestre {semester}
							</SelectItem>
						))}
					</Select>

					<Textarea
						label="Descripción (opcional)"
						placeholder="Descripción del material..."
						value={formData.descripcion}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, descripcion: value }))
						}
						maxRows={3}
					/>

					{errors.submit && (
						<p className="text-sm text-danger">{errors.submit}</p>
					)}

					<div className="flex gap-3 pt-4">
						<Button
							color="primary"
							type="submit"
							isLoading={updateMaterial.isPending}
						>
							Guardar Cambios
						</Button>
						<Button
							variant="bordered"
							onPress={onClose}
							isDisabled={updateMaterial.isPending}
						>
							Cancelar
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
