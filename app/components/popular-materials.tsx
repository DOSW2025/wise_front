/**
 * Popular Materials Component
 * Sección de materiales más vistos y descargados
 */

import { Card, CardBody, CardHeader, Progress, Spinner } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
	BarChart3,
	Download,
	Eye,
	FileText,
	Star,
	TrendingUp,
} from 'lucide-react';
import { useEffect } from 'react';
import {
	useTagsPercentage,
	useTopDownloadedMaterials,
	useTopViewedMaterials,
	useUserStats,
} from '~/lib/hooks/useMaterials';
import type { Material } from '~/lib/types/api.types';

interface PopularMaterialsProps {
	onMaterialClick?: (material: Material) => void;
	userId?: string;
}

export function PopularMaterials({
	onMaterialClick,
	userId,
}: PopularMaterialsProps) {
	const queryClient = useQueryClient();

	// Refrescar datos cada vez que se accede a la pantalla
	useEffect(() => {
		if (userId) {
			queryClient.invalidateQueries({ queryKey: ['user-stats', userId] });
			queryClient.invalidateQueries({ queryKey: ['top-viewed', userId] });
			queryClient.invalidateQueries({ queryKey: ['top-downloaded', userId] });
			queryClient.invalidateQueries({ queryKey: ['tags-percentage', userId] });
		}
	}, [userId, queryClient]);

	const { data: userStats, isLoading: isLoadingStats } = useUserStats(
		userId || '',
	);
	const { data: topViewed = [], isLoading: isLoadingTopViewed } =
		useTopViewedMaterials(userId || '');
	const { data: topDownloaded = [], isLoading: isLoadingTopDownloaded } =
		useTopDownloadedMaterials(userId || '');
	const { data: tagsPercentage = [], isLoading: isLoadingTags } =
		useTagsPercentage(userId || '');

	// Datos mock para estadísticas generales (fallback)
	const mockGeneralStats = {
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

	// Usar datos reales del usuario si están disponibles
	const generalStats = userStats
		? {
				totalMateriales: userStats.totalMateriales,
				totalDescargas: userStats.totalDescargas,
				totalVistas: userStats.totalVistas,
				calificacionPromedio: userStats.calificacionPromedio,
				materiasMasPopulares: [
					{ nombre: 'Matemáticas', porcentaje: 35 },
					{ nombre: 'Física', porcentaje: 28 },
					{ nombre: 'Química', porcentaje: 22 },
					{ nombre: 'Programación', porcentaje: 15 },
				],
			}
		: mockGeneralStats;

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
									{isLoadingTopViewed ? (
										<div className="flex justify-center py-4">
											<Spinner size="sm" />
										</div>
									) : topViewed.length > 0 ? (
										<div className="space-y-3">
											{topViewed.map((material, index) => (
												<Card
													key={material.id}
													isPressable
													onPress={() => {
														// Crear un objeto Material para pasar al callback
														onMaterialClick?.({
															id: material.id,
															nombre: material.nombre,
															materia: '',
															tutor: '',
															vistas: material.vistos,
															descargas: material.descargas,
															calificacion: material.calificacionPromedio,
															tags: [],
															descripcion: '',
															archivo: '',
															tipo: 'PDF',
															semestre: 1,
															createdAt: new Date().toISOString(),
															updatedAt: new Date().toISOString(),
														} as Material);
													}}
													className="hover:shadow-md transition-shadow cursor-pointer"
												>
													<CardBody className="p-4">
														<div className="flex items-start gap-3">
															<div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold text-sm">
																{index + 1}
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-semibold text-sm text-foreground truncate mb-1">
																	{material.nombre}
																</h4>
																<div className="flex items-center gap-3 text-xs text-default-500">
																	<div className="flex items-center gap-1">
																		<Eye className="w-3 h-3" />
																		<span>{material.vistos}</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<Download className="w-3 h-3" />
																		<span>{material.descargas}</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<Star className="w-3 h-3 text-yellow-500" />
																		<span>
																			{material.calificacionPromedio.toFixed(1)}
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
											))}
										</div>
									) : (
										<p className="text-sm text-default-500">
											Sin datos disponibles
										</p>
									)}
								</div>

								{/* Más Descargados */}
								<div>
									<div className="flex items-center gap-2 mb-4">
										<Download className="w-4 h-4 text-green-600" />
										<h4 className="font-medium text-gray-700">
											Más Descargados
										</h4>
									</div>
									{isLoadingTopDownloaded ? (
										<div className="flex justify-center py-4">
											<Spinner size="sm" />
										</div>
									) : topDownloaded.length > 0 ? (
										<div className="space-y-3">
											{topDownloaded.map((material, index) => (
												<Card
													key={material.id}
													isPressable
													onPress={() => {
														// Crear un objeto Material para pasar al callback
														onMaterialClick?.({
															id: material.id,
															nombre: material.nombre,
															materia: '',
															tutor: '',
															vistas: material.vistos,
															descargas: material.descargas,
															calificacion: material.calificacionPromedio,
															tags: [],
															descripcion: '',
															archivo: '',
															tipo: 'PDF',
															semestre: 1,
															createdAt: new Date().toISOString(),
															updatedAt: new Date().toISOString(),
														} as Material);
													}}
													className="hover:shadow-md transition-shadow cursor-pointer"
												>
													<CardBody className="p-4">
														<div className="flex items-start gap-3">
															<div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold text-sm">
																{index + 1}
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-semibold text-sm text-foreground truncate mb-1">
																	{material.nombre}
																</h4>
																<div className="flex items-center gap-3 text-xs text-default-500">
																	<div className="flex items-center gap-1">
																		<Eye className="w-3 h-3" />
																		<span>{material.vistos}</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<Download className="w-3 h-3" />
																		<span>{material.descargas}</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<Star className="w-3 h-3 text-yellow-500" />
																		<span>
																			{material.calificacionPromedio.toFixed(1)}
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
											))}
										</div>
									) : (
										<p className="text-sm text-default-500">
											Sin datos disponibles
										</p>
									)}
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
						<CardBody className="pt-0 pr-0">
							<div className="space-y-4 max-h-96 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent scrollbar-hide">
								{isLoadingTags ? (
									<div className="flex justify-center py-4">
										<Spinner size="sm" />
									</div>
								) : tagsPercentage.length > 0 ? (
									tagsPercentage.map((materia) => (
										<div key={materia.tag} className="space-y-2">
											<div className="flex justify-between items-center">
												<span className="text-sm font-medium text-gray-700">
													{materia.tag}
												</span>
												<span className="text-sm text-gray-500">
													{materia.porcentaje.toFixed(2)}%
												</span>
											</div>
											<Progress
												value={materia.porcentaje}
												className="[&_[data-filled=true]]:bg-[#8B1A1A]"
												size="sm"
											/>
										</div>
									))
								) : (
									<p className="text-sm text-default-500">
										Sin datos disponibles
									</p>
								)}
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
