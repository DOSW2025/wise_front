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
import { CheckCircle, FileText, Upload, X } from 'lucide-react';
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
		descripcion: '',
	});
	const [file, setFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isDragOver, setIsDragOver] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const { data: subjects = [] } = useSubjects();
	const createMaterial = useCreateMaterial();

	const allowedTypes = ['application/pdf'];
	const maxSize = 10 * 1024 * 1024; // 10MB

	const validateFile = (selectedFile: File) => {
		const newErrors: Record<string, string> = {};

		if (!selectedFile) {
			newErrors.file = 'Debe seleccionar un archivo';
			return newErrors;
		}

		if (!allowedTypes.includes(selectedFile.type)) {
			newErrors.file = 'Formato no permitido. Solo se aceptan archivos PDF';
		}

		if (selectedFile.size > maxSize) {
			newErrors.file = 'El archivo es demasiado grande. Máximo 10MB';
		}

		if (selectedFile.size === 0) {
			newErrors.file = 'El archivo está vacío o es inválido';
		}

		return newErrors;
	};

	const handleFileSelect = (selectedFile: File) => {
		const fileErrors = validateFile(selectedFile);
		if (Object.keys(fileErrors).length === 0) {
			setFile(selectedFile);
			setErrors((prev) => ({ ...prev, file: '' }));
		} else {
			setErrors((prev) => ({ ...prev, ...fileErrors }));
			setFile(null);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			handleFileSelect(selectedFile);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			handleFileSelect(droppedFile);
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.nombre.trim()) {
			newErrors.nombre = 'El título es requerido';
		} else if (formData.nombre.trim().length < 3) {
			newErrors.nombre = 'El título debe tener al menos 3 caracteres';
		}

		if (!formData.materia) {
			newErrors.materia = 'La materia es requerida';
		}

		if (formData.descripcion.length > 300) {
			newErrors.descripcion =
				'La descripción no puede superar los 300 caracteres';
		}

		if (!file) {
			newErrors.file = 'Debe seleccionar un archivo PDF';
		}

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
				semestre: 1,
				descripcion: formData.descripcion,
				file,
			});

			clearInterval(interval);
			setUploadProgress(100);
			setShowSuccess(true);

			setTimeout(() => {
				onSuccess?.();
				onClose();
			}, 2000);
		} catch (error: unknown) {
			let errorMessage = 'Error al subir el material. Intente nuevamente.';

			if (error instanceof Error) {
				if (error.message.includes('network')) {
					errorMessage = 'Error de conexión. Verifique su internet.';
				} else if (error.message.includes('size')) {
					errorMessage = 'El archivo es demasiado grande.';
				} else if (error.message.includes('format')) {
					errorMessage = 'Formato de archivo no válido.';
				}
			}

			setErrors({ submit: errorMessage });
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
						label="Título del material"
						placeholder="Ej: Introducción a Algoritmos"
						value={formData.nombre}
						onValueChange={(value) => {
							setFormData((prev) => ({ ...prev, nombre: value }));
							// Clear error when user types and meets requirements
							if (value.trim().length >= 3 && errors.nombre) {
								setErrors((prev) => ({ ...prev, nombre: '' }));
							}
						}}
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

					<Textarea
						label="Descripción (opcional)"
						placeholder="Descripción del material..."
						value={formData.descripcion}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, descripcion: value }))
						}
						maxRows={3}
						isInvalid={!!errors.descripcion}
						errorMessage={errors.descripcion}
						description={`${formData.descripcion.length}/300 caracteres`}
					/>

					<div className="space-y-2">
						<label htmlFor="file-upload" className="block text-sm font-medium">
							Archivo PDF <span className="text-danger">*</span>
						</label>
						<button
							type="button"
							className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
								file
									? 'border-[#8B1A1A] bg-red-50'
									: isDragOver
										? 'border-[#8B1A1A] bg-red-50'
										: 'border-default-300 hover:border-default-400'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							<input
								type="file"
								accept=".pdf"
								onChange={handleFileChange}
								className="hidden"
								id="file-upload"
							/>
							<label htmlFor="file-upload" className="cursor-pointer">
								{file ? (
									<div className="flex flex-col items-center">
										<FileText className="w-8 h-8 mx-auto mb-2 text-[#8B1A1A]" />
										<p className="text-sm text-[#8B1A1A] font-medium">
											{file.name}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Archivo seleccionado correctamente
										</p>
									</div>
								) : (
									<div>
										<Upload className="w-8 h-8 mx-auto mb-2 text-default-400" />
										<p className="text-sm text-default-600">
											Arrastra tu archivo PDF aquí o haz clic para seleccionar
										</p>
										<p className="text-xs text-default-400 mt-1">
											Solo archivos PDF (máx. 10MB)
										</p>
									</div>
								)}
							</label>
						</button>
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
							<Progress
								value={uploadProgress}
								color="primary"
								className="[&_[data-filled=true]]:bg-[#8B1A1A]"
							/>
						</div>
					)}

					{showSuccess && (
						<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
							<CheckCircle className="w-5 h-5 text-green-600" />
							<p className="text-sm text-green-700 font-medium">
								Material cargado exitosamente
							</p>
						</div>
					)}

					{errors.submit && (
						<p className="text-sm text-danger">{errors.submit}</p>
					)}

					<div className="flex gap-3 pt-4">
						<Button
							className="bg-[#8B1A1A] text-white"
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
