/**
 * Edit Material Form Component
 * Formulario reutilizable para editar metadata de materiales
 */

import {
	Button,
	Card,
	CardBody,
	Input,
	Spinner,
	Textarea,
} from '@heroui/react';
import { Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMaterial, useUpdateMaterial } from '~/lib/hooks/useMaterials';

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
	const updateMaterial = useUpdateMaterial();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		file: null as File | null,
	});
	const [fileName, setFileName] = useState<string>('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Prellenar formulario cuando se carga el material
	useEffect(() => {
		if (material) {
			setFormData({
				title: material.nombre || '',
				description: material.descripcion || '',
				file: null,
			});
		}
	}, [material]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'El título es requerido';
		}

		return newErrors;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, file }));
			setFileName(file.name);
			setErrors((prev) => ({ ...prev, file: '' }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		try {
			const data = new FormData();
			data.append('title', formData.title);
			data.append('description', formData.description);
			if (formData.file) {
				data.append('file', formData.file);
			}

			await updateMaterial.mutateAsync({
				id: materialId,
				data,
			});

			onSuccess?.();
			onClose();
		} catch (error) {
			console.error('Error detallado:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Error al actualizar el material. Intente nuevamente.';
			setErrors({
				submit: errorMessage,
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
					{/* Archivo */}
					<div>
						<label
							htmlFor="file-input"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Archivo (opcional)
						</label>
						<input
							id="file-input"
							ref={fileInputRef}
							type="file"
							onChange={handleFileChange}
							className="hidden"
							accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
						/>
						<Button
							type="button"
							variant="bordered"
							className="w-full"
							startContent={<Upload className="w-4 h-4" />}
							onPress={() => fileInputRef.current?.click()}
						>
							{fileName || formData.file?.name || 'Seleccionar archivo'}
						</Button>
						{fileName && (
							<p className="text-sm text-success mt-2">✓ {fileName}</p>
						)}
						{errors.file && (
							<p className="text-sm text-danger mt-2">{errors.file}</p>
						)}
					</div>

					{/* Título */}
					<Input
						label="Título del material"
						placeholder="Ej: Introducción a Algoritmos"
						value={formData.title}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, title: value }))
						}
						isInvalid={!!errors.title}
						errorMessage={errors.title}
						isRequired
					/>

					{/* Descripción */}
					<Textarea
						label="Descripción (opcional)"
						placeholder="Descripción del material..."
						value={formData.description}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, description: value }))
						}
						maxRows={4}
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
