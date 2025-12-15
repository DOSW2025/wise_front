/**
 * Material Stats Modal Component
 * Modal para mostrar estadísticas detalladas del material
 */

import {
	Button,
	Card,
	CardBody,
	Chip,
	Spinner,
	Tab,
	Tabs,
} from '@heroui/react';
import { Download, Eye, FileDown, MessageCircle, Star, X } from 'lucide-react';
import { useState } from 'react';
import {
	useMaterialComments,
	useMaterialRatingSummary,
} from '~/lib/hooks/useMaterials';
import { materialsService } from '~/lib/services/materials.service';
import type { Material } from '~/lib/types/api.types';

interface MaterialStatsModalProps {
	material: Material | null;
	isOpen: boolean;
	onClose: () => void;
}

export function MaterialStatsModal({
	material,
	isOpen,
	onClose,
}: MaterialStatsModalProps) {
	const [_timeRange, _setTimeRange] = useState('30d');
	const [activeTab, setActiveTab] = useState('overview');

	// Obtener datos reales de estadísticas y comentarios
	const { data: ratingSummary, isLoading } = useMaterialRatingSummary(
		material?.id || '',
	);
	const { data: comments = [], isLoading: isLoadingComments } =
		useMaterialComments(material?.id || '');

	if (!isOpen || !material) return null;

	// Usar datos reales si están disponibles, sino datos por defecto
	const stats = ratingSummary
		? {
				totalDescargas: ratingSummary.totalDescargas,
				totalVistas: ratingSummary.totalVistas,
				calificacionPromedio: ratingSummary.calificacionPromedio,
				totalComentarios: ratingSummary.totalCalificaciones,
			}
		: {
				totalDescargas: 0,
				totalVistas: 0,
				calificacionPromedio: 0,
				totalComentarios: 0,
			};

	const handleExportData = async (format: 'pdf') => {
		try {
			if (format === 'pdf') {
				await materialsService.exportStatsPdf(material.id);
			}
		} catch (error) {
			console.error('Error al exportar PDF:', error);
			alert('Error al descargar el PDF. Intenta nuevamente.');
		}
	};

	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
				<CardBody className="p-0">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b">
						<div>
							<h3 className="text-xl font-semibold">
								Estadísticas del Material
							</h3>
							<p className="text-sm text-gray-600 mt-1">{material.nombre}</p>
						</div>
						<Button isIconOnly variant="light" onPress={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>

					{/* Tabs */}
					<div className="px-6 pt-4">
						<Tabs
							selectedKey={activeTab}
							onSelectionChange={(key) => setActiveTab(key as string)}
							color="primary"
							variant="underlined"
						>
							<Tab key="overview" title="Resumen" />
							<Tab key="comments" title="Comentarios" />
						</Tabs>
					</div>

					{/* Content */}
					<div className="p-6 overflow-y-auto max-h-[60vh]">
						{isLoading ? (
							<div className="flex justify-center items-center py-12">
								<Spinner size="lg" color="primary" />
							</div>
						) : (
							<>
								{activeTab === 'overview' && (
									<div className="space-y-6">
										{/* Métricas principales */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<Card className="shadow-sm">
												<CardBody className="p-4 text-center">
													<div className="flex items-center justify-center mb-2">
														<Download className="w-6 h-6 text-blue-600" />
													</div>
													<p className="text-2xl font-bold text-gray-900">
														{stats.totalDescargas.toLocaleString()}
													</p>
													<p className="text-sm text-gray-600">
														Total Descargas
													</p>
												</CardBody>
											</Card>

											<Card className="shadow-sm">
												<CardBody className="p-4 text-center">
													<div className="flex items-center justify-center mb-2">
														<Eye className="w-6 h-6 text-green-600" />
													</div>
													<p className="text-2xl font-bold text-gray-900">
														{stats.totalVistas.toLocaleString()}
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
														{stats.calificacionPromedio}
													</p>
													<p className="text-sm text-gray-600">
														Calificación Promedio
													</p>
												</CardBody>
											</Card>

											<Card className="shadow-sm">
												<CardBody className="p-4 text-center">
													<div className="flex items-center justify-center mb-2">
														<MessageCircle className="w-6 h-6 text-purple-600" />
													</div>
													<p className="text-2xl font-bold text-gray-900">
														{stats.totalComentarios}
													</p>
													<p className="text-sm text-gray-600">Comentarios</p>
												</CardBody>
											</Card>
										</div>

										{/* Acciones de exportación */}
										<div>
											<h4 className="font-semibold mb-3">Exportar Datos</h4>
											<div className="flex gap-3">
												<Button
													variant="bordered"
													startContent={<FileDown className="w-4 h-4" />}
													onPress={() => handleExportData('pdf')}
												>
													Exportar PDF
												</Button>
											</div>
										</div>
									</div>
								)}

								{activeTab === 'comments' && (
									<div className="space-y-4">
										{isLoadingComments ? (
											<div className="flex justify-center items-center py-8">
												<Spinner size="lg" />
											</div>
										) : (
											<>
												<div className="flex items-center justify-between mb-4">
													<h4 className="font-semibold">
														Comentarios Recientes
													</h4>
													<Chip
														size="sm"
														variant="flat"
														className="bg-gray-100"
													>
														{comments.length} comentarios
													</Chip>
												</div>

												{comments.length === 0 ? (
													<div className="text-center py-8 text-gray-500">
														<MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
														<p>No hay comentarios aún</p>
													</div>
												) : (
													<div className="space-y-4">
														{comments.map((comment) => (
															<Card key={comment.id} className="shadow-sm">
																<CardBody className="p-4">
																	<div className="flex items-start justify-between mb-2">
																		<div>
																			<p className="font-medium text-gray-900">
																				{comment.usuarioNombre || 'Usuario'}
																			</p>
																			<p className="text-sm text-gray-500">
																				{new Date(
																					comment.createdAt,
																				).toLocaleDateString()}
																			</p>
																		</div>
																		<div className="flex items-center gap-1">
																			{[...Array(5)].map((_, i) => (
																				<Star
																					key={i}
																					className={`w-4 h-4 ${
																						i < comment.calificacion
																							? 'text-yellow-500 fill-current'
																							: 'text-gray-300'
																					}`}
																				/>
																			))}
																		</div>
																	</div>
																	{comment.comentario && (
																		<p className="text-gray-700">
																			{comment.comentario}
																		</p>
																	)}
																</CardBody>
															</Card>
														))}
													</div>
												)}
											</>
										)}
									</div>
								)}
							</>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
