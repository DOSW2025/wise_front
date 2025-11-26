import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
} from '@heroui/react';
import { Filter, Grid3x3, List, Search, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import FiltersPanel from '~/components/materials/filtersPanel';
// Componentes
import MaterialCard from '~/components/materials/materialCard';
import PreviewModal from '~/components/materials/PreviewModal';
// Tipos y datos
import type { Material } from '~/components/materials/types';
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
	const [userRating, setUserRating] = useState(0);

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
			case 'Todos':
			case 'Más relevantes':
			default:
				filtered.sort(
					(a, b) => b.rating * b.downloads - a.rating * a.downloads,
				);
				break;
		}

		return filtered;
	}, [searchQuery, selectedSubject, selectedSemester, sortBy]);

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

	const handleAddComment = (material: Material) => {
		console.log('Agregando comentario a:', material.id);
		alert(`Redirigiendo a comentarios de: ${material.title}`);
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
				/>

				<Button
					variant="bordered"
					startContent={<Filter size={20} />}
					onClick={() => setIsFiltersOpen(!isFiltersOpen)}
				>
					Filtros
				</Button>
			</div>

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
						variant={viewMode === 'grid' ? 'solid' : 'flat'}
						className={viewMode === 'grid' ? 'bg-[#8B1A1A] text-white' : ''}
						onClick={() => setViewMode('grid')}
						type="button"
					>
						<Grid3x3 size={20} />
					</Button>
					<Button
						isIconOnly
						variant={viewMode === 'list' ? 'solid' : 'flat'}
						className={viewMode === 'list' ? 'bg-[#8B1A1A] text-white' : ''}
						onClick={() => setViewMode('list')}
						type="button"
					>
						<List size={20} />
					</Button>
				</div>
			</div>

			{/* Vista de materiales */}
			<div
				className={
					viewMode === 'grid'
						? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
						: 'space-y-4'
				}
			>
				{filteredMaterials.map((material) => (
					<MaterialCard
						key={material.id}
						material={material}
						viewMode={viewMode}
						onPreview={setPreviewMaterial}
						onDownload={handleDownload}
						onRate={setPreviewMaterial}
						onComment={handleAddComment}
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
				onComment={handleAddComment}
				onRatingChange={setUserRating}
			/>
		</div>
	);
}
