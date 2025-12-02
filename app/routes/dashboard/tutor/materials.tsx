import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Modal,
	ModalContent,
	Pagination,
	Select,
	SelectItem,
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
import { useState } from 'react';
import { DeleteConfirmationModal } from '~/components/delete-confirmation-modal';
import { EditMaterialForm } from '~/components/edit-material-form';
import { MaterialDetailModal } from '~/components/material-detail-modal';
import { MaterialStatsModal } from '~/components/material-stats-modal';
import { MyMaterialsList } from '~/components/my-materials-list';
import { PopularMaterials } from '~/components/popular-materials';
import { UploadMaterialForm } from '~/components/upload-material-form';
import { useDebounce } from '~/lib/hooks/useDebounce';
import {
	useMaterials,
	useSubjects,
	useUserMaterials,
} from '~/lib/hooks/useMaterials';
import type { MaterialFilters } from '~/lib/types/api.types';

const ITEMS_PER_PAGE = 12;

export default function TutorMaterials() {
	const [filters, setFilters] = useState<MaterialFilters>({});
	const [showFilters, setShowFilters] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebounce(searchTerm, 500);
	const { isOpen, onOpen, onClose } = useDisclosure();
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
	const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
		null,
	);
	const [selectedMaterialName, setSelectedMaterialName] = useState('');
	const [selectedMaterialForStats, setSelectedMaterialForStats] =
		useState<any>(null);
	const [activeTab, setActiveTab] = useState('all');
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

	// Combinar filtros con búsqueda debounced y paginación
	const combinedFilters = {
		...filters,
		search: debouncedSearch || undefined,
		page,
		limit: ITEMS_PER_PAGE,
	};

	const { data: materialsResponse, isLoading } = useMaterials(combinedFilters);
	const materials = materialsResponse?.data || [];
	const totalPages = materialsResponse?.pagination?.totalPages || 1;
	const totalItems = materialsResponse?.pagination?.totalItems || 0;
	const { data: userMaterials = [] } = useUserMaterials('dev-tutor-1');
	const { data: subjects = [] } = useSubjects();

	const handleFilterChange = (
		key: keyof MaterialFilters,
		value: string | number | undefined,
	) => {
		setFilters((prev) => ({ ...prev, [key]: value || undefined }));
		setPage(1); // Reset to first page when filters change
	};

	const clearFilters = () => {
		setFilters({});
		setSearchTerm('');
		setPage(1);
	};

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setPage(1); // Reset to first page on search
	};

	const hasActiveFilters = filters.subject || filters.semester || searchTerm;

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
							Filtros{' '}
							{hasActiveFilters &&
								`(${Object.values(filters).filter(Boolean).length})`}
						</Button>

						{/* Indicadores de filtros activos */}
						{hasActiveFilters && (
							<div className="flex flex-wrap gap-2">
								{filters.subject && (
									<Chip size="sm" color="primary" variant="flat">
										Materia: {filters.subject}
									</Chip>
								)}
								{filters.semester && (
									<Chip size="sm" color="default" variant="flat">
										Semestre: {filters.semester}
									</Chip>
								)}
							</div>
						)}
					</div>

					{/* Panel de filtros expandible */}
					{showFilters && (
						<Card>
							<CardBody className="p-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h4 className="font-semibold">Filtrar materiales</h4>
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

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Select
											label="Materia"
											placeholder="Seleccionar materia"
											selectedKeys={filters.subject ? [filters.subject] : []}
											onSelectionChange={(keys) => {
												const value = Array.from(keys)[0] as string;
												handleFilterChange('subject', value);
											}}
											size="sm"
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
											selectedKeys={
												filters.semester ? [filters.semester.toString()] : []
											}
											onSelectionChange={(keys) => {
												const selectedArray = Array.from(keys);
												const value = selectedArray[0] as string;
												handleFilterChange(
													'semester',
													value ? Number(value) : undefined,
												);
											}}
											size="sm"
										>
											{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semester) => (
												<SelectItem key={semester} value={semester}>
													Semestre {semester}
												</SelectItem>
											))}
										</Select>
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
																	{material.calificacion.toFixed(1)}
																</span>
															</div>
														</div>
														<div className="flex flex-wrap gap-2 mb-3">
															<Chip size="sm" variant="flat" color="primary">
																{material.materia}
															</Chip>
															<Chip size="sm" variant="flat">
																Semestre {material.semestre}
															</Chip>
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
														<Chip
															size="sm"
															variant="flat"
															color="primary"
															className="text-xs"
														>
															{material.materia}
														</Chip>
													</div>
													<div className="flex items-center justify-between text-xs text-default-500">
														<div className="flex items-center gap-1">
															<Star className="w-3 h-3 text-yellow-500 fill-current" />
															<span>{material.calificacion.toFixed(1)}</span>
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
									page={page}
									total={totalPages}
									onChange={setPage}
								/>
							</div>
						</>
					)}
				</>
			)}

			{/* Tab de Mis Materiales */}
			{activeTab === 'mine' && (
				<MyMaterialsList
					userId="dev-tutor-1"
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
					onMaterialClick={(material) => {
						setSelectedMaterialId(material.id);
						onDetailOpen();
					}}
				/>
			)}

			{/* Modal de subida */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="2xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					<UploadMaterialForm
						onClose={onClose}
						onSuccess={() => {
							// Refrescar la lista de materiales
							setPage(1);
							window.location.reload();
						}}
					/>
				</ModalContent>
			</Modal>

			{/* Modal de detalle */}
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
							onEdit={(material) => {
								onDetailClose();
								setSelectedMaterialId(material.id);
								onEditOpen();
							}}
							onDelete={(materialId) => {
								onDetailClose();
								const material = materials.find((m) => m.id === materialId);
								if (material) {
									setSelectedMaterialId(materialId);
									setSelectedMaterialName(material.nombre);
									onDeleteOpen();
								}
							}}
						/>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de edición */}
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
