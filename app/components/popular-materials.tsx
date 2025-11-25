/**
 * Popular Materials Component
 * Sección de materiales más vistos y descargados
 */

import {
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Spinner,
} from '@heroui/react';
import { Download, Eye, Star, TrendingUp } from 'lucide-react';
import { usePopularMaterials } from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface PopularMaterialsProps {
	onMaterialClick?: (material: Material) => void;
}

export function PopularMaterials({ onMaterialClick }: PopularMaterialsProps) {
	const { data: popularData, isLoading, error } = usePopularMaterials();

	if (isLoading) {
		return (
			<Card>
				<CardBody>
					<div className="flex justify-center items-center py-8">
						<div className="text-center">
							<Spinner size="lg" color="primary" />
							<p className="mt-4 text-default-600">
								Cargando materiales populares...
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (error || !popularData) {
		return (
			<Card>
				<CardBody>
					<div className="text-center py-8">
						<p className="text-danger">Error al cargar materiales populares</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	const renderMaterialCard = (material: Material, rank: number) => (
		<Card
			key={material.id}
			isPressable
			onPress={() => onMaterialClick?.(material)}
			className="hover:shadow-md transition-shadow"
		>
			<CardBody className="p-4">
				<div className="flex items-start gap-3">
					<div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold text-sm">
						{rank}
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="font-semibold text-sm text-foreground truncate mb-1">
							{material.nombre}
						</h4>
						<p className="text-xs text-default-600 mb-2">
							{material.materia} • {material.tutor}
						</p>
						<div className="flex items-center gap-3 text-xs text-default-500">
							<div className="flex items-center gap-1">
								<Eye className="w-3 h-3" />
								<span>{material.vistas}</span>
							</div>
							<div className="flex items-center gap-1">
								<Download className="w-3 h-3" />
								<span>{material.descargas}</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="w-3 h-3 text-yellow-500" />
								<span>{material.calificacion.toFixed(1)}</span>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<TrendingUp className="w-5 h-5 text-primary-600" />
					<h3 className="text-lg font-semibold">Materiales Populares</h3>
				</div>
			</CardHeader>
			<CardBody className="pt-0">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Más Vistos */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<Eye className="w-4 h-4 text-primary-600" />
							<h4 className="font-medium text-primary-700">Más Vistos</h4>
						</div>
						<div className="space-y-3">
							{popularData.mostViewed.map((material, index) =>
								renderMaterialCard(material, index + 1),
							)}
						</div>
					</div>

					{/* Más Descargados */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<Download className="w-4 h-4 text-success-600" />
							<h4 className="font-medium text-success-700">Más Descargados</h4>
						</div>
						<div className="space-y-3">
							{popularData.mostDownloaded.map((material, index) =>
								renderMaterialCard(material, index + 1),
							)}
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
