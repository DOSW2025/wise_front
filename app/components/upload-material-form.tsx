/**
 * Upload Material Form Component
 * Formulario para subir materiales con validaciones
 */

import {
	Button,
	Card,
	CardBody,
	Input,
	Progress,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useCreateMaterial, useSubjects } from '~/lib/hooks/useMaterials';

interface UploadMaterialFormProps {
	onClose: () => void;
	onSuccess?: () => void;
}

export function UploadMaterialForm({
	onClose,
	onSuccess,
}: UploadMaterialFormProps) {
	const [formData, setFormData] = useState({
		nombre: '',
		materia: '',
		semestre: '',
		descripcion: '',
	});
	const [file, setFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data: subjects = [] } = useSubjects();
	const createMaterial = useCreateMaterial();

	const allowedTypes = ['application/pdf'];
	const maxSize = 10 * 1024 * 1024; // 10MB

	const validateFile = (selectedFile: File) => {
		const newErrors: Record<string, string> = {};

		if (!allowedTypes.includes(selectedFile.type)) {
			newErrors.file = 'Solo se permiten archivos PDF';
		}

		if (selectedFile.size > maxSize) {
			newErrors.file = 'El archivo no puede superar los 10MB';
		}

		return newErrors;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			const fileErrors = validateFile(selectedFile);
			if (Object.keys(fileErrors).length === 0) {
				setFile(selectedFile);
				setErrors((prev) => ({ ...prev, file: '' }));
			} else {
				setErrors((prev) => ({ ...prev, ...fileErrors }));
				setFile(null);
			}
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
		if (!formData.materia) newErrors.materia = 'La materia es requerida';
		if (!formData.semestre) newErrors.semestre = 'El semestre es requerido';
		if (!file) newErrors.file = 'Debe seleccionar un archivo';

		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		if (!file) return;

		try {
			// Simular progreso de subida
			setUploadProgress(0);
			const interval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev >= 90) {
						clearInterval(interval);
						return 90;
					}
					return prev + 10;
				});
			}, 200);

			await createMaterial.mutateAsync({
				nombre: formData.nombre,
				materia: formData.materia,
				tipo: 'PDF',
				semestre: Number(formData.semestre),
				descripcion: formData.descripcion,
				file,
			});

			clearInterval(interval);
			setUploadProgress(100);

			setTimeout(() => {
				onSuccess?.();
				onClose();
			}, 500);
		} catch (_error) {
			setErrors({ submit: 'Error al subir el material. Intente nuevamente.' });
			setUploadProgress(0);
		}
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardBody className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold">Subir Material</h3>
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
							<SelectItem key={subject.nombre} value={subject.nombre}>
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
							<SelectItem key={semester} value={semester}>
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

					<div className="space-y-2">
						<label htmlFor="file-upload" className="block text-sm font-medium">
							Archivo <span className="text-danger">*</span>
						</label>
						<div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center">
							<input
								type="file"
								accept=".pdf"
								onChange={handleFileChange}
								className="hidden"
								id="file-upload"
							/>
							<label htmlFor="file-upload" className="cursor-pointer">
								<Upload className="w-8 h-8 mx-auto mb-2 text-default-400" />
								<p className="text-sm text-default-600">
									{file ? file.name : 'Haz clic para seleccionar un archivo'}
								</p>
								<p className="text-xs text-default-400 mt-1">
									Solo archivos PDF (máx. 10MB)
								</p>
							</label>
						</div>
						{errors.file && (
							<p className="text-xs text-danger">{errors.file}</p>
						)}
					</div>

					{uploadProgress > 0 && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Subiendo archivo...</span>
								<span>{uploadProgress}%</span>
							</div>
							<Progress value={uploadProgress} color="primary" />
						</div>
					)}

					{errors.submit && (
						<p className="text-sm text-danger">{errors.submit}</p>
					)}

					<div className="flex gap-3 pt-4">
						<Button
							color="primary"
							type="submit"
							isLoading={createMaterial.isPending}
							isDisabled={uploadProgress > 0 && uploadProgress < 100}
						>
							Subir Material
						</Button>
						<Button
							variant="bordered"
							onPress={onClose}
							isDisabled={createMaterial.isPending}
						>
							Cancelar
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
