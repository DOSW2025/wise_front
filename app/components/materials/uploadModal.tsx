import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { Upload } from 'lucide-react';
import { semesters, subjects, type UploadFormState } from './types';

interface UploadModalProps {
	isOpen: boolean;
	uploadForm: UploadFormState;
	onClose: () => void;
	onSubmit: () => void;
	onFormChange: (updates: Partial<UploadFormState>) => void;
	onFileChange: (file: File) => void;
}

export default function UploadModal({
	isOpen,
	uploadForm,
	onClose,
	onSubmit,
	onFormChange,
	onFileChange,
}: UploadModalProps) {
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onFileChange(file);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<ModalContent>
				<ModalHeader>
					<h2 className="text-xl font-semibold">Subir material académico</h2>
				</ModalHeader>

				<ModalBody>
					<p className="text-sm text-gray-600 mb-4">
						Comparte recursos con la comunidad ECIWISE+
					</p>

					<div className="space-y-4">
						{/* Selector de tipo de archivo */}
						<div>
							<div className="text-sm font-medium mb-2">
								{' '}
								{/* Cambiado de label a div */}
								Tipo de archivo *
							</div>
							<div className="grid grid-cols-3 md:grid-cols-6 gap-2">
								{['PDF', 'DOC', 'XLSX', 'PPT', 'IMG', 'VIDEO'].map((type) => (
									<Button
										key={type}
										variant={
											uploadForm.fileType === type ? 'solid' : 'bordered'
										}
										className={`w-full ${uploadForm.fileType === type ? 'bg-[#8B1A1A] text-white' : ''}`}
										onClick={() => onFormChange({ fileType: type })}
										type="button"
									>
										{type}
									</Button>
								))}
							</div>
						</div>

						{/* Campo para cargar archivo */}
						<div>
							<div className="text-sm font-medium mb-2">
								{' '}
								{/* Cambiado de label a div */}
								Archivo *
							</div>
							<div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-[#8B1A1A] transition-colors">
								<Upload className="mx-auto mb-2 text-gray-400" size={32} />
								<p className="text-sm text-gray-600 mb-2">
									Arrastra tu archivo aquí o{' '}
									<label
										htmlFor="file-upload"
										className="text-[#8B1A1A] cursor-pointer underline"
									>
										{' '}
										{/* Agregado htmlFor */}
										haz clic para seleccionar
										<input
											id="file-upload"
											type="file"
											className="hidden"
											onChange={handleFileInputChange}
											accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx,.jpg,.png,.mp4"
										/>
									</label>
								</p>
								<p className="text-xs text-gray-500">
									PDF, DOC, XLSX, PPT, IMG o VIDEO (máx. 50MB)
								</p>
								{uploadForm.file && (
									<Chip
										className="mt-2"
										onClose={() => onFormChange({ file: null })}
									>
										{uploadForm.file.name}
									</Chip>
								)}
							</div>
						</div>

						{/* Selectores de materia y semestre */}
						<div className="grid grid-cols-2 gap-4">
							<Select
								label="Materia *"
								placeholder="Selecciona una materia"
								selectedKeys={uploadForm.subject ? [uploadForm.subject] : []}
								onSelectionChange={(keys) =>
									onFormChange({ subject: Array.from(keys)[0] as string })
								}
							>
								{subjects
									.filter((s) => s !== 'Todos')
									.map((subject) => (
										<SelectItem key={subject}>{subject}</SelectItem>
									))}
							</Select>

							<Select
								label="Semestre *"
								placeholder="Selecciona el semestre"
								selectedKeys={uploadForm.semester ? [uploadForm.semester] : []}
								onSelectionChange={(keys) =>
									onFormChange({ semester: Array.from(keys)[0] as string })
								}
							>
								{semesters
									.filter((s) => s !== 'Todos')
									.map((semester) => (
										<SelectItem key={semester}>{semester}</SelectItem>
									))}
							</Select>
						</div>

						{/* Campo de descripción */}
						<Textarea
							label="Descripción (opcional)"
							placeholder="Describe brevemente el contenido del material..."
							value={uploadForm.description}
							onValueChange={(value) => onFormChange({ description: value })}
							minRows={3}
						/>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button variant="flat" onClick={onClose} type="button">
						Cancelar
					</Button>
					<Button
						className="bg-[#8B1A1A] text-white"
						onClick={onSubmit}
						isDisabled={
							!uploadForm.file ||
							!uploadForm.subject ||
							!uploadForm.semester ||
							!uploadForm.fileType
						}
						type="button"
					>
						Subir material
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
