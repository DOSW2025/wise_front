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
	FileText,
	Filter,
	Grid3X3,
	List,
	Search,
	X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { MaterialCard } from '~/components/admin/material-card';
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
	const _queryClient = useQueryClient();
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
	const combinedFilters = useMemo(
		() => ({
			...filters,
			search: debouncedSearch || undefined,
			skip: currentSkip,
			take: itemsPerPage,
		}),
		[filters, debouncedSearch, currentSkip, itemsPerPage],
	);

	const { data: materialsResponse, isLoading } = useMaterials(combinedFilters);

	// Filtrar materiales por tags seleccionados con useMemo
	const materials = useMemo(() => {
		let filteredMaterials = materialsResponse?.data || [];

		if (selectedTags.length > 0) {
			filteredMaterials = filteredMaterials.filter((material) =>
				selectedTags.some((tag) =>
					material.tags?.some(
						(materialTag) => materialTag.toLowerCase() === tag.toLowerCase(),
					),
				),
			);
		}

		return filteredMaterials;
	}, [materialsResponse?.data, selectedTags]);

	const totalPages = materialsResponse?.pagination?.totalPages || 1;
	const totalItems = materialsResponse?.pagination?.totalItems || 0;
	const currentPage = Math.floor(currentSkip / itemsPerPage) + 1;

	// Handlers memoizados con useCallback
	const handleAddTag = useCallback(() => {
		if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
			setSelectedTags((prev) => [...prev, tagInput.trim()]);
			setTagInput('');
			setCurrentSkip(0);
		}
	}, [tagInput, selectedTags]);

	const handleRemoveTag = useCallback((tagToRemove: string) => {
		setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
		setCurrentSkip(0);
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleAddTag();
			}
		},
		[handleAddTag],
	);

	const clearFilters = useCallback(() => {
		setFilters({});
		setSearchTerm('');
		setSelectedTags([]);
		setTagInput('');
		setCurrentSkip(0);
	}, []);

	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
		setCurrentSkip(0);
	}, []);

	const hasActiveFilters = selectedTags.length > 0 || searchTerm;

	const handleOpenDetail = useCallback(
		(materialId: string) => {
			setSelectedMaterialId(materialId);
			onDetailOpen();
		},
		[onDetailOpen],
	);

	const handleOpenStats = useCallback(
		(material: Material) => {
			setSelectedMaterialForStats(material);
			onStatsOpen();
		},
		[onStatsOpen],
	);

	const handleOpenEdit = useCallback(
		(material: Material) => {
			setSelectedMaterialForEdit(material);
			onEditOpen();
		},
		[onEditOpen],
	);

	const handleOpenDelete = useCallback(
		(material: Material) => {
			setSelectedMaterialForDelete(material);
			onDeleteOpen();
		},
		[onDeleteOpen],
	);

	// Handler para cuando se completa exitosamente una edición o eliminación
	const handleSuccess = useCallback(() => {
		// Invalidar todas las queries de materiales para refrescar la lista
		queryClient.invalidateQueries({ queryKey: ['materials'] });
	}, []);

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
							<MaterialCard
								key={material.id}
								material={material}
								viewMode={viewMode}
								onOpenDetail={handleOpenDetail}
								onOpenStats={handleOpenStats}
								onOpenEdit={handleOpenEdit}
								onOpenDelete={handleOpenDelete}
							/>
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
								onSuccess={() => {
									handleSuccess();
									onClose();
								}}
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
								onSuccess={() => {
									handleSuccess();
									onClose();
								}}
							/>
						)}
					</ModalContent>
				</Modal>
			)}
		</div>
	);
}
