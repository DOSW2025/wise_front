/**
 * Material Detail Modal Component
 * Modal para mostrar detalles completos del material
 */

import { Button, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react';
import { Download, Edit, Eye, Star, Trash2, X } from 'lucide-react';
import { useMaterial } from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface MaterialDetailModalProps {
	materialId: string;
	onClose: () => void;
	onEdit?: (material: Material) => void;
	onDelete?: (materialId: string) => void;
}

export function MaterialDetailModal({
	materialId,
	onClose,
	onEdit,
	onDelete,
}: MaterialDetailModalProps) {
	const { data: material, isLoading, error } = useMaterial(materialId);

	if (isLoading) {
		return (
			<Card className="w-full max-w-2xl">
				<CardBody className="p-6">
					<div className="flex justify-center items-center py-12">
						<div className="text-center">
							<Spinner size="lg" color="primary" />
							<p className="mt-4 text-default-600">Cargando material...</p>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (error || !material) {
		return (
			<Card className="w-full max-w-2xl">
				<CardBody className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-semibold">Error</h3>
						<Button isIconOnly variant="light" onPress={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>
					<p className="text-center text-danger py-8">
						No se pudo cargar el material. Intente nuevamente.
					</p>
				</CardBody>
			</Card>
		);
	}

	// Simular si el usuario actual es el creador del material
	const isOwner = material.tutor === 'Tutor Desarrollo'; // Mock check

	return (
		<Card className="w-full max-w-2xl">
			<CardBody className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold">Detalle del Material</h3>
					<Button isIconOnly variant="light" onPress={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<div className="space-y-6">
					{/* Información principal */}
					<div>
						<h4 className="text-2xl font-bold text-foreground mb-2">
							{material.nombre}
						</h4>
						<p className="text-default-600 mb-4">Por: {material.tutor}</p>

						<div className="flex flex-wrap gap-2 mb-4">
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

						{material.descripcion && (
							<p className="text-default-700 bg-default-100 p-3 rounded-lg">
								{material.descripcion}
							</p>
						)}
					</div>

					<Divider />

					{/* Estadísticas */}
					<div>
						<h5 className="font-semibold mb-3">Estadísticas</h5>
						<div className="grid grid-cols-3 gap-4">
							<div className="text-center p-3 bg-warning-50 rounded-lg">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Star className="w-4 h-4 text-warning-600" />
									<span className="font-semibold text-warning-700">
										{material.calificacion.toFixed(1)}
									</span>
								</div>
								<p className="text-xs text-warning-600">Calificación</p>
							</div>

							<div className="text-center p-3 bg-primary-50 rounded-lg">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Eye className="w-4 h-4 text-primary-600" />
									<span className="font-semibold text-primary-700">
										{material.vistas}
									</span>
								</div>
								<p className="text-xs text-primary-600">Vistas</p>
							</div>

							<div className="text-center p-3 bg-success-50 rounded-lg">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Download className="w-4 h-4 text-success-600" />
									<span className="font-semibold text-success-700">
										{material.descargas}
									</span>
								</div>
								<p className="text-xs text-success-600">Descargas</p>
							</div>
						</div>
					</div>

					<Divider />

					{/* Información adicional */}
					<div>
						<h5 className="font-semibold mb-3">Información</h5>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-default-600">Fecha de subida:</span>
								<span>{new Date(material.createdAt).toLocaleDateString()}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-default-600">Última actualización:</span>
								<span>{new Date(material.updatedAt).toLocaleDateString()}</span>
							</div>
						</div>
					</div>

					{/* Botones de acción */}
					<div className="flex gap-3 pt-4">
						<Button
							color="primary"
							startContent={<Download className="w-4 h-4" />}
							onPress={() => {
								// Simular descarga
								console.log('Descargando material:', material.id);
							}}
						>
							Descargar
						</Button>

						{/* Botones condicionados para el propietario */}
						{isOwner && (
							<>
								<Button
									variant="bordered"
									startContent={<Edit className="w-4 h-4" />}
									onPress={() => onEdit?.(material)}
								>
									Editar
								</Button>
								<Button
									color="danger"
									variant="bordered"
									startContent={<Trash2 className="w-4 h-4" />}
									onPress={() => onDelete?.(material.id)}
								>
									Eliminar
								</Button>
							</>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
