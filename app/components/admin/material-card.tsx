/**
 * Material Card Component - Optimized
 * Card optimizada para mostrar materiales con React.memo
 */

import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Download, Edit2, Eye, FileText, Star, Trash2 } from 'lucide-react';
import { memo } from 'react';
import type { Material } from '~/lib/types/api.types';

interface MaterialCardProps {
	material: Material;
	viewMode: 'list' | 'grid';
	onOpenDetail: (materialId: string) => void;
	onOpenStats: (material: Material) => void;
	onOpenEdit: (material: Material) => void;
	onOpenDelete: (material: Material) => void;
}

const MaterialCard = memo(
	({
		material,
		viewMode,
		onOpenDetail,
		onOpenStats,
		onOpenEdit,
		onOpenDelete,
	}: MaterialCardProps) => {
		const handleCardClick = () => {
			onOpenDetail(material.id);
		};

		const handleStatsClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			onOpenStats(material);
		};

		const handleEditClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			onOpenEdit(material);
		};

		const handleDeleteClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			onOpenDelete(material);
		};

		if (viewMode === 'list') {
			return (
				<Card
					className="hover:shadow-md transition-shadow cursor-pointer"
					isPressable
					onPress={handleCardClick}
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
											{material.calificacion
												? material.calificacion.toFixed(1)
												: '0.0'}
										</span>
									</div>
								</div>
								<div className="flex flex-wrap gap-2 mb-3">
									{material.tags && material.tags.length > 0 ? (
										material.tags.map((tag) => (
											<Chip key={tag} size="sm" variant="flat" color="primary">
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
							<div className="flex flex-col gap-2 ml-4">
								<Button
									isIconOnly
									variant="light"
									onClick={handleStatsClick}
									title="Estadísticas"
								>
									<FileText className="w-4 h-4" />
								</Button>
								<Button
									isIconOnly
									variant="light"
									onClick={handleEditClick}
									title="Editar"
								>
									<Edit2 className="w-4 h-4" />
								</Button>
								<Button
									isIconOnly
									variant="light"
									onClick={handleDeleteClick}
									title="Eliminar"
								>
									<Trash2 className="w-4 h-4 text-danger" />
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			);
		}

		// Grid View
		return (
			<Card
				className="hover:shadow-md transition-shadow cursor-pointer"
				isPressable
				onPress={handleCardClick}
			>
				<CardBody className="p-4">
					<div className="text-center space-y-3">
						<FileText className="w-12 h-12 text-[#8B1A1A] mx-auto" />
						<div>
							<h3 className="font-semibold text-sm mb-1 line-clamp-2">
								{material.nombre}
							</h3>
							<p className="text-xs text-default-600 mb-2">{material.tutor}</p>
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
								onClick={handleStatsClick}
								title="Estadísticas"
							>
								<FileText className="w-4 h-4" />
							</Button>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								onClick={handleEditClick}
								title="Editar"
							>
								<Edit2 className="w-4 h-4" />
							</Button>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								onClick={handleDeleteClick}
								title="Eliminar"
							>
								<Trash2 className="w-4 h-4 text-danger" />
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	},
	// Comparación personalizada para evitar re-renders innecesarios
	(prevProps, nextProps) => {
		return (
			prevProps.material.id === nextProps.material.id &&
			prevProps.material.nombre === nextProps.material.nombre &&
			prevProps.material.vistas === nextProps.material.vistas &&
			prevProps.material.descargas === nextProps.material.descargas &&
			prevProps.material.calificacion === nextProps.material.calificacion &&
			prevProps.viewMode === nextProps.viewMode
		);
	},
);

MaterialCard.displayName = 'MaterialCard';

export { MaterialCard };
