/**
 * Material Stats Modal Component
 * Modal para mostrar estadísticas detalladas del material
 */

import {
	Button,
	Card,
	CardBody,
	Chip,
	Select,
	SelectItem,
	Tab,
	Tabs,
} from '@heroui/react';
import {
	BarChart3,
	Download,
	Eye,
	FileDown,
	MessageCircle,
	Star,
	TrendingUp,
	X,
} from 'lucide-react';
import { useState } from 'react';
import type { Material } from '~/lib/types/api.types';

interface MaterialStatsModalProps {
	material: Material | null;
	isOpen: boolean;
	onClose: () => void;
}

interface Comment {
	id: string;
	userName: string;
	content: string;
	rating: number;
	date: string;
}

export function MaterialStatsModal({
	material,
	isOpen,
	onClose,
}: MaterialStatsModalProps) {
	const [timeRange, setTimeRange] = useState('30d');
	const [activeTab, setActiveTab] = useState('overview');

	if (!isOpen || !material) return null;

	// Datos mock para estadísticas
	const stats = {
		totalDescargas: 1247,
		totalVistas: 3891,
		calificacionPromedio: 4.3,
		totalComentarios: 23,
		tendenciaDescargas: [
			{ fecha: '2024-01-01', descargas: 45 },
			{ fecha: '2024-01-02', descargas: 52 },
			{ fecha: '2024-01-03', descargas: 38 },
			{ fecha: '2024-01-04', descargas: 67 },
			{ fecha: '2024-01-05', descargas: 71 },
		],
	};

	const comentarios: Comment[] = [
		{
			id: '1',
			userName: 'Ana García',
			content: 'Excelente material, muy bien explicado y útil para el curso.',
			rating: 5,
			date: '2024-01-15',
		},
		{
			id: '2',
			userName: 'Carlos López',
			content: 'Buen contenido, aunque podría tener más ejemplos prácticos.',
			rating: 4,
			date: '2024-01-14',
		},
		{
			id: '3',
			userName: 'María Rodríguez',
			content: 'Material muy completo y actualizado. Lo recomiendo.',
			rating: 5,
			date: '2024-01-13',
		},
	];

	const handleExportData = (format: 'csv' | 'pdf') => {
		// Simular exportación
		const fileName = `estadisticas_${material.nombre.replace(/\s+/g, '_')}.${format}`;
		console.log(`Exportando estadísticas como ${format}: ${fileName}`);
		alert(`Descargando reporte en formato ${format.toUpperCase()}`);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
							<Tab key="trends" title="Tendencias" />
							<Tab key="comments" title="Comentarios" />
						</Tabs>
					</div>

					{/* Content */}
					<div className="p-6 overflow-y-auto max-h-[60vh]">
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
											<p className="text-sm text-gray-600">Total Descargas</p>
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
											onPress={() => handleExportData('csv')}
										>
											Exportar CSV
										</Button>
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

						{activeTab === 'trends' && (
							<div className="space-y-6">
								{/* Selector de rango */}
								<div className="flex items-center gap-4">
									<Select
										label="Período"
										selectedKeys={[timeRange]}
										onSelectionChange={(keys) =>
											setTimeRange(Array.from(keys)[0] as string)
										}
										className="max-w-xs"
									>
										<SelectItem key="7d">Últimos 7 días</SelectItem>
										<SelectItem key="30d">Últimos 30 días</SelectItem>
										<SelectItem key="90d">Últimos 3 meses</SelectItem>
									</Select>
								</div>

								{/* Gráfico simulado */}
								<Card className="shadow-sm">
									<CardBody className="p-6">
										<div className="flex items-center gap-2 mb-4">
											<TrendingUp className="w-5 h-5 text-blue-600" />
											<h4 className="font-semibold">Tendencia de Descargas</h4>
										</div>
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<div className="text-center">
												<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
												<p className="text-gray-600">Gráfico de tendencias</p>
												<p className="text-sm text-gray-500">
													Se mostrará cuando esté conectado al backend
												</p>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						)}

						{activeTab === 'comments' && (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold">Comentarios Recientes</h4>
									<Chip size="sm" variant="flat" className="bg-gray-100">
										{comentarios.length} comentarios
									</Chip>
								</div>

								<div className="space-y-4">
									{comentarios.map((comment) => (
										<Card key={comment.id} className="shadow-sm">
											<CardBody className="p-4">
												<div className="flex items-start justify-between mb-2">
													<div>
														<p className="font-medium text-gray-900">
															{comment.userName}
														</p>
														<p className="text-sm text-gray-500">
															{new Date(comment.date).toLocaleDateString()}
														</p>
													</div>
													<div className="flex items-center gap-1">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`w-4 h-4 ${
																	i < comment.rating
																		? 'text-yellow-500 fill-current'
																		: 'text-gray-300'
																}`}
															/>
														))}
													</div>
												</div>
												<p className="text-gray-700">{comment.content}</p>
											</CardBody>
										</Card>
									))}
								</div>
							</div>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
