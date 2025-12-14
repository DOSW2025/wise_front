import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import type { CreateSubjectDto, Subject } from '~/lib/types/materias.types';

interface MateriaFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateSubjectDto) => void;
	editingMateria?: Subject | null;
}

export function MateriaForm({
	isOpen,
	onClose,
	onSubmit,
	editingMateria,
}: MateriaFormProps) {
	const [formData, setFormData] = useState<CreateSubjectDto>({
		codigo: editingMateria?.codigo || '',
		nombre: editingMateria?.nombre || '',
	});

	const [errors, setErrors] = useState<{ codigo?: string; nombre?: string }>(
		{},
	);

	// Actualizar formulario cuando cambia editingMateria
	useEffect(() => {
		if (editingMateria) {
			setFormData({
				codigo: editingMateria.codigo,
				nombre: editingMateria.nombre,
			});
		} else {
			setFormData({ codigo: '', nombre: '' });
		}
		setErrors({});
	}, [editingMateria]);

	const validateForm = () => {
		const newErrors: { codigo?: string; nombre?: string } = {};

		if (!formData.codigo.trim()) {
			newErrors.codigo = 'El código es requerido';
		} else if (formData.codigo.length < 4) {
			newErrors.codigo = 'El código debe tener mínimo 4 caracteres';
		} else if (!/^[A-Z0-9]+$/.test(formData.codigo)) {
			newErrors.codigo =
				'El código solo puede contener letras MAYÚSCULAS y números sin espacios';
		}

		if (!formData.nombre.trim()) {
			newErrors.nombre = 'El nombre es requerido';
		} else if (formData.nombre.length < 3) {
			newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onSubmit(formData);
			handleClose();
		}
	};

	const handleClose = () => {
		setFormData({ codigo: '', nombre: '' });
		setErrors({});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="lg">
			<ModalContent>
				<ModalHeader>
					{editingMateria ? 'Editar Materia' : 'Nueva Materia'}
				</ModalHeader>
				<ModalBody>
					<div className="space-y-4">
						<Input
							label="Código"
							placeholder="Ej: DOSW o CALC1"
							value={formData.codigo}
							onChange={(e) => {
								const upperValue = e.target.value.toUpperCase();
								setFormData({ ...formData, codigo: upperValue });
								setErrors({ ...errors, codigo: undefined });
							}}
							isInvalid={!!errors.codigo}
							errorMessage={errors.codigo}
							description="Solo letras MAYÚSCULAS y números, mínimo 4 caracteres"
							isDisabled={!!editingMateria}
						/>
						<Input
							label="Nombre"
							placeholder="Ej: Desarrollo y Operaciones de Software"
							value={formData.nombre}
							onChange={(e) => {
								setFormData({ ...formData, nombre: e.target.value });
								setErrors({ ...errors, nombre: undefined });
							}}
							isInvalid={!!errors.nombre}
							errorMessage={errors.nombre}
							description="Mínimo 3 caracteres"
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={handleClose}>
						Cancelar
					</Button>
					<Button color="primary" onPress={handleSubmit}>
						{editingMateria ? 'Actualizar' : 'Crear'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
