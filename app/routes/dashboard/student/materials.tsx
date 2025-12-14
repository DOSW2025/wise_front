import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Spinner,
	Textarea,
} from '@heroui/react';

import {
	ChevronLeft,
	ChevronRight,
	Filter,
	Grid3x3,
	List,
	Search,
	Stars,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CommentsModal from '~/components/materials/CommentsModal';
import FiltersPanel from '~/components/materials/filtersPanel';
import MaterialCard from '~/components/materials/materialCard';
import PreviewModal from '~/components/materials/PreviewModal';
// Tipos y datos
import type {
	Comment,
	Material as MaterialCardType,
} from '~/components/materials/types';
import { sortOptions } from '~/components/materials/types';
import { recommendationsService } from '~/lib/api/recommendations';
import { useDownloadMaterial, useMaterials } from '~/lib/hooks/useMaterials';
import { materialsService } from '~/lib/services/materials.service';
import type {
	AssistantResponse,
	Material,
	RecommendationItem,
} from '~/lib/types/api.types';

/**
 * Valida que un item sea seguro para procesamiento.
 *
 * Esta función previene ataques de inyección de código verificando que el input
 * solo contenga caracteres alfanuméricos, espacios, guiones y caracteres españoles.
 * Rechaza caracteres especiales que podrían ser usados para inyección de scripts.
 *
 * @param item - El string a validar
 * @returns `true` si el item es válido y seguro, `false` en caso contrario
 *
 * **Caracteres permitidos:**
 * - Letras A-Z (mayúsculas y minúsculas)
 * - Vocales acentuadas: á, é, í, ó, ú
 * - Letra ñ (mayúscula y minúscula)
 * - Espacios en blanco
 * - Guiones (-)
 * - Longitud: 1-100 caracteres
 *
 * @example
 * isValidItem("Matemáticas") // true
 * isValidItem("Español Avanzado") // true
 * isValidItem("<script>alert(1)</script>") // false - rechaza caracteres maliciosos
 * isValidItem("a".repeat(101)) // false - excede longitud máxima
 */
const isValidItem = (item: string) => /^[a-zA-ZáéíóúñÑ\s-]{1,100}$/u.test(item);

/**
 * Parsea y sanitiza una cadena separada por comas en un array de items válidos.
 *
 * Esta función procesa input del usuario para campos de materias y temas,
 * aplicando múltiples capas de validación para prevenir input malicioso:
 * 1. Divide por comas
 * 2. Elimina espacios al inicio/fin de cada item
 * 3. Elimina items vacíos
 * 4. Valida cada item con `isValidItem` (solo caracteres seguros)
 * 5. Limita el resultado a máximo 20 items
 *
 * @param value - String separado por comas ingresado por el usuario
 * @returns Array de strings validados y sanitizados, máximo 20 elementos
 *
 * **Protecciones de seguridad:**
 * - Previene inyección de scripts rechazando caracteres especiales
 * - Limita cantidad de items para prevenir ataques de denegación de servicio
 * - Valida longitud individual de cada item (máx 100 caracteres)
 *
 * @example
 * parseCommaSeparated("Matemáticas, Física, Química")
 * // Retorna: ["Matemáticas", "Física", "Química"]
 *
 * @example
 * parseCommaSeparated("Math<script>, Normal, ")
 * // Retorna: ["Normal"] - rechaza el item con script, elimina el vacío
 *
 * @example
 * parseCommaSeparated("a,b,c,...".repeat(10)) // 30+ items
 * // Retorna: solo los primeros 20 items validados
 */
const parseCommaSeparated = (value: string) =>
	value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
		.filter(isValidItem)
		.slice(0, 20);

/**
 * Extrae la introducción del mensaje de IA con fallback seguro.
 *
 * Esta función intenta extraer solo la parte introductoria del mensaje de la IA,
 * evitando mostrar la lista de recomendaciones numeradas que se muestran por separado.
 *
 * @param message - El mensaje completo devuelto por el servicio de IA
 * @returns La introducción del mensaje sin la lista numerada, o cadena vacía si no hay mensaje
 *
 * @example
 * // Mensaje con lista numerada
 * extractIntroduction("Basado en tu búsqueda, aquí están mis recomendaciones:\n\n1. Material A\n2. Material B")
 * // Retorna: "Basado en tu búsqueda, aquí están mis recomendaciones:"
 *
 * @example
 * // Mensaje sin lista numerada
 * extractIntroduction("Aquí tienes los mejores materiales para tu búsqueda.")
 * // Retorna: "Aquí tienes los mejores materiales para tu búsqueda."
 */
const extractIntroduction = (message: string | undefined): string => {
	if (!message) return '';

	// Intentar dividir por el patrón de lista numerada
	const parts = message.split(/\n\n1\.\s+/);
	if (parts.length > 1 && parts[0].trim()) {
		return parts[0].trim();
	}

	// Fallback: si no hay el patrón esperado, mostrar los primeros párrafos
	const paragraphs = message.split('\n\n');
	if (paragraphs.length > 0 && paragraphs[0].trim()) {
		return paragraphs[0].trim();
	}

	// Último fallback: devolver el mensaje completo
	return message.trim();
};

// Función para adaptar Material del API al Material que espera MaterialCard
function adaptMaterialForCard(apiMaterial: Material): MaterialCardType {
	const semesters = ['1er', '2do', '3er', '4to'];
	const semesterNum = apiMaterial.semestre || 1;
	const semesterStr = semesters[semesterNum - 1] || semesters[0];

	return {
		id: apiMaterial.id,
		title: apiMaterial.nombre,
		author: apiMaterial.tutor,
		subject: apiMaterial.materia,
		semester: `${semesterStr} Semestre`,
		fileType: 'PDF',
		date: new Date(apiMaterial.createdAt).toLocaleDateString('es-ES', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}),
		rating: apiMaterial.calificacion,
		ratingsCount: 0, // No viene en respuesta
		downloads: apiMaterial.descargas,
		comments: 0, // No viene en respuesta
		description: apiMaterial.descripcion || 'Sin descripción disponible.',
		commentsList: [],
		fileUrl: apiMaterial.fileUrl, // URL del archivo para vista previa
	};
}

