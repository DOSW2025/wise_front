import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from '@heroui/react';
import { AlertCircle, BookOpen, CheckCircle, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ForumErrorType } from '~/lib/services/forum.service';
import { createForum } from '~/lib/services/forum.service';

interface ForumCreationModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (data: ForumFormData) => void;
	readonly onError?: (error: string) => void;
}

interface ForumFormData {
	name: string;
	subject: string;
}

// Mapeo de materias con información adicional
const AVAILABLE_SUBJECTS = [
	{
		key: 'matematicas',
		label: 'Matemáticas',
		icon: '🔢',
		color: 'primary' as const,
	},
	{
		key: 'programacion',
		label: 'Programación',
		icon: '💻',
		color: 'success' as const,
	},
	{ key: 'fisica', label: 'Física', icon: '⚛️', color: 'warning' as const },
	{ key: 'quimica', label: 'Química', icon: '🧪', color: 'danger' as const },
	{ key: 'ingles', label: 'Inglés', icon: '🌐', color: 'primary' as const },
	{ key: 'historia', label: 'Historia', icon: '📚', color: 'success' as const },
	{
		key: 'literatura',
		label: 'Literatura',
		icon: '📖',
		color: 'warning' as const,
	},
	{ key: 'biologia', label: 'Biología', icon: '🔬', color: 'success' as const },
	{ key: 'economia', label: 'Economía', icon: '💰', color: 'primary' as const },
	{ key: 'arte', label: 'Arte', icon: '🎨', color: 'danger' as const },
];

