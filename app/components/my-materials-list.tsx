/**
 * My Materials List Component
 * Lista de materiales del usuario con controles de gestión
 */

import {
	Button,
	Card,
	CardBody,
	Chip,
	Pagination,
	Spinner,
} from '@heroui/react';
import {
	BarChart3,
	CheckCircle,
	Download,
	Edit,
	Eye,
	FileText,
	Star,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useUserMaterials } from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface MyMaterialsListProps {
	userId: string;
	onEdit?: (material: Material) => void;
	onDelete?: (materialId: string) => void;
	onView?: (material: Material) => void;
	onStats?: (material: Material) => void;
}

const ITEMS_PER_PAGE = 15;

export function MyMaterialsList({
	userId,
	onEdit,
	onDelete,
	onView,
	onStats,
}: MyMaterialsListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const { data: materials = [], isLoading } = useUserMaterials(userId);

	// Calcular paginación
	const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedMaterials = materials.slice(startIndex, endIndex);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="text-center">
					<Spinner size="lg" color="primary" />
					<p className="mt-4 text-default-600">Cargando tus materiales...</p>
				</div>
			</div>
		);
	}

	if (materials.length === 0) {
		return (
			<Card>
				<CardBody>
					<div className="text-center py-12">
						<div className="text-6xl mb-4">📝</div>
						<h3 className="text-xl font-semibold text-default-700 mb-2">
							No tienes materiales subidos
						</h3>
						<p className="text-default-500">
							Comienza subiendo tu primer material educativo.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Lista de materiales */}
			<div className="space-y-3">
				{paginatedMaterials.map((material) => (
					<Card
						key={material.id}
						className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm"
					>
						<CardBody className="p-5">
							<div className="flex items-start gap-4">
								{/* Icono del archivo */}
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
										<FileText className="w-6 h-6 text-[#8B1A1A]" />
									</div>
								</div>

								{/* Contenido principal */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1 min-w-0">
											<h3 className="text-lg font-semibold text-gray-900 truncate">
												{material.nombre}
											</h3>
											<p className="text-sm text-gray-500 mt-1">
												Subido el{' '}
												{new Date(material.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="flex items-center gap-1 ml-4">
											<Star className="w-4 h-4 text-yellow-500 fill-current" />
											<span className="text-sm font-medium text-gray-700">
												{(material.calificacion ?? 0).toFixed(1)}
											</span>
										</div>
									</div>

									{/* Metadatos y estado */}
									<div className="flex flex-wrap items-center gap-2 mb-3">
										{/* Tags del material */}
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

										{/* Estado de revisión - Siempre aprobado */}
										<Chip
											size="sm"
											variant="flat"
											className="bg-green-100 text-green-700"
											startContent={<CheckCircle className="w-3 h-3" />}
										>
											Aprobado
										</Chip>

										<div className="flex items-center gap-3 text-sm text-gray-500 ml-auto">
											<div className="flex items-center gap-1">
												<Eye className="w-4 h-4" />
												<span>{material.vistas}</span>
											</div>
											<div className="flex items-center gap-1">
												<Download className="w-4 h-4" />
												<span>{material.descargas}</span>
											</div>
										</div>
									</div>

									{/* Acciones */}
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											variant="flat"
											className="text-gray-600 hover:text-gray-900"
											startContent={<Eye className="w-4 h-4" />}
											onPress={() => onView?.(material)}
										>
											Ver
										</Button>

										{/* Botón de estadísticas */}
										<Button
											size="sm"
											variant="flat"
											className="text-blue-600 hover:text-blue-700"
											startContent={<BarChart3 className="w-4 h-4" />}
											onPress={() => onStats?.(material)}
										>
											Estadísticas
										</Button>

										{/* Editar y eliminar */}
										<Button
											size="sm"
											variant="flat"
											className="text-gray-600 hover:text-gray-900"
											startContent={<Edit className="w-4 h-4" />}
											onPress={() => onEdit?.(material)}
										>
											Editar
										</Button>
										<Button
											size="sm"
											variant="flat"
											className="text-red-600 hover:text-red-700"
											startContent={<Trash2 className="w-4 h-4" />}
											onPress={() => onDelete?.(material.id)}
										>
											Eliminar
										</Button>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* Paginación */}
			{totalPages > 1 && (
				<div className="flex w-full justify-between items-center mt-6">
					<span className="text-small text-default-400">
						Total {materials.length} materiales
					</span>
					<Pagination
						isCompact
						showControls
						showShadow
						color="primary"
						page={currentPage}
						total={totalPages}
						onChange={(page) => setCurrentPage(page)}
					/>
				</div>
			)}
		</div>
	);
}
