/**
 * Delete Confirmation Modal Component
 * Modal de confirmación para evitar eliminaciones accidentales
 */

import { Button, Card, CardBody } from '@heroui/react';
import { AlertTriangle, X } from 'lucide-react';
import { useDeleteMaterial } from '~/lib/hooks/useMaterials';

interface DeleteConfirmationModalProps {
	materialId: string;
	materialName: string;
	onClose: () => void;
	onSuccess?: () => void;
}

export function DeleteConfirmationModal({
	materialId,
	materialName,
	onClose,
	onSuccess,
}: DeleteConfirmationModalProps) {
	const deleteMaterial = useDeleteMaterial();

	const handleDelete = async () => {
		try {
			await deleteMaterial.mutateAsync(materialId);
			onSuccess?.();
			onClose();
		} catch (_error) {
			// El error se maneja en el hook
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardBody className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-danger-100 rounded-full">
							<AlertTriangle className="w-5 h-5 text-danger-600" />
						</div>
						<h3 className="text-lg font-semibold text-foreground">
							Confirmar Eliminación
						</h3>
					</div>
					<Button
						isIconOnly
						variant="light"
						onPress={onClose}
						isDisabled={deleteMaterial.isPending}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<div className="space-y-4">
					<p className="text-default-600">
						¿Estás seguro de que deseas eliminar el material{' '}
						<span className="font-semibold text-foreground">
							"{materialName}"
						</span>
						?
					</p>

					<p className="text-sm text-danger-600 bg-danger-50 p-3 rounded-lg">
						Esta acción no se puede deshacer. El material será eliminado
						permanentemente.
					</p>

					<div className="flex gap-3 pt-2">
						<Button
							color="danger"
							onPress={handleDelete}
							isLoading={deleteMaterial.isPending}
							className="flex-1"
						>
							{deleteMaterial.isPending ? 'Eliminando...' : 'Eliminar'}
						</Button>
						<Button
							variant="bordered"
							onPress={onClose}
							isDisabled={deleteMaterial.isPending}
							className="flex-1"
						>
							Cancelar
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
