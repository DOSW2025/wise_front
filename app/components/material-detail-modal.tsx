/**
 * Material Detail Modal Component
 * Modal para mostrar detalles completos del material
 */

import { Button, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react';
import { Download, Edit, Eye, FileText, Star, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useDownloadMaterial, useMaterial } from '~/lib/hooks/useMaterials';
import { useToast } from '~/lib/hooks/useToast';
import { useViewTracker } from '~/lib/hooks/useViewTracker';
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
	const { trackView } = useViewTracker();
	const downloadMaterial = useDownloadMaterial();
	const { showToast } = useToast();

	// Registrar vista automáticamente al abrir el modal
	useEffect(() => {
		if (material) {
			trackView(materialId);
		}
	}, [material, materialId, trackView]);

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
					{/* Vista previa del archivo */}
					<div className="bg-gray-50 rounded-lg p-8 text-center">
						<FileText className="w-16 h-16 text-[#8B1A1A] mx-auto mb-3" />
						<p className="text-gray-600 text-sm mb-1">Archivo PDF</p>
						<p className="text-xs text-gray-500">{material.nombre}.pdf</p>
					</div>

					{/* Información principal */}
					<div>
						<h4 className="text-2xl font-bold text-foreground mb-2">
							{material.nombre}
						</h4>
						<p className="text-default-600 mb-4">Por: {material.tutor}</p>

						<div className="flex flex-wrap gap-2 mb-4">
							{material.tags && material.tags.length > 0 ? (
								material.tags.map((tag) => (
									<Chip key={tag} size="sm" variant="flat" color="primary">
										{tag}
									</Chip>
								))
							) : (
								<Chip
									size="sm"
									variant="flat"
									className="bg-gray-100 text-gray-700"
								>
									{material.materia}
								</Chip>
							)}
						</div>

						{material.descripcion && (
							<p className="text-default-700 bg-gray-50 p-3 rounded-lg text-sm">
								{material.descripcion}
							</p>
						)}
					</div>

					<Divider />

					{/* Calificación */}
					<div>
						<div className="flex items-center gap-2">
							<Star className="w-5 h-5 text-yellow-500 fill-current" />
							<span className="font-semibold">
								{(material.calificacion ?? 0).toFixed(1)}
							</span>
							<span className="text-sm text-gray-500">
								calificación promedio
							</span>
						</div>
					</div>

					<Divider />

					{/* Estadísticas */}
					<div>
						<h5 className="font-semibold mb-3">Estadísticas</h5>
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Eye className="w-4 h-4 text-gray-600" />
									<span className="font-semibold text-gray-700">
										{material.vistas}
									</span>
								</div>
								<p className="text-xs text-gray-600">Vistas</p>
							</div>

							<div className="text-center p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Download className="w-4 h-4 text-gray-600" />
									<span className="font-semibold text-gray-700">
										{material.descargas}
									</span>
								</div>
								<p className="text-xs text-gray-600">Descargas</p>
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
							className="bg-[#8B1A1A] text-white"
							startContent={<Download className="w-4 h-4" />}
							onPress={() => {
								downloadMaterial.mutate(material.id, {
									onSuccess: () => {
										showToast('Descarga iniciada correctamente', 'success');
									},
									onError: () => {
										showToast('Error al descargar el archivo', 'error');
									},
								});
							}}
							isLoading={downloadMaterial.isPending}
						>
							{downloadMaterial.isPending ? 'Descargando...' : 'Descargar'}
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
									variant="bordered"
									className="text-red-600 border-red-600 hover:bg-red-50"
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
