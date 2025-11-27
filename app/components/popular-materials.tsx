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
	Progress,
	Spinner,
} from '@heroui/react';
import {
	Award,
	BarChart3,
	Download,
	Eye,
	FileText,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react';
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

	// Datos mock para estadísticas generales
	const generalStats = {
		totalMateriales: 1247,
		totalDescargas: 15890,
		totalVistas: 45230,
		calificacionPromedio: 4.2,
		materiasMasPopulares: [
			{ nombre: 'Matemáticas', porcentaje: 35 },
			{ nombre: 'Física', porcentaje: 28 },
			{ nombre: 'Química', porcentaje: 22 },
			{ nombre: 'Programación', porcentaje: 15 },
		],
	};

	return (
		<div className="space-y-6">
			{/* Estadísticas Generales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="shadow-sm">
					<CardBody className="p-4 text-center">
						<div className="flex items-center justify-center mb-2">
							<FileText className="w-6 h-6 text-blue-600" />
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{generalStats.totalMateriales.toLocaleString()}
						</p>
						<p className="text-sm text-gray-600">Total Materiales</p>
					</CardBody>
				</Card>

				<Card className="shadow-sm">
					<CardBody className="p-4 text-center">
						<div className="flex items-center justify-center mb-2">
							<Download className="w-6 h-6 text-green-600" />
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{generalStats.totalDescargas.toLocaleString()}
						</p>
						<p className="text-sm text-gray-600">Total Descargas</p>
					</CardBody>
				</Card>

				<Card className="shadow-sm">
					<CardBody className="p-4 text-center">
						<div className="flex items-center justify-center mb-2">
							<Eye className="w-6 h-6 text-purple-600" />
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{generalStats.totalVistas.toLocaleString()}
						</p>
						<p className="text-sm text-gray-600">Total Vistas</p>
					</CardBody>
				</Card>

				<Card className="shadow-sm">
					<CardBody className="p-4 text-center">
						<div className="flex items-center justify-center mb-2">
							<Star className="w-6 h-6 text-yellow-500" />
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{generalStats.calificacionPromedio}
						</p>
						<p className="text-sm text-gray-600">Calificación Promedio</p>
					</CardBody>
				</Card>
			</div>

			{/* Contenido Principal */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Materiales Más Populares */}
				<div className="lg:col-span-2">
					<Card className="h-full">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<TrendingUp className="w-5 h-5 text-[#8B1A1A]" />
								<h3 className="text-lg font-semibold">Top Materiales</h3>
							</div>
						</CardHeader>
						<CardBody className="pt-0">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Más Vistos */}
								<div>
									<div className="flex items-center gap-2 mb-4">
										<Eye className="w-4 h-4 text-blue-600" />
										<h4 className="font-medium text-gray-700">Más Vistos</h4>
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
										<Download className="w-4 h-4 text-green-600" />
										<h4 className="font-medium text-gray-700">
											Más Descargados
										</h4>
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
				</div>

				{/* Gráfico de Materias Populares */}
				<div>
					<Card className="h-full">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<BarChart3 className="w-5 h-5 text-[#8B1A1A]" />
								<h3 className="text-lg font-semibold">Materias Populares</h3>
							</div>
						</CardHeader>
						<CardBody className="pt-0">
							<div className="space-y-4">
								{generalStats.materiasMasPopulares.map((materia, index) => (
									<div key={materia.nombre} className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-gray-700">
												{materia.nombre}
											</span>
											<span className="text-sm text-gray-500">
												{materia.porcentaje}%
											</span>
										</div>
										<Progress
											value={materia.porcentaje}
											className="[&_[data-filled=true]]:bg-[#8B1A1A]"
											size="sm"
										/>
									</div>
								))}
							</div>

							<Divider className="my-4" />

							{/* Resumen adicional */}
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<Award className="w-4 h-4 text-[#8B1A1A]" />
									<h4 className="font-medium text-gray-700">Resumen Semanal</h4>
								</div>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Nuevos materiales:</span>
										<span className="font-medium">+23</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">
											Descargas esta semana:
										</span>
										<span className="font-medium">+1,247</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Usuarios activos:</span>
										<span className="font-medium">892</span>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
