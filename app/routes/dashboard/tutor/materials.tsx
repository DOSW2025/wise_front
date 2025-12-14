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
	Tab,
	Tabs,
	useDisclosure,
} from '@heroui/react';
import {
	ChevronDown,
	ChevronUp,
	Download,
	Eye,
	FileText,
	Filter,
	Grid3X3,
	List,
	Plus,
	Search,
	Star,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from '~/components/delete-confirmation-modal';
import { EditMaterialForm } from '~/components/edit-material-form';
import { MaterialDetailModal } from '~/components/material-detail-modal';
import { MaterialStatsModal } from '~/components/material-stats-modal';
import { MyMaterialsList } from '~/components/my-materials-list';
import { PopularMaterials } from '~/components/popular-materials';
import { useAuth } from '~/contexts/auth-context';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { useMaterials, useUserMaterials } from '~/lib/hooks/useMaterials';
import type { Material, MaterialFilters } from '~/lib/types/api.types';

const ITEMS_PER_PAGE_LIST = 15;
const ITEMS_PER_PAGE_GRID = 15;

export default function TutorMaterials() {
	const { user } = useAuth();
	const userId = user?.id;

	const [filters, setFilters] = useState<MaterialFilters>({});
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentSkip, setCurrentSkip] = useState(0);
	const debouncedSearch = useDebounce(searchTerm, 500);
	const {
		isOpen: isDetailOpen,
		onOpen: onDetailOpen,
		onClose: onDetailClose,
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
	const {
		isOpen: isStatsOpen,
		onOpen: onStatsOpen,
		onClose: onStatsClose,
	} = useDisclosure();
	const { onOpen } = useDisclosure();
	const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
		null,
	);
	const [selectedMaterialName, setSelectedMaterialName] = useState('');
	const [selectedMaterialForStats, setSelectedMaterialForStats] =
		useState<Material | null>(null);
	const [activeTab, setActiveTab] = useState('all');
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
	const { data: userMaterials = [] } = useUserMaterials(userId || '');

	// Resetear paginación cuando cambia el modo de vista
	useEffect(() => {
		setCurrentSkip(0);
	}, []);

	const _handleFilterChange = (
		key: keyof MaterialFilters,
		value: string | number | undefined,
	) => {
		setFilters((prev) => ({ ...prev, [key]: value || undefined }));
		setCurrentSkip(0); // Reset to first page when filters change
	};

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
		setCurrentSkip(0); // Reset to first page on search
	};

	const hasActiveFilters = selectedTags.length > 0 || searchTerm;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Banco de Materiales
					</h1>
					<p className="text-default-500">
						Gestiona y comparte materiales educativos.
					</p>
				</div>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onPress={onOpen}
				>
					Subir Material
				</Button>
			</div>

			{/* Tabs de navegación */}
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key) => setActiveTab(key as string)}
				color="primary"
				variant="underlined"
			>
				<Tab key="all" title="Todos los Materiales" />
				<Tab key="mine" title="Mis Materiales" />
				<Tab key="popular" title="Estadísticas Generales" />
			</Tabs>

			{/* Buscador y controles de vista - solo en tab "all" */}
			{activeTab === 'all' && (
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="w-full max-w-md">
						<Input
							placeholder="Buscar materiales..."
							value={searchTerm}
							onValueChange={handleSearch}
							startContent={<Search className="w-4 h-4 text-default-400" />}
							isClearable
							onClear={() => handleSearch('')}
							classNames={{
								input: 'text-sm',
							}}
						/>
					</div>
					<div className="flex gap-2">
						<Button
							isIconOnly
							variant={viewMode === 'list' ? 'solid' : 'bordered'}
							color={viewMode === 'list' ? 'primary' : 'default'}
							onPress={() => setViewMode('list')}
							size="sm"
						>
							<List className="w-4 h-4" />
						</Button>
						<Button
							isIconOnly
							variant={viewMode === 'grid' ? 'solid' : 'bordered'}
							color={viewMode === 'grid' ? 'primary' : 'default'}
							onPress={() => setViewMode('grid')}
							size="sm"
						>
							<Grid3X3 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Filtros - solo en tab "all" */}
			{activeTab === 'all' && (
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
											htmlFor="add-tags-input"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Agregar Tags
										</label>
										<div className="flex gap-2">
											<Input
												id="add-tags-input"
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
			)}

			{/* Contenido según tab activo */}
			{activeTab === 'all' && (
				<>
					{/* Estado de carga */}
					{isLoading && (
						<div className="flex justify-center py-12">
							<div className="text-center">
								<Spinner size="lg" color="primary" />
								<p className="mt-4 text-default-600">Cargando...</p>
							</div>
						</div>
					)}

					{/* Sin resultados */}
					{!isLoading && materials.length === 0 && (
						<Card>
							<CardBody>
								<div className="text-center py-12">
									<div className="text-6xl mb-4">📚</div>
									<h3 className="text-xl font-semibold mb-2">Sin resultados</h3>
									<p className="text-default-500">
										No se encontraron materiales.
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Lista/Cuadrícula de materiales */}
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
										onPress={() => {
											setSelectedMaterialId(material.id);
											onDetailOpen();
										}}
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
												</div>
											) : (
												<div className="text-center">
													<FileText className="w-12 h-12 text-[#8B1A1A] mx-auto mb-3" />
													<h3 className="font-semibold text-sm mb-1 line-clamp-2">
														{material.nombre}
													</h3>
													<p className="text-xs text-default-600 mb-2">
														{material.tutor}
													</p>
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
													<div className="flex items-center justify-between text-xs text-default-500">
														<div className="flex items-center gap-1">
															<Star className="w-3 h-3 text-yellow-500 fill-current" />
															<span>
																{material.calificacion
																	? material.calificacion.toFixed(1)
																	: '0.0'}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<Eye className="w-3 h-3" />
															<span>{material.vistas}</span>
														</div>
													</div>
												</div>
											)}
										</CardBody>
									</Card>
								))}
							</div>

							{/* Paginación */}
							<div className="flex w-full justify-between items-center mt-6">
								<span className="text-small text-default-400">
									Total {totalItems} materiales
								</span>
								<Pagination
									isCompact
									showControls
									showShadow
									color="primary"
									page={currentPage}
									total={totalPages}
									onChange={(page) => setCurrentSkip((page - 1) * itemsPerPage)}
								/>
							</div>
						</>
					)}
				</>
			)}

			{/* Tab de Mis Materiales */}
			{activeTab === 'mine' && (
				<MyMaterialsList
					userId={userId || ''}
					onView={(material) => {
						setSelectedMaterialId(material.id);
						onDetailOpen();
					}}
					onEdit={(material) => {
						setSelectedMaterialId(material.id);
						onEditOpen();
					}}
					onDelete={(materialId) => {
						const material = userMaterials.find((m) => m.id === materialId);
						if (material) {
							setSelectedMaterialId(materialId);
							setSelectedMaterialName(material.nombre);
							onDeleteOpen();
						}
					}}
					onStats={(material) => {
						setSelectedMaterialForStats(material);
						onStatsOpen();
					}}
				/>
			)}

			{/* Tab de Materiales Populares */}
			{activeTab === 'popular' && (
				<PopularMaterials
					userId={userId}
					onMaterialClick={(material) => {
						setSelectedMaterialId(material.id);
						onDetailOpen();
					}}
				/>
			)}

			{/* Modal de detalle de material */}
			<Modal
				isOpen={isDetailOpen}
				onClose={onDetailClose}
				size="2xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					{selectedMaterialId && (
						<MaterialDetailModal
							materialId={selectedMaterialId}
							onClose={onDetailClose}
						/>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de subir material */}
			<Modal
				isOpen={isEditOpen}
				onClose={onEditClose}
				size="2xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					{selectedMaterialId && (
						<EditMaterialForm
							materialId={selectedMaterialId}
							onClose={onEditClose}
							onSuccess={() => {
								console.log('Material actualizado correctamente');
							}}
						/>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de confirmación de eliminación */}
			<Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
				<ModalContent>
					{selectedMaterialId && (
						<DeleteConfirmationModal
							materialId={selectedMaterialId}
							materialName={selectedMaterialName}
							onClose={onDeleteClose}
							onSuccess={() => {
								console.log('Material eliminado correctamente');
							}}
						/>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de estadísticas */}
			<MaterialStatsModal
				material={selectedMaterialForStats}
				isOpen={isStatsOpen}
				onClose={onStatsClose}
			/>
		</div>
	);
}