export default function StudentMaterials() {
	// Estados
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSubject, setSelectedSubject] = useState('Todos');
	const [selectedSemester, setSelectedSemester] = useState('Todos');
	const [sortBy, setSortBy] = useState('Todos');
	const [previewMaterial, setPreviewMaterial] =
		useState<MaterialCardType | null>(null);
	const [commentsMaterial, setCommentsMaterial] =
		useState<MaterialCardType | null>(null);
	const [userRating, setUserRating] = useState(0);
	const [isAssistOpen, setIsAssistOpen] = useState(false);
	const [assistDescription, setAssistDescription] = useState('');
	const [assistSubjects, setAssistSubjects] = useState('');
	const [assistTopics, setAssistTopics] = useState('');
	const [assistResult, setAssistResult] = useState<AssistantResponse | null>(
		null,
	);
	const [assistError, setAssistError] = useState<string | null>(null);
	const [isAssistLoading, setIsAssistLoading] = useState(false);
	const [currentSkip, setCurrentSkip] = useState(0);
	const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

	// Calcular items por página - ambos modos usan 15
	const itemsPerPage = 15;

	// Crear filtros para la API
	const filters = {
		skip: currentSkip,
		take: itemsPerPage,
		search: searchQuery || undefined,
	};

	// Obtener materiales del API con paginación
	const { data: materialsData, isLoading, error } = useMaterials(filters);
	const apiMaterials = materialsData?.data || [];
	const totalPages = materialsData?.pagination?.totalPages || 1;

	// Adaptar materiales del API al formato que espera MaterialCard
	const allMaterials: MaterialCardType[] = useMemo(() => {
		return apiMaterials.map(adaptMaterialForCard);
	}, [apiMaterials]);
	const isGridView = viewMode === 'grid';
	const layoutClass = isGridView
		? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
		: 'space-y-4';
	const gridButtonVariant = isGridView ? 'solid' : 'flat';
	const gridButtonClass = isGridView ? 'bg-[#8B1A1A] text-white' : '';
	const listButtonVariant = isGridView ? 'flat' : 'solid';
	const listButtonClass = isGridView ? '' : 'bg-[#8B1A1A] text-white';

	// Handler for clicking on AI recommendations
	const handleRecommendationClick = async (rec: RecommendationItem) => {
		try {
			setIsLoadingRecommendation(true);

			// Intentar buscar en los materiales actuales
			const foundMaterial = allMaterials.find((m) => {
				// Buscar por coincidencia exacta de título
				if (m.title === rec.fileName) return true;

				// Buscar por coincidencia parcial (el título contiene el fileName o viceversa)
				if (m.title.toLowerCase().includes(rec.fileName.toLowerCase()))
					return true;
				if (rec.fileName.toLowerCase().includes(m.title.toLowerCase()))
					return true;

				// Buscar por docId si está disponible
				if (rec.docId && (m.id === rec.docId || m.docId === rec.docId))
					return true;

				return false;
			});

			if (foundMaterial) {
				// Si está en la lista actual, abrir directamente
				setPreviewMaterial(foundMaterial);
			} else {
				// Si no está, actualizar la búsqueda con el nombre del archivo
				// Extraer el nombre limpio del archivo (sin UUID si existe)
				const cleanFileName = rec.fileName
					.replace(/^[a-f0-9-]{36}-/i, '')
					.replace(/\.[^.]+$/, '');
				setSearchQuery(cleanFileName || rec.fileName);
				setSelectedSubject('Todos');
				setSelectedSemester('Todos');
				setCurrentSkip(0);
			}
		} catch (error) {
			console.error('Error en handleRecommendationClick:', error);
		} finally {
			setIsLoadingRecommendation(false);
		}
	};

	// Filtrar y ordenar materiales
	const filteredMaterials = useMemo(() => {
		const filtered = allMaterials.filter((material) => {
			const matchesSubject =
				selectedSubject === 'Todos' || material.subject === selectedSubject;
			const matchesSemester =
				selectedSemester === 'Todos' || material.semester === selectedSemester;

			return matchesSubject && matchesSemester;
		});

		// Ordenar
		switch (sortBy) {
			case 'Más recientes':
				filtered.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				);
				break;
			case 'Mejor valorado':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case 'Más descargados':
				filtered.sort((a, b) => b.downloads - a.downloads);
				break;
			default:
				filtered.sort(
					(a, b) => b.rating * b.downloads - a.rating * a.downloads,
				);
				break;
		}

		return filtered;
	}, [allMaterials, selectedSubject, selectedSemester, sortBy]);

	// Los materiales ya vienen paginados de la API
	const paginatedMaterials = filteredMaterials;
	const currentPage = Math.floor(currentSkip / itemsPerPage) + 1;

	// Resetear a página 1 cuando cambien los filtros o la vista
	useEffect(() => {
		setCurrentSkip(0);
	}, []);

	// Handlers
	const downloadMutation = useDownloadMaterial();

	const handleDownload = async (materialId: string) => {
		try {
			console.log('Iniciando descarga del material:', materialId);
			await downloadMutation.mutateAsync(materialId);
			console.log('Descarga completada');
		} catch (error) {
			console.error('Error en descarga:', error);
			const axiosError = error as {
				message?: string;
				response?: { status?: number; statusText?: string; data?: unknown };
			};
			const errorMsg =
				axiosError?.message || 'Error desconocido al descargar el material';
			console.error('Detalle del error:', {
				message: errorMsg,
				status: axiosError?.response?.status,
				statusText: axiosError?.response?.statusText,
				data: axiosError?.response?.data,
			});
			alert(`Error al descargar: ${errorMsg}`);
		}
	};

	const handleShare = async (material: MaterialCardType): Promise<void> => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: material.title,
					text: material.description,
					url: window.location.href,
				});
			} catch (error) {
				// User cancelled the share dialog or share failed
				console.log(
					'Error al compartir:',
					error instanceof Error ? error.message : 'Error desconocido',
				);
			}
		} else {
			try {
				await navigator.clipboard.writeText(
					`${material.title} - ${material.author}`,
				);
				alert('Enlace copiado al portapapeles');
			} catch (error) {
				console.error(
					'Error al copiar al portapapeles:',
					error instanceof Error ? error.message : 'Error desconocido',
				);
				alert('No se pudo copiar al portapapeles');
			}
		}
	};

	const handleReport = (material: MaterialCardType) => {
		console.log('Reportando material:', material.id);
		alert(`Reportando material: ${material.title}`);
	};

	const handleRateMaterial = (material: MaterialCardType, rating: number) => {
		if (rating > 0) {
			console.log(`Valorando material ${material.id} con ${rating} estrellas`);
			alert(
				`¡Gracias por valorar "${material.title}" con ${rating} estrellas!`,
			);
			setUserRating(0);
		}
	};

	// Abrir modal SOLO de comentarios (desde la tarjeta)
	const handleOpenCommentsModal = (material: MaterialCardType) => {
		console.log('Abrir modal de comentarios para:', material.title);
		setCommentsMaterial(material);
	};

	// Esta función ahora es para abrir comentarios DENTRO del modal de vista previa
	const handleOpenCommentsInPreview = (material: MaterialCardType) => {
		console.log(
			'Abrir sección de comentarios en vista previa:',
			material.title,
		);
		// Esta función se pasa al PreviewModal para manejar comentarios internos
	};

	// Agregar comentario (simulado). Firma: (materialId, content)
	const handleAddComment = async (materialId: string, content: string) => {
		console.log('Agregando comentario:', { materialId, content });

		// Simular agregar comentario
		const _newComment: Comment = {
			id: `c${Date.now()}`,
			userId: 'current-user', // En una app real, esto vendría del auth
			userName: 'Tú', // En una app real, esto vendría del perfil
			date: new Date().toLocaleDateString('es-ES', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}),
			content: content,
		};

		// En una app real, aquí harías una llamada a la API
		// Por ahora, solo mostramos un mensaje
		alert(`Comentario agregado: "${content}"`);

		// Aquí deberías actualizar el estado para reflejar el nuevo comentario
		// Pero como estamos usando mock data, solo mostramos el alert
	};

	//Handler para cambio de página
	const handlePageChange = (page: number) => {
		const newSkip = (page - 1) * itemsPerPage;
		setCurrentSkip(newSkip);
		// Scroll to top cuando cambie de página
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleAssistSubmit = async () => {
		const description = assistDescription.trim();

		if (!description) {
			setAssistError('Describe lo que buscas antes de enviar.');
			return;
		}

		const materiasFromInput = parseCommaSeparated(assistSubjects);
		const materias =
			materiasFromInput.length > 0
				? materiasFromInput
				: selectedSubject !== 'Todos'
					? [selectedSubject]
					: [];

		const temasFromInput = parseCommaSeparated(assistTopics);
		const temas =
			temasFromInput.length > 0
				? temasFromInput
				: searchQuery.trim()
					? [searchQuery.trim()]
					: [];

		if (!materias.length) {
			setAssistError(
				'Agrega al menos una materia (usa el filtro o escribe en Materias).',
			);
			return;
		}

		if (!temas.length) {
			setAssistError(
				'Agrega al menos un tema (usa Buscar o escribe en Temas).',
			);
			return;
		}

		setAssistError(null);
		setAssistResult(null);
		setIsAssistLoading(true);

		try {
			const response = await recommendationsService.getRecommendations({
				descripcion: description,
				materias,
				temas,
			});
			setAssistResult(response);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'No se pudo obtener recomendaciones.';
			setAssistError(message);
		} finally {
			setIsAssistLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header SIN botón Subir material */}
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold text-foreground">
						Repositorio de Materiales
					</h1>
					<p className="text-default-500">
						{filteredMaterials.length} materiales disponibles
						{filteredMaterials.length > itemsPerPage && (
							<span className="text-sm text-gray-500 ml-2">
								(Mostrando {(currentPage - 1) * itemsPerPage + 1}-
								{Math.min(currentPage * itemsPerPage, filteredMaterials.length)}
								)
							</span>
						)}
					</p>
				</div>
			</div>

			{/* Barra de búsqueda y botón filtros */}
			<div className="flex gap-4">
				<Input
					placeholder="Buscar por título, autor o materia..."
					startContent={<Search size={20} />}
					value={searchQuery}
					onValueChange={setSearchQuery}
					className="flex-1"
					endContent={
						<Button
							isIconOnly
							variant="light"
							className="min-w-10 h-10 rounded-full bg-[#8B1A1A] text-white shadow-sm flex items-center justify-center px-2 mr-2"
							title="Busqueda inteligente"
							aria-label="Busqueda inteligente"
							onClick={() => setIsAssistOpen((prev) => !prev)}
							type="button"
						>
							<Stars size={18} className="w-5 h-5" />
						</Button>
					}
				/>

				<Button
					variant="bordered"
					startContent={<Filter size={20} />}
					onClick={() => setIsFiltersOpen(!isFiltersOpen)}
				>
					Filtros
				</Button>
			</div>

			{isAssistOpen && (
				<div className="border rounded-lg p-4 shadow-sm bg-white/60 backdrop-blur-sm space-y-4">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="font-semibold text-foreground">
								Busqueda inteligente
							</p>
							<p className="text-sm text-default-500">
								Describe el material que necesitas.
							</p>
						</div>
						<Button
							size="sm"
							variant="light"
							onClick={() => setIsAssistOpen(false)}
							type="button"
						>
							Cerrar
						</Button>
					</div>

					<Textarea
						label="Descripcion"
						placeholder="Ej: Necesito una guia de estudio para algebra lineal enfocada en ejemplos practicos..."
						minRows={3}
						maxLength={5000}
						value={assistDescription}
						onValueChange={(value) => {
							if (value.length <= 5000) {
								setAssistDescription(value);
								// Limpiar errores cuando el usuario empieza a corregir
								if (assistError) setAssistError(null);
							}
						}}
						description={`${assistDescription.length}/5000 caracteres`}
						isRequired
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Input
							label="Materias"
							placeholder="Ej: Historia, Matemáticas"
							description="Separa las materias por coma. Si dejas vacío se usa el filtro seleccionado."
							value={assistSubjects}
							onValueChange={(value) => {
								setAssistSubjects(value);
								// Limpiar errores cuando el usuario empieza a corregir
								if (assistError) setAssistError(null);
							}}
						/>
						<Input
							label="Temas"
							placeholder="Ej: Revolución Francesa, Cálculo"
							description="Separa los temas por coma. Si dejas vacío se usa la búsqueda actual."
							value={assistTopics}
							onValueChange={(value) => {
								setAssistTopics(value);
								// Limpiar errores cuando el usuario empieza a corregir
								if (assistError) setAssistError(null);
							}}
						/>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<Button
							color="primary"
							onClick={handleAssistSubmit}
							className="sm:ml-auto"
							isLoading={isAssistLoading}
						>
							Enviar
						</Button>
					</div>

					{assistError && (
						<div className="text-sm text-danger-500">{assistError}</div>
					)}

					{assistResult && (
						<div className="space-y-4">
							{/* Mensaje de la IA - Solo para la introducción */}
							{assistResult.message && (
								<div className="bg-default-100 border border-default-200 rounded-lg p-4">
									<p className="text-sm font-semibold text-foreground mb-2">
										Recomendación del Asistente IA
									</p>
									<p className="text-sm text-default-700">
										{/* Extraer la introducción del mensaje de forma segura */}
										{extractIntroduction(assistResult.message)}
									</p>
								</div>
							)}

							{/* Lista de Recomendaciones con Scroll Interno */}
							{assistResult.recommendations &&
								assistResult.recommendations.length > 0 && (
									<div className="space-y-3">
										<p className="text-sm font-semibold text-foreground">
											Materiales Recomendados (
											{assistResult.recommendations.length})
										</p>
										<section
											className="max-h-96 overflow-y-auto pr-2 space-y-3"
											aria-label="Lista de materiales recomendados por el asistente de IA"
										>
											{assistResult.recommendations.map(
												(rec: RecommendationItem, idx: number) => (
													<button
														key={rec.docId || idx}
														type="button"
														onClick={() => handleRecommendationClick(rec)}
														onKeyDown={(e) => {
															// Permitir Enter y Space para activar el botón
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																handleRecommendationClick(rec);
															}
														}}
														className="bg-default-50 border border-default-200 rounded-lg p-3 space-y-2 hover:bg-default-100 transition text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full"
														aria-label={`Ver material recomendado: ${rec.fileName}`}
														disabled={isLoadingRecommendation}
													>
														<div className="flex justify-between items-start gap-2">
															<h4 className="text-sm font-semibold text-foreground">
																{rec.fileName}
															</h4>
															<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex-shrink-0">
																{rec.materia}
															</span>
														</div>
														<p className="text-xs text-default-600">
															<span className="font-semibold">Tema:</span>{' '}
															{rec.tema}
														</p>
														<p className="text-xs text-default-600 line-clamp-2">
															<span className="font-semibold">Resumen:</span>{' '}
															{rec.summary}
														</p>
													</button>
												),
											)}
										</section>
									</div>
								)}
						</div>
					)}
				</div>
			)}

			{/* Panel de filtros */}
			<FiltersPanel
				isOpen={isFiltersOpen}
				selectedSubject={selectedSubject}
				selectedSemester={selectedSemester}
				onSubjectChange={setSelectedSubject}
				onSemesterChange={setSelectedSemester}
			/>

			{/* Ordenar por y cambiar vista */}
			<div className="flex items-center justify-between">
				<Dropdown>
					<DropdownTrigger>
						<Button variant="flat">Ordenar por: {sortBy}</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Ordenar por"
						onAction={(key) => setSortBy(key as string)}
					>
						{sortOptions.map((option) => (
							<DropdownItem key={option}>{option}</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>

				<div className="flex gap-2">
					<Button
						isIconOnly
						variant={gridButtonVariant}
						className={gridButtonClass}
						onClick={() => setViewMode('grid')}
						type="button"
					>
						<Grid3x3 size={20} />
					</Button>
					<Button
						isIconOnly
						variant={listButtonVariant}
						className={listButtonClass}
						onClick={() => setViewMode('list')}
						type="button"
					>
						<List size={20} />
					</Button>
				</div>
			</div>

			{/* Vista de materiales */}
			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<Spinner label="Cargando materiales..." />
				</div>
			) : error ? (
				<div className="text-center py-12">
					<p className="text-danger">Error al cargar los materiales</p>
				</div>
			) : allMaterials.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-default-500">No hay materiales disponibles</p>
				</div>
			) : (
				<div className={layoutClass}>
					{paginatedMaterials.map((material) => (
						<MaterialCard
							key={material.id}
							material={material}
							viewMode={viewMode}
							onPreview={setPreviewMaterial}
							onDownload={handleDownload}
							onRate={setPreviewMaterial}
							onComment={handleOpenCommentsModal}
						/>
					))}
				</div>
			)}

			{/* Modal de vista previa */}
			<PreviewModal
				material={previewMaterial}
				isOpen={!!previewMaterial}
				userRating={userRating}
				onClose={() => setPreviewMaterial(null)}
				onDownload={handleDownload}
				onShare={handleShare}
				onReport={handleReport}
				onRate={handleRateMaterial}
				onComment={handleOpenCommentsInPreview}
				onRatingChange={setUserRating}
				onAddComment={handleAddComment}
			/>

			{/* paginacion */}
			{totalPages > 1 && (
				<div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6 border-t">
					{/* Información de página */}
					<div className="text-sm text-gray-600">
						Página {currentPage} de {totalPages}
					</div>

					{/* Controles de paginación */}
					<div className="flex items-center gap-2">
						{/* Botón anterior */}
						<Button
							isIconOnly
							variant="light"
							size="sm"
							onClick={() => handlePageChange(currentPage - 1)}
							isDisabled={currentPage === 1}
							type="button"
						>
							<ChevronLeft size={16} />
						</Button>

						{/* Números de página */}
						<div className="flex gap-1">
							{/* Mostrar primeras páginas */}
							{Array.from(
								{ length: Math.min(5, totalPages) },
								(_, i) => i + 1,
							).map((page) => (
								<Button
									key={page}
									variant={page === currentPage ? 'solid' : 'light'}
									className={
										page === currentPage
											? 'bg-[#8B1A1A] text-white min-w-8 h-8'
											: 'min-w-8 h-8'
									}
									onClick={() => handlePageChange(page)}
									type="button"
									size="sm"
								>
									{page}
								</Button>
							))}

							{/* Mostrar elipsis si hay muchas páginas */}
							{totalPages > 5 &&
								currentPage > 3 &&
								currentPage < totalPages - 2 && (
									<span className="flex items-center px-2 text-gray-500">
										...
									</span>
								)}

							{/* Mostrar páginas alrededor de la actual si hay muchas */}
							{totalPages > 5 &&
								currentPage > 3 &&
								currentPage < totalPages - 2 && (
									<Button
										variant="light"
										className="min-w-8 h-8"
										onClick={() => handlePageChange(currentPage)}
										type="button"
										size="sm"
									>
										{currentPage}
									</Button>
								)}

							{/* Mostrar últimas páginas */}
							{totalPages > 5 &&
								Array.from(
									{ length: Math.min(2, totalPages) },
									(_, i) => totalPages - i,
								)
									.reverse()
									.map((page) => (
										<Button
											key={page}
											variant={page === currentPage ? 'solid' : 'light'}
											className={
												page === currentPage
													? 'bg-[#8B1A1A] text-white min-w-8 h-8'
													: 'min-w-8 h-8'
											}
											onClick={() => handlePageChange(page)}
											type="button"
											size="sm"
										>
											{page}
										</Button>
									))}
						</div>

						{/* Botón siguiente */}
						<Button
							isIconOnly
							variant="light"
							size="sm"
							onClick={() => handlePageChange(currentPage + 1)}
							isDisabled={currentPage === totalPages}
							type="button"
						>
							<ChevronRight size={16} />
						</Button>
					</div>

					{/* Información de rango */}
					<div className="text-sm text-gray-500">
						{(currentPage - 1) * itemsPerPage + 1} -{' '}
						{Math.min(currentPage * itemsPerPage, filteredMaterials.length)} de{' '}
						{filteredMaterials.length}
					</div>
				</div>
			)}

			{/*  Modal solo para comentarios */}
			<CommentsModal
				material={commentsMaterial}
				isOpen={!!commentsMaterial}
				onClose={() => setCommentsMaterial(null)}
				onAddComment={handleAddComment}
			/>
		</div>
	);
}