export function ForumCreationModal({
	isOpen,
	onClose,
	onSubmit,
	onError,
}: ForumCreationModalProps) {
	const [formData, setFormData] = useState<ForumFormData>({
		name: '',
		subject: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<ForumErrorType | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [createdForumData, setCreatedForumData] =
		useState<ForumFormData | null>(null);
	const [searchSubject, setSearchSubject] = useState('');
	const [isSubjectInputFocused, setIsSubjectInputFocused] = useState(false);

	// Filtrar materias basado en búsqueda con puntuación de relevancia
	const filteredSubjects = useMemo(() => {
		if (!searchSubject) return AVAILABLE_SUBJECTS;

		const searchLower = searchSubject.toLowerCase();
		return AVAILABLE_SUBJECTS.filter((subject) => {
			const labelLower = subject.label.toLowerCase();
			return (
				labelLower.includes(searchLower) ||
				labelLower.startsWith(searchLower) ||
				subject.key.includes(searchLower)
			);
		}).sort((a, b) => {
			// Priorizar coincidencias exactas al inicio
			const aStartsWith = a.label.toLowerCase().startsWith(searchLower);
			const bStartsWith = b.label.toLowerCase().startsWith(searchLower);
			return aStartsWith === bStartsWith ? 0 : aStartsWith ? -1 : 1;
		});
	}, [searchSubject]);

	// Obtener información de la materia seleccionada
	const selectedSubjectInfo = useMemo(() => {
		return AVAILABLE_SUBJECTS.find((s) => s.key === formData.subject);
	}, [formData.subject]);

	// Validación del nombre del foro (mínimo visual ≥15)
	const MIN_LEN = 15;
	const validateForumName = (name: string): string | null => {
		const trimmed = name.trim();
		if (!trimmed) {
			return 'El nombre del foro es obligatorio';
		}
		if (trimmed.length < MIN_LEN) {
			return `El nombre debe tener al menos ${MIN_LEN} caracteres`;
		}
		if (trimmed.length > 50) {
			return 'El nombre no puede exceder 50 caracteres';
		}
		if (!/^[a-zA-Z0-9\s\-áéíóúñÁÉÍÓÚÑ]+$/.test(trimmed)) {
			return 'El nombre solo puede contener letras, números y guiones';
		}
		return null;
	};

	// (Descripción no requerida según US-043)

	// Validación de materia
	const validateSubject = (subject: string): string | null => {
		if (!subject) {
			return 'Debe seleccionar una materia';
		}
		if (!AVAILABLE_SUBJECTS.some((s) => s.key === subject)) {
			return 'La materia seleccionada no es válida';
		}
		return null;
	};

	// Helpers para reducir ternarios en JSX
	const getNameFieldColor = ():
		| 'default'
		| 'success'
		| 'warning'
		| 'danger' => {
		if (errors.name) return 'danger';
		const len = formData.name ? formData.name.trim().length : 0;
		if (!formData.name) return 'default';
		return len >= MIN_LEN ? 'success' : 'warning';
	};

	const getNameDescription = (): JSX.Element | null => {
		const len = formData.name.trim().length;
		if (!formData.name) return null;
		if (errors.name) {
			return (
				<span className="text-xs text-danger-600">
					{errors.name} ({len}/50)
				</span>
			);
		}
		if (len < MIN_LEN) {
			return (
				<span className="text-xs text-warning-700">
					{`Añade ${MIN_LEN - len} caracteres más para continuar`}
				</span>
			);
		}
		return (
			<span className="text-xs text-success-700">{`✓ Nombre válido (${len}/50)`}</span>
		);
	};

	type SubjectColor = 'primary' | 'success' | 'warning' | 'danger';
	const getSubjectColorClasses = (color: SubjectColor) => {
		switch (color) {
			case 'primary':
				return {
					container: 'bg-primary-50 border-primary-200',
					tag: 'text-primary-600',
					title: 'text-primary-900',
				};
			case 'success':
				return {
					container: 'bg-success-50 border-success-200',
					tag: 'text-success-600',
					title: 'text-success-900',
				};
			case 'warning':
				return {
					container: 'bg-warning-50 border-warning-200',
					tag: 'text-warning-600',
					title: 'text-warning-900',
				};
			default:
				return {
					container: 'bg-danger-50 border-danger-200',
					tag: 'text-danger-600',
					title: 'text-danger-900',
				};
		}
	};

	// Manejar cambio en el campo nombre
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFormData((prev) => ({ ...prev, name: value }));

		// Limpiar error de duplicado si el usuario cambia el nombre
		if (errorType === 'duplicate' || errorType === 'invalid-data') {
			setApiError(null);
			setErrorType(null);
		}

		// Validar en tiempo real
		const error = validateForumName(value);
		setErrors((prev) => ({
			...prev,
			name: error || '',
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
		// Modo frontend-only: simulamos éxito sin llamar API
		setIsLoading(true);
		setApiError(null);
		setErrorType(null);

		setIsSuccess(true);
		setCreatedForumData(formData);

		setTimeout(() => {
			onSubmit(formData);

			// Limpiar formulario
			setFormData({ name: '', subject: '' });
			setSearchSubject('');
			setErrors({});
			setApiError(null);
			setErrorType(null);
			setIsSuccess(false);
			setCreatedForumData(null);
			setIsLoading(false);
			onClose();
		}, 1200);
	};

	// Manejar cierre del modal
	const handleClose = () => {
		setFormData({ name: '', subject: '' });
		setSearchSubject('');
		setErrors({});
		setApiError(null);
		setErrorType(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			closeButton={!isSuccess}
		>
			<ModalContent>
				{isSuccess && createdForumData ? (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 text-success" />
								<span className="text-xl font-bold text-foreground font-heading">
									¡Foro Creado Exitosamente!
								</span>
							</div>
						</ModalHeader>

						<ModalBody className="gap-4 py-4">
							<div className="flex flex-col items-center gap-4">
								<div className="p-4 bg-success-50 rounded-full">
									<CheckCircle className="w-12 h-12 text-success-600" />
								</div>

								<div className="text-center">
									<p className="text-sm text-foreground mb-1">
										Tu nuevo foro está listo
									</p>
									<p className="text-xs text-default-500">
										El espacio para tu comunidad ha sido creado correctamente
									</p>
								</div>

								<div className="w-full p-3 bg-success-50 border border-success-200 rounded-lg">
									<p className="text-xs font-medium text-success-700 mb-2">
										Información del foro
									</p>
									<div className="space-y-1.5">
										<div>
											<p className="text-xs text-default-500">Nombre</p>
											<p className="text-sm font-semibold text-foreground">
												{createdForumData.name}
											</p>
										</div>
										<div>
											<p className="text-xs text-default-500">Materia</p>
											<p className="text-sm font-semibold text-foreground">
												{
													AVAILABLE_SUBJECTS.find(
														(s) => s.key === createdForumData.subject,
													)?.label
												}
											</p>
										</div>
									</div>
								</div>

								<p className="text-xs text-default-400 text-center">
									Se cerrará automáticamente en unos segundos...
								</p>
							</div>
						</ModalBody>

						<ModalFooter className="justify-center">
							<Button
								color="success"
								onPress={handleClose}
								className="font-semibold"
							>
								Cerrar y Ver Foros
							</Button>
						</ModalFooter>
					</>
				) : (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<Plus className="w-5 h-5 text-primary" />
								<span className="text-xl font-bold text-foreground font-heading">
									Crear Nuevo Foro
								</span>
							</div>
							<p className="text-sm text-default-500 font-normal mt-1">
								Crea un espacio de comunicación temático para discutir sobre una
								materia
							</p>
						</ModalHeader>

						<ModalBody className={`gap-4 ${apiError ? 'py-3' : 'py-4'}`}>
							{/* Indicador de error */}
							{apiError && (
								<div className="flex items-start gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
									<AlertCircle className="w-4 h-4 text-danger-600 flex-shrink-0 mt-0.5" />
									<div className="flex-1 min-w-0">
										<p className="text-xs font-semibold text-danger-700 font-heading">
											{errorType === 'duplicate'
												? 'Nombre de foro duplicado'
												: errorType === 'invalid-subject'
													? 'Materia no válida'
													: 'Error al crear el foro'}
										</p>
										<p className="text-xs text-danger-600 mt-0.5">{apiError}</p>
										{errorType === 'duplicate' && (
											<p className="text-xs text-danger-500 mt-1 font-medium">
												💡 Prueba agregando más palabras al nombre.
											</p>
										)}
										{errorType === 'invalid-subject' && (
											<p className="text-xs text-danger-500 mt-1 font-medium">
												💡 Selecciona una materia de la lista.
											</p>
										)}
									</div>
								</div>
							)}

							{/* Indicador de carga en progreso */}
							{isLoading && (
								<div className="flex items-center justify-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg">
									<Spinner
										size="sm"
										color="primary"
										classNames={{
											circle1: 'border-b-primary',
											circle2: 'border-b-primary',
										}}
									/>
									<div className="flex-1">
										<p className="text-sm font-semibold text-primary-700">
											Creando foro...
										</p>
									</div>
								</div>
							)}
							{/* Campo Nombre del Foro */}
							<div className="space-y-2">
								<label
									htmlFor="forum-name"
									className="text-sm font-semibold text-foreground"
								>
									Nombre del Foro
								</label>
								{/* Campo con validación visual de longitud mínima */}
								<Input
									id="forum-name"
									placeholder="ej: Dudas de Álgebra Lineal"
									value={formData.name}
									onChange={handleNameChange}
									isInvalid={!!errors.name}
									errorMessage={errors.name}
									color={getNameFieldColor()}
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
									description={getNameDescription()}
								/>

								{/* Medidor visual de longitud */}
								{formData.name && (
									<div className="mt-1">
										<div className="h-1 rounded bg-default-200 overflow-hidden">
											<div
												className={`h-1 transition-all ${
													formData.name.trim().length >= MIN_LEN
														? 'bg-success-500'
														: 'bg-warning-500'
												}`}
												style={{
													width: `${Math.min(
														(formData.name.trim().length / MIN_LEN) * 100,
														100,
													)}%`,
												}}
											/>
										</div>
										<p className="text-[10px] mt-1 text-default-500">
											Mínimo requerido: {MIN_LEN} caracteres.
										</p>
									</div>
								)}

								{/* Descripción opcional removida: US-043 solo requiere nombre y materia */}
							</div>

							{/* Campo Materia con Búsqueda y Autocompletado */}
							<div className="space-y-3">
								<label
									htmlFor="forum-subject-search"
									className="text-sm font-semibold text-foreground"
								>
									Selecciona una Materia
								</label>

								{/* Input de búsqueda con autocompletado */}
								<div className="relative">
									<Input
										id="forum-subject-search"
										placeholder="Escribe para buscar (ej: Mat, Pro, Fís...)"
										value={searchSubject}
										onChange={(e) => setSearchSubject(e.target.value)}
										onFocus={() => setIsSubjectInputFocused(true)}
										onBlur={() =>
											setTimeout(() => setIsSubjectInputFocused(false), 200)
										}
										startContent={
											<Search className="w-4 h-4 text-default-400" />
										}
										variant="bordered"
										size="lg"
										isClearable
										onClear={() => {
											setSearchSubject('');
											setFormData((prev) => ({ ...prev, subject: '' }));
											setErrors((prev) => ({ ...prev, subject: '' }));
										}}
										isInvalid={!!errors.subject && !formData.subject}
										classNames={{
											input: 'text-sm',
											clearButton: 'text-default-400',
										}}
										description={
											!formData.subject ? (
												<span className="text-xs text-default-500">
													💡 Empieza a escribir para ver sugerencias
												</span>
											) : null
										}
									/>

									{/* Dropdown de materias filtradas */}
									{isSubjectInputFocused && filteredSubjects.length > 0 && (
										<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-default-200 rounded-lg shadow-lg z-50">
											<div className="max-h-64 overflow-y-auto">
												{filteredSubjects.map((subject, index) => (
													<button
														type="button"
														key={subject.key}
														onClick={() => {
															setFormData((prev) => ({
																...prev,
																subject: subject.key,
															}));
															setSearchSubject(subject.label);
															setIsSubjectInputFocused(false);
															setErrors((prev) => ({ ...prev, subject: '' }));

															// Limpiar error de materia inválida si el usuario selecciona una materia válida
															if (errorType === 'invalid-subject') {
																setApiError(null);
																setErrorType(null);
															}
														}}
														className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
													${
														formData.subject === subject.key
															? 'bg-primary-50 border-l-4 border-primary'
															: index % 2 === 0
																? 'bg-default-50 hover:bg-default-100'
																: 'bg-white hover:bg-default-50'
													}
													${formData.subject === subject.key ? 'text-primary-700' : 'text-foreground'}
												`}
													>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">
																{subject.label}
															</p>
														</div>
														{formData.subject === subject.key && (
															<span className="text-primary text-lg flex-shrink-0">
																✓
															</span>
														)}
													</button>
												))}
											</div>
										</div>
									)}

									{/* Mensaje cuando no hay resultados */}
									{isSubjectInputFocused &&
										filteredSubjects.length === 0 &&
										searchSubject && (
											<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-warning-200 rounded-lg shadow-lg p-4 z-50">
												<p className="text-sm text-warning-700 flex items-center gap-2">
													<span>⚠️</span>
													<span>No encontramos "{searchSubject}"</span>
												</p>
												<p className="text-xs text-default-500 mt-2">
													Disponibles:{' '}
													{AVAILABLE_SUBJECTS.map((s) => s.label).join(', ')}
												</p>
											</div>
										)}
								</div>

								{/* Materia seleccionada - Tarjeta de confirmación */}
								{formData.subject &&
									selectedSubjectInfo &&
									(() => {
										const classes = getSubjectColorClasses(
											selectedSubjectInfo.color,
										);
										return (
											<div
												className={`p-4 rounded-lg border-2 transition-all ${classes.container}`}
											>
												<p
													className={`text-xs font-medium uppercase tracking-wide ${classes.tag}`}
												>
													✓ Materia Seleccionada
												</p>
												<p className={`text-lg font-bold ${classes.title}`}>
													{selectedSubjectInfo.label}
												</p>
											</div>
										);
									})()}

								{/* Error de validación */}
								{errors.subject && (
									<div className="text-xs text-danger-600 p-2 bg-danger-50 rounded border border-danger-200 flex items-center gap-2">
										<span>❌</span>
										<span>{errors.subject}</span>
									</div>
								)}
							</div>

							{/* Información de ayuda */}
							<div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-2">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4 text-primary-700" />
									<h4 className="text-sm font-semibold text-primary-700">
										Información importante
									</h4>
								</div>
								<ul className="text-xs text-primary-600 space-y-1 ml-6">
									<li>
										✓ El espacio estará vacío y disponible para tu comunidad
									</li>
									<li>
										✓ Podrás invitar a otros estudiantes y tutores a participar
									</li>
									<li>
										✓ Se aplicarán las reglas de la comunidad automáticamente
									</li>
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
									!!errors.subject ||
									isLoading
								}
								startContent={!isLoading && <Plus className="w-4 h-4" />}
								className="font-semibold"
							>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<Spinner size="sm" color="current" />
										Creando foro...
									</span>
								) : (
									'Crear Foro'
								)}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
