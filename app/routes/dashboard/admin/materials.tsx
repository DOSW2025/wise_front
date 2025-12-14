import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Modal,
	ModalContent,
	Pagination,
	Spinner,
	useDisclosure,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
	ChevronDown,
	ChevronUp,
	Download,
	Edit2,
	Eye,
	FileText,
	Filter,
	Grid3X3,
	List,
	Search,
	Star,
	Trash2,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationModal } from '~/components/delete-confirmation-modal';
import { EditMaterialForm } from '~/components/edit-material-form';
import { MaterialDetailModal } from '~/components/material-detail-modal';
import { MaterialStatsModal } from '~/components/material-stats-modal';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { useMaterials } from '~/lib/hooks/useMaterials';
import type { Material, MaterialFilters } from '~/lib/types/api.types';

const ITEMS_PER_PAGE_LIST = 15;
const ITEMS_PER_PAGE_GRID = 15;

export default function AdminMaterials() {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<MaterialFilters>({});
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentSkip, setCurrentSkip] = useState(0);
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
	const debouncedSearch = useDebounce(searchTerm, 500);

	const {
		isOpen: isDetailOpen,
		onOpen: onDetailOpen,
		onClose: onDetailClose,
	} = useDisclosure();
	const {
		isOpen: isStatsOpen,
		onOpen: onStatsOpen,
		onClose: onStatsClose,
	} = useDisclosure();
	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
		null,
	);
	const [selectedMaterialForStats, setSelectedMaterialForStats] =
		useState<Material | null>(null);
	const [selectedMaterialForEdit, setSelectedMaterialForEdit] =
		useState<Material | null>(null);
	const [selectedMaterialForDelete, setSelectedMaterialForDelete] =
		useState<Material | null>(null);

	// Calcular items por página según el modo de vista
	const itemsPerPage =
		viewMode === 'list' ? ITEMS_PER_PAGE_LIST : ITEMS_PER_PAGE_GRID;

	// Combinar filtros con búsqueda debounced y paginación
	const combinedFilters = {
		...filters,
		search: debouncedSearch || undefined,
		skip: currentSkip,
		take: itemsPerPage,
	};

	const { data: materialsResponse, isLoading } = useMaterials(combinedFilters);
	let materials = materialsResponse?.data || [];

	// Filtrar materiales por tags seleccionados
	if (selectedTags.length > 0) {
		materials = materials.filter((material) =>
			selectedTags.some((tag) =>
				material.tags?.some(
					(materialTag) => materialTag.toLowerCase() === tag.toLowerCase(),
				),
			),
		);
	}

	const totalPages = materialsResponse?.pagination?.totalPages || 1;
	const totalItems = materialsResponse?.pagination?.totalItems || 0;
	const currentPage = Math.floor(currentSkip / itemsPerPage) + 1;

	const handleAddTag = () => {
		if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
			setSelectedTags([...selectedTags, tagInput.trim()]);
			setTagInput('');
			setCurrentSkip(0);
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
		setCurrentSkip(0);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	};

	const clearFilters = () => {
		setFilters({});
		setSearchTerm('');
		setSelectedTags([]);
		setTagInput('');
		setCurrentSkip(0);
	};

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentSkip(0);
	};

	const hasActiveFilters = selectedTags.length > 0 || searchTerm;

	const handleOpenDetail = (materialId: string) => {
		setSelectedMaterialId(materialId);
		onDetailOpen();
	};

	const handleOpenStats = (material: Material) => {
		setSelectedMaterialForStats(material);
		onStatsOpen();
	};

	const handleOpenEdit = (material: Material) => {
		setSelectedMaterialForEdit(material);
		onEditOpen();
	};

	const handleOpenDelete = (material: Material) => {
		setSelectedMaterialForDelete(material);
		onDeleteOpen();
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Gestor de Materiales
					</h1>
					<p className="text-default-500">
						Visualiza y gestiona todos los materiales del sistema.
					</p>
				</div>
			</div>

			{/* Barra de búsqueda */}
			<div className="flex gap-4">
				<Input
					placeholder="Buscar materiales..."
					startContent={<Search size={20} />}
					value={searchTerm}
					onValueChange={handleSearch}
					className="flex-1"
				/>
			</div>

			{/* Filtros */}
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Button
						variant="bordered"
						startContent={<Filter className="w-4 h-4" />}
						endContent={
							showFilters ? (
								<ChevronUp className="w-4 h-4" />
							) : (
								<ChevronDown className="w-4 h-4" />
							)
						}
						color={hasActiveFilters ? 'primary' : 'default'}
						onPress={() => setShowFilters(!showFilters)}
					>
						Filtros {hasActiveFilters && `(${selectedTags.length})`}
					</Button>

					{/* Indicadores de filtros activos */}
					{selectedTags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{selectedTags.map((tag) => (
								<Chip
									key={tag}
									size="sm"
									color="primary"
									variant="flat"
									onClose={() => handleRemoveTag(tag)}
								>
									{tag}
								</Chip>
							))}
						</div>
					)}
				</div>

				{/* Panel de filtros expandible */}
				{showFilters && (
					<Card>
						<CardBody className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold">Filtrar por Tags</h4>
									{hasActiveFilters && (
										<Button
											size="sm"
											variant="light"
											startContent={<X className="w-3 h-3" />}
											onPress={clearFilters}
										>
											Limpiar filtros
										</Button>
									)}
								</div>

								<div>
									<label
										htmlFor="admin-add-tags-input"
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Agregar Tags
									</label>
									<div className="flex gap-2">
										<Input
											id="admin-add-tags-input"
											placeholder="Escribe un tag y presiona Enter..."
											value={tagInput}
											onValueChange={setTagInput}
											onKeyDown={handleKeyDown}
											size="sm"
											className="flex-1"
										/>
										<Button
											color="primary"
											size="sm"
											onClick={handleAddTag}
											disabled={!tagInput.trim()}
										>
											Agregar
										</Button>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				)}
			</div>

			{/* Controles de vista */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-default-600">
					Total: {totalItems} materiales
				</p>
				<div className="flex gap-2">
					<Button
						isIconOnly
						variant={viewMode === 'list' ? 'solid' : 'bordered'}
						className={viewMode === 'list' ? 'bg-[#8B1A1A] text-white' : ''}
						onClick={() => setViewMode('list')}
					>
						<List className="w-4 h-4" />
					</Button>
					<Button
						isIconOnly
						variant={viewMode === 'grid' ? 'solid' : 'bordered'}
						className={viewMode === 'grid' ? 'bg-[#8B1A1A] text-white' : ''}
						onClick={() => setViewMode('grid')}
					>
						<Grid3X3 className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Estado de carga */}
			{isLoading && (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<Spinner size="lg" color="primary" />
						<p className="mt-4 text-default-600">Cargando...</p>
					</div>
				</div>
			)}

			{/* Lista de materiales */}
			{!isLoading && materials.length > 0 && (
				<>
					<div
						className={
							viewMode === 'grid'
								? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
								: 'grid gap-4'
						}
					>
						{materials.map((material) => (
							<Card
								key={material.id}
								className="hover:shadow-md transition-shadow cursor-pointer"
								isPressable
								onPress={() => handleOpenDetail(material.id)}
							>
								<CardBody className={viewMode === 'grid' ? 'p-4' : 'p-6'}>
									{viewMode === 'list' ? (
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="flex items-start justify-between mb-3">
													<div>
														<h3 className="text-lg font-semibold mb-1">
															{material.nombre}
														</h3>
														<p className="text-sm text-default-600">
															Por: {material.tutor}
														</p>
													</div>
													<div className="flex items-center gap-1">
														<Star className="w-4 h-4 text-yellow-500 fill-current" />
														<span className="text-sm font-medium">
															{material.calificacion
																? material.calificacion.toFixed(1)
																: '0.0'}
														</span>
													</div>
												</div>
												<div className="flex flex-wrap gap-2 mb-3">
													{material.tags && material.tags.length > 0 ? (
														material.tags.map((tag) => (
															<Chip
																key={tag}
																size="sm"
																variant="flat"
																color="primary"
															>
																{tag}
															</Chip>
														))
													) : (
														<Chip size="sm" variant="flat" color="primary">
															{material.materia}
														</Chip>
													)}
												</div>
												<div className="flex items-center gap-4 text-sm text-default-500">
													<div className="flex items-center gap-1">
														<Eye className="w-4 h-4" />
														<span>{material.vistas} vistas</span>
													</div>
													<div className="flex items-center gap-1">
														<Download className="w-4 h-4" />
														<span>{material.descargas} descargas</span>
													</div>
												</div>
											</div>
											<div className="flex flex-col gap-2">
												<Button
													isIconOnly
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenStats(material);
													}}
													title="Estadísticas"
												>
													<FileText className="w-4 h-4" />
												</Button>
												<Button
													isIconOnly
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenEdit(material);
													}}
													title="Editar"
												>
													<Edit2 className="w-4 h-4" />
												</Button>
												<Button
													isIconOnly
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenDelete(material);
													}}
													title="Eliminar"
												>
													<Trash2 className="w-4 h-4 text-danger" />
												</Button>
											</div>
										</div>
									) : (
										<div className="text-center space-y-3">
											<FileText className="w-12 h-12 text-[#8B1A1A] mx-auto" />
											<div>
												<h3 className="font-semibold text-sm mb-1 line-clamp-2">
													{material.nombre}
												</h3>
												<p className="text-xs text-default-600 mb-2">
													{material.tutor}
												</p>
											</div>
											<div className="flex flex-wrap gap-1 justify-center mb-2">
												{material.tags && material.tags.length > 0 ? (
													material.tags.slice(0, 2).map((tag) => (
														<Chip
															key={tag}
															size="sm"
															variant="flat"
															color="primary"
															className="text-xs"
														>
															{tag}
														</Chip>
													))
												) : (
													<Chip
														size="sm"
														variant="flat"
														color="primary"
														className="text-xs"
													>
														{material.materia}
													</Chip>
												)}
											</div>
											<div className="flex items-center justify-center gap-2 text-xs text-default-500 mb-3">
												<div className="flex items-center gap-1">
													<Eye className="w-3 h-3" />
													<span>{material.vistas}</span>
												</div>
												<div className="flex items-center gap-1">
													<Download className="w-3 h-3" />
													<span>{material.descargas}</span>
												</div>
												<div className="flex items-center gap-1">
													<Star className="w-3 h-3 text-yellow-500 fill-current" />
													<span>
														{material.calificacion
															? material.calificacion.toFixed(1)
															: '0.0'}
													</span>
												</div>
											</div>
											<div className="flex gap-2 justify-center">
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenStats(material);
													}}
													title="Estadísticas"
												>
													<FileText className="w-4 h-4" />
												</Button>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenEdit(material);
													}}
													title="Editar"
												>
													<Edit2 className="w-4 h-4" />
												</Button>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenDelete(material);
													}}
													title="Eliminar"
												>
													<Trash2 className="w-4 h-4 text-danger" />
												</Button>
											</div>
										</div>
									)}
								</CardBody>
							</Card>
						))}
					</div>

					{/* Paginación */}
					{totalPages > 1 && (
						<div className="flex justify-center mt-6">
							<Pagination
								page={currentPage}
								total={totalPages}
								onChange={(page) => {
									const newSkip = (page - 1) * itemsPerPage;
									setCurrentSkip(newSkip);
									window.scrollTo({ top: 0, behavior: 'smooth' });
								}}
							/>
						</div>
					)}
				</>
			)}

			{/* Sin resultados */}
			{!isLoading && materials.length === 0 && (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<FileText className="w-12 h-12 text-default-300 mx-auto mb-4" />
						<p className="text-default-600">
							No hay materiales que coincidan con tus filtros
						</p>
					</div>
				</div>
			)}

			{/* Modal de detalles */}
			{selectedMaterialId && (
				<Modal
					isOpen={isDetailOpen}
					onClose={onDetailClose}
					size="2xl"
					scrollBehavior="inside"
				>
					<ModalContent>
						{() => (
							<MaterialDetailModal
								materialId={selectedMaterialId}
								onClose={onDetailClose}
							/>
						)}
					</ModalContent>
				</Modal>
			)}

			{/* Modal de estadísticas */}
			{selectedMaterialForStats && (
				<Modal
					isOpen={isStatsOpen}
					onClose={onStatsClose}
					size="2xl"
					scrollBehavior="inside"
				>
					<ModalContent>
						{() => (
							<MaterialStatsModal
								material={selectedMaterialForStats}
								isOpen={isStatsOpen}
								onClose={onStatsClose}
							/>
						)}
					</ModalContent>
				</Modal>
			)}

			{/* Modal de edición */}
			{selectedMaterialForEdit && (
				<Modal
					isOpen={isEditOpen}
					onClose={onEditClose}
					size="2xl"
					scrollBehavior="inside"
				>
					<ModalContent>
						{(onClose) => (
							<EditMaterialForm
								materialId={selectedMaterialForEdit.id}
								onClose={onClose}
								onSuccess={onClose}
							/>
						)}
					</ModalContent>
				</Modal>
			)}

			{/* Modal de confirmación de eliminación */}
			{selectedMaterialForDelete && (
				<Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
					<ModalContent>
						{(onClose) => (
							<DeleteConfirmationModal
								materialId={selectedMaterialForDelete.id}
								materialName={selectedMaterialForDelete.nombre}
								onClose={onClose}
								onSuccess={onClose}
							/>
						)}
					</ModalContent>
				</Modal>
			)}
		</div>
	);
}
