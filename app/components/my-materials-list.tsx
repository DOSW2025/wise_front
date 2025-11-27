/**
 * My Materials List Component
 * Lista de materiales del usuario con controles de gestión
 */

import { Button, Card, CardBody, Chip, Spinner } from '@heroui/react';
import {
	BarChart3,
	CheckCircle,
	Clock,
	Download,
	Edit,
	Eye,
	FileText,
	Star,
	Trash2,
	XCircle,
} from 'lucide-react';
import { useUserMaterials } from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface MyMaterialsListProps {
	userId: string;
	onEdit?: (material: Material) => void;
	onDelete?: (materialId: string) => void;
	onView?: (material: Material) => void;
	onStats?: (material: Material) => void;
}

export function MyMaterialsList({
	userId,
	onEdit,
	onDelete,
	onView,
	onStats,
}: MyMaterialsListProps) {
	const { data: materials = [], isLoading, error } = useUserMaterials(userId);

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
		<div className="space-y-3">
			{materials.map((material) => (
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
											{material.calificacion.toFixed(1)}
										</span>
									</div>
								</div>

								{/* Metadatos y estado */}
								<div className="flex items-center gap-4 mb-3">
									<Chip
										size="sm"
										variant="flat"
										className="bg-gray-100 text-gray-700"
									>
										{material.materia}
									</Chip>

									{/* Estado de revisión */}
									{(() => {
										// Simular estado basado en ID para demo
										const status = material.id.endsWith('1')
											? 'approved'
											: material.id.endsWith('2')
												? 'pending'
												: 'rejected';

										if (status === 'approved') {
											return (
												<Chip
													size="sm"
													variant="flat"
													className="bg-green-100 text-green-700"
													startContent={<CheckCircle className="w-3 h-3" />}
												>
													Aprobado
												</Chip>
											);
										} else if (status === 'pending') {
											return (
												<Chip
													size="sm"
													variant="flat"
													className="bg-yellow-100 text-yellow-700"
													startContent={<Clock className="w-3 h-3" />}
												>
													En revisión
												</Chip>
											);
										} else {
											return (
												<Chip
													size="sm"
													variant="flat"
													className="bg-red-100 text-red-700"
													startContent={<XCircle className="w-3 h-3" />}
												>
													Rechazado
												</Chip>
											);
										}
									})()}

									<div className="flex items-center gap-3 text-sm text-gray-500">
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

									{/* Botón de estadísticas solo para materiales aprobados */}
									{(() => {
										const status = material.id.endsWith('1')
											? 'approved'
											: material.id.endsWith('2')
												? 'pending'
												: 'rejected';

										if (status === 'approved') {
											return (
												<Button
													size="sm"
													variant="flat"
													className="text-blue-600 hover:text-blue-700"
													startContent={<BarChart3 className="w-4 h-4" />}
													onPress={() => onStats?.(material)}
												>
													Estadísticas
												</Button>
											);
										}
										return null;
									})()}

									{/* Solo mostrar editar/eliminar si está aprobado o en revisión */}
									{(() => {
										const status = material.id.endsWith('1')
											? 'approved'
											: material.id.endsWith('2')
												? 'pending'
												: 'rejected';

										if (status !== 'rejected') {
											return (
												<>
													<Button
														size="sm"
														variant="flat"
														className="text-gray-600 hover:text-gray-900"
														startContent={<Edit className="w-4 h-4" />}
														onPress={() => onEdit?.(material)}
														isDisabled={status === 'pending'}
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
												</>
											);
										}
										return null;
									})()}
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			))}
		</div>
	);
}
