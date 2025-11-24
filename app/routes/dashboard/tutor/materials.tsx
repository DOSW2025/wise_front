import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Modal,
	ModalContent,
	Select,
	SelectItem,
	Spinner,
	useDisclosure,
} from '@heroui/react';
import {
	ChevronDown,
	ChevronUp,
	Download,
	Eye,
	Filter,
	Plus,
	Search,
	Star,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { MaterialDetailModal } from '~/components/material-detail-modal';
import { UploadMaterialForm } from '~/components/upload-material-form';
import { useDebounce } from '~/lib/hooks/useDebounce';
import {
	useMaterials,
	useResourceTypes,
	useSubjects,
} from '~/lib/hooks/useMaterials';
import type { MaterialFilters } from '~/lib/types/api.types';

export default function TutorMaterials() {
	const [filters, setFilters] = useState<MaterialFilters>({});
	const [showFilters, setShowFilters] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearch = useDebounce(searchTerm, 500);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isDetailOpen,
		onOpen: onDetailOpen,
		onClose: onDetailClose,
	} = useDisclosure();
	const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
		null,
	);

	// Combinar filtros con búsqueda debounced
	const combinedFilters = {
		...filters,
		search: debouncedSearch || undefined,
	};

	const { data: materials = [], isLoading } = useMaterials(combinedFilters);
	const { data: subjects = [] } = useSubjects();
	const { data: resourceTypes = [] } = useResourceTypes();

	const handleFilterChange = (
		key: keyof MaterialFilters,
		value: string | number | undefined,
	) => {
		setFilters((prev) => ({ ...prev, [key]: value || undefined }));
	};

	const clearFilters = () => {
		setFilters({});
		setSearchTerm('');
	};

	const hasActiveFilters =
		filters.subject || filters.resourceType || filters.semester || searchTerm;

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

			{/* Buscador */}
			<div className="w-full max-w-md">
				<Input
					placeholder="Buscar materiales..."
					value={searchTerm}
					onValueChange={setSearchTerm}
					startContent={<Search className="w-4 h-4 text-default-400" />}
					isClearable
					onClear={() => setSearchTerm('')}
					classNames={{
						input: 'text-sm',
					}}
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
							{filters.resourceType && (
								<Chip size="sm" color="secondary" variant="flat">
									Tipo: {filters.resourceType}
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

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
										label="Tipo de recurso"
										placeholder="Seleccionar tipo"
										selectedKeys={
											filters.resourceType ? [filters.resourceType] : []
										}
										onSelectionChange={(keys) => {
											const value = Array.from(keys)[0] as string;
											handleFilterChange('resourceType', value);
										}}
										size="sm"
									>
										{resourceTypes.map((type) => (
											<SelectItem key={type.nombre} value={type.nombre}>
												{type.nombre}
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
							<p className="text-default-500">No se encontraron materiales.</p>
						</div>
					</CardBody>
				</Card>
			)}

			{/* Lista de materiales */}
			{!isLoading && materials.length > 0 && (
				<div className="grid gap-4">
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
							<CardBody className="p-6">
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
											<Chip size="sm" variant="flat" color="secondary">
												{material.tipo}
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
							</CardBody>
						</Card>
					))}
				</div>
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
								console.log('Editar material:', material);
								// Aquí se abriría el formulario de edición
							}}
							onDelete={(materialId) => {
								console.log('Eliminar material:', materialId);
								// Aquí se mostraría confirmación de eliminación
							}}
						/>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
