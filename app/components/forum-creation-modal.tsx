import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from '@heroui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface ForumCreationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ForumFormData) => void;
}

interface ForumFormData {
	name: string;
	subject: string;
}

// Materias disponibles
const AVAILABLE_SUBJECTS = [
	{ key: 'matematicas', label: 'Matemáticas' },
	{ key: 'programacion', label: 'Programación' },
	{ key: 'fisica', label: 'Física' },
	{ key: 'quimica', label: 'Química' },
	{ key: 'ingles', label: 'Inglés' },
	{ key: 'historia', label: 'Historia' },
	{ key: 'literatura', label: 'Literatura' },
];

export function ForumCreationModal({
	isOpen,
	onClose,
	onSubmit,
}: ForumCreationModalProps) {
	const [formData, setFormData] = useState<ForumFormData>({
		name: '',
		subject: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	// Validación del nombre del foro
	const validateForumName = (name: string): string | null => {
		if (!name.trim()) {
			return 'El nombre del foro es obligatorio';
		}
		if (name.trim().length < 3) {
			return 'El nombre debe tener al menos 3 caracteres';
		}
		if (name.trim().length > 50) {
			return 'El nombre no puede exceder 50 caracteres';
		}
		if (!/^[a-zA-Z0-9\s\-áéíóúñÁÉÍÓÚÑ]+$/.test(name)) {
			return 'El nombre solo puede contener letras, números y guiones';
		}
		return null;
	};

	// Validación de materia
	const validateSubject = (subject: string): string | null => {
		if (!subject) {
			return 'Debe seleccionar una materia';
		}
		return null;
	};

	// Manejar cambio en el campo nombre
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFormData((prev) => ({ ...prev, name: value }));

		// Validar en tiempo real
		const error = validateForumName(value);
		setErrors((prev) => ({
			...prev,
			name: error || '',
		}));
	};

	// Manejar cambio en la materia
	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setFormData((prev) => ({ ...prev, subject: value }));

		// Validar
		const error = validateSubject(value);
		setErrors((prev) => ({
			...prev,
			subject: error || '',
		}));
	};

	// Validar formulario completo
	const validateForm = (): boolean => {
		const nameError = validateForumName(formData.name);
		const subjectError = validateSubject(formData.subject);

		const newErrors: Record<string, string> = {};
		if (nameError) newErrors.name = nameError;
		if (subjectError) newErrors.subject = subjectError;

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Manejar envío del formulario
	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		try {
			// Simular delay de creación (máximo 10 segundos según requisitos)
			await new Promise((resolve) => setTimeout(resolve, 1500));

			onSubmit(formData);
			setFormData({ name: '', subject: '' });
			setErrors({});
			onClose();
		} finally {
			setIsLoading(false);
		}
	};

	// Manejar cierre del modal
	const handleClose = () => {
		setFormData({ name: '', subject: '' });
		setErrors({});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="lg">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Plus className="w-5 h-5 text-primary" />
						<span className="text-xl font-bold text-foreground">
							Crear Nuevo Foro
						</span>
					</div>
					<p className="text-sm text-default-500 font-normal mt-1">
						Crea un espacio de comunicación temático para discutir sobre una
						materia
					</p>
				</ModalHeader>

				<ModalBody className="gap-6 py-4">
					{/* Campo Nombre del Foro */}
					<div className="space-y-2">
						<label
							htmlFor="forum-name"
							className="text-sm font-semibold text-foreground"
						>
							Nombre del Foro
						</label>
						<Input
							id="forum-name"
							placeholder="ej: Dudas de Álgebra Lineal"
							value={formData.name}
							onChange={handleNameChange}
							isInvalid={!!errors.name}
							errorMessage={errors.name}
							color={
								errors.name ? 'danger' : formData.name ? 'success' : 'default'
							}
							variant="bordered"
							size="lg"
							isClearable
							onClear={() => {
								setFormData((prev) => ({ ...prev, name: '' }));
								setErrors((prev) => ({ ...prev, name: '' }));
							}}
							classNames={{
								input: 'text-base',
								label: 'text-sm',
							}}
							description={
								formData.name && !errors.name ? (
									<span className="text-xs text-success">
										✓ Nombre válido ({formData.name.length}/50 caracteres)
									</span>
								) : null
							}
						/>
					</div>

					{/* Campo Materia */}
					<div className="space-y-2">
						<label
							htmlFor="forum-subject"
							className="text-sm font-semibold text-foreground"
						>
							Materia
						</label>
						<Select
							id="forum-subject"
							placeholder="Selecciona una materia"
							value={formData.subject}
							onChange={handleSubjectChange}
							isInvalid={!!errors.subject}
							errorMessage={errors.subject}
							color={
								errors.subject
									? 'danger'
									: formData.subject
										? 'success'
										: 'default'
							}
							variant="bordered"
							size="lg"
							classNames={{
								trigger: 'text-base',
								label: 'text-sm',
							}}
						>
							{AVAILABLE_SUBJECTS.map((subject) => (
								<SelectItem key={subject.key} value={subject.key}>
									{subject.label}
								</SelectItem>
							))}
						</Select>
					</div>

					{/* Información de ayuda */}
					<div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-2">
						<h4 className="text-sm font-semibold text-primary-700">
							📋 Información importante
						</h4>
						<ul className="text-xs text-primary-600 space-y-1">
							<li>✓ El foro se creará en máximo 10 segundos</li>
							<li>✓ El espacio estará vacío y disponible para tu comunidad</li>
							<li>
								✓ Podrás invitar a otros estudiantes y tutores a participar
							</li>
							<li>✓ Se aplicarán las reglas de la comunidad automáticamente</li>
						</ul>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button
						color="default"
						variant="light"
						onPress={handleClose}
						isDisabled={isLoading}
					>
						Cancelar
					</Button>
					<Button
						color="primary"
						onPress={handleSubmit}
						isLoading={isLoading}
						isDisabled={
							!formData.name ||
							!formData.subject ||
							!!errors.name ||
							!!errors.subject
						}
						startContent={!isLoading && <Plus className="w-4 h-4" />}
					>
						{isLoading ? 'Creando foro...' : 'Crear Foro'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
