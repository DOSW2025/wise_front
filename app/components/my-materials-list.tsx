/**
 * My Materials List Component
 * Lista de materiales del usuario con controles de gestión
 */

import { Button, Card, CardBody, Chip, Spinner } from '@heroui/react';
import { Download, Edit, Eye, Star, Trash2 } from 'lucide-react';
import { useUserMaterials } from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface MyMaterialsListProps {
	userId: string;
	onEdit?: (material: Material) => void;
	onDelete?: (materialId: string) => void;
	onView?: (material: Material) => void;
}

export function MyMaterialsList({
	userId,
	onEdit,
	onDelete,
	onView,
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
		<div className="grid gap-4">
			{materials.map((material) => (
				<Card key={material.id} className="hover:shadow-md transition-shadow">
					<CardBody className="p-6">
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1">
								<div className="flex items-start justify-between mb-3">
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-1">
											{material.nombre}
										</h3>
										<p className="text-sm text-default-600">
											Subido el{' '}
											{new Date(material.createdAt).toLocaleDateString()}
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
									<Chip size="sm" variant="flat" color="default">
										Semestre {material.semestre}
									</Chip>
								</div>

								<div className="flex items-center gap-4 text-sm text-default-500 mb-4">
									<div className="flex items-center gap-1">
										<Eye className="w-4 h-4" />
										<span>{material.vistas} vistas</span>
									</div>
									<div className="flex items-center gap-1">
										<Download className="w-4 h-4" />
										<span>{material.descargas} descargas</span>
									</div>
								</div>

								{/* Controles de gestión */}
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="bordered"
										startContent={<Eye className="w-3 h-3" />}
										onPress={() => onView?.(material)}
									>
										Ver detalle
									</Button>
									<Button
										size="sm"
										variant="bordered"
										color="warning"
										startContent={<Edit className="w-3 h-3" />}
										onPress={() => onEdit?.(material)}
									>
										Editar
									</Button>
									<Button
										size="sm"
										variant="bordered"
										color="danger"
										startContent={<Trash2 className="w-3 h-3" />}
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
	);
}
