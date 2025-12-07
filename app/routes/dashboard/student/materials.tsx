import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
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
import type { Comment, Material } from '~/components/materials/types';
import { mockMaterials, sortOptions } from '~/components/materials/types';

export default function StudentMaterials() {
	// Estados
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSubject, setSelectedSubject] = useState('Todos');
	const [selectedSemester, setSelectedSemester] = useState('Todos');
	const [sortBy, setSortBy] = useState('Todos');
	const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
	const [commentsMaterial, setCommentsMaterial] = useState<Material | null>(
		null,
	);
	const [userRating, setUserRating] = useState(0);
	const [isAssistOpen, setIsAssistOpen] = useState(false);
	const [assistDescription, setAssistDescription] = useState('');
	const isGridView = viewMode === 'grid';
	const layoutClass = isGridView
		? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
		: 'space-y-4';
	const gridButtonVariant = isGridView ? 'solid' : 'flat';
	const gridButtonClass = isGridView ? 'bg-[#8B1A1A] text-white' : '';
	const listButtonVariant = isGridView ? 'flat' : 'solid';
	const listButtonClass = isGridView ? '' : 'bg-[#8B1A1A] text-white';

	// ESTADOS para paginación
	const [currentPage, setCurrentPage] = useState(1);

	// Filtrar y ordenar materiales
	const filteredMaterials = useMemo(() => {
		const filtered = mockMaterials.filter((material) => {
			const matchesSearch =
				material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				material.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
				material.subject.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesSubject =
				selectedSubject === 'Todos' || material.subject === selectedSubject;
			const matchesSemester =
				selectedSemester === 'Todos' || material.semester === selectedSemester;

			return matchesSearch && matchesSubject && matchesSemester;
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
	}, [searchQuery, selectedSubject, selectedSemester, sortBy]);

	// Calcular items por página basado en la vista
	const itemsPerPage = isGridView ? 12 : 15;

	// Calcular materiales paginados
	const paginatedMaterials = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredMaterials.slice(startIndex, endIndex);
	}, [filteredMaterials, currentPage, itemsPerPage]);

	// Calcular total de páginas
	const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

	// Resetear a página 1 cuando cambien los filtros o la vista
	useEffect(() => {
		setCurrentPage(1);
	}, []);

	// Handlers
	const handleDownload = async (materialId: string) => {
		console.log('Descargando material:', materialId);
		alert(`Descargando material ${materialId}`);
	};

	const handleShare = async (material: Material) => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: material.title,
					text: material.description,
					url: window.location.href,
				});
			} catch (error) {
				console.log('Error al compartir:', error);
			}
		} else {
			navigator.clipboard.writeText(`${material.title} - ${material.author}`);
			alert('Enlace copiado al portapapeles');
		}
	};

	const handleReport = async (material: Material) => {
		console.log('Reportando material:', material.id);
		alert(`Reportando material: ${material.title}`);
	};

	const handleRateMaterial = async (material: Material, rating: number) => {
		if (rating > 0) {
			console.log(`Valorando material ${material.id} con ${rating} estrellas`);
			alert(
				`¡Gracias por valorar "${material.title}" con ${rating} estrellas!`,
			);
			setUserRating(0);
		}
	};

	// Abrir modal SOLO de comentarios (desde la tarjeta)
	const handleOpenCommentsModal = (material: Material) => {
		console.log('Abrir modal de comentarios para:', material.title);
		setCommentsMaterial(material);
	};

	// Esta función ahora es para abrir comentarios DENTRO del modal de vista previa
	const handleOpenCommentsInPreview = (material: Material) => {
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
		setCurrentPage(page);
		// Scroll to top cuando cambie de página
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleAssistSubmit = () => {
		if (!assistDescription.trim()) {
			alert('Describe lo que buscas antes de enviar.');
			return;
		}
		// TODO: Conectar con el backend/IA para enviar la descripcion y obtener recomendaciones.
		console.log('Busqueda inteligente:', {
			description: assistDescription,
		});
		alert('Busqueda inteligente enviada. (Simulado)');
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
							if (value.length <= 5000) setAssistDescription(value);
						}}
						description={`${assistDescription.length}/5000 caracteres`}
						isRequired
					/>

					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<Button
							color="primary"
							onClick={handleAssistSubmit}
							className="sm:ml-auto"
						>
							Enviar
						</Button>
					</div>
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
