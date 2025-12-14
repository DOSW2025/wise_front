import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { useMemo } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { DateRangeFilter } from '~/components';
import {
	CHART_AXIS_STYLE,
	CHART_GRID_STYLE,
	CHART_TOOLTIP_STYLE,
} from '~/components/charts/chart-tooltip';
import { useDateFilter } from '~/lib/hooks/useDateFilter';

// Mock data - Tutorías recibidas por mes (últimos 6 meses)
const tutoringData = [
	{ month: 'Jun', sessions: 4 },
	{ month: 'Jul', sessions: 6 },
	{ month: 'Ago', sessions: 5 },
	{ month: 'Sep', sessions: 8 },
	{ month: 'Oct', sessions: 7 },
	{ month: 'Nov', sessions: 9 },
];

// Mock data - Materiales descargados por categoría
const materialsData = [
	{ category: 'Matemáticas', downloads: 15 },
	{ category: 'Programación', downloads: 23 },
	{ category: 'Física', downloads: 12 },
	{ category: 'Química', downloads: 8 },
	{ category: 'Inglés', downloads: 18 },
	{ category: 'Otros', downloads: 10 },
];

// Mock data - Participación en foros
const forumData = [
	{ name: 'Preguntas', value: 35 },
	{ name: 'Respuestas', value: 48 },
	{ name: 'Comentarios', value: 67 },
];

// Colores para el gráfico de pie
const COLORS = [
	'hsl(var(--heroui-primary))',
	'hsl(var(--heroui-success))',
	'hsl(var(--heroui-warning))',
];

export default function StudentStatistics() {
	const {
		period,
		customDateStart,
		setCustomDateStart,
		customDateEnd,
		setCustomDateEnd,
		isLoading,
		handlePeriodChange,
		handleCustomFilter,
	} = useDateFilter();

	// Calculate totals using useMemo for performance optimization
	const totalSessions = useMemo(
		() => tutoringData.reduce((sum, item) => sum + item.sessions, 0),
		[],
	);

	const totalDownloads = useMemo(
		() => materialsData.reduce((sum, item) => sum + item.downloads, 0),
		[],
	);

	const totalInteractions = useMemo(
		() => forumData.reduce((sum, item) => sum + item.value, 0),
		[],
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
					<p className="text-default-500">
						Visualiza tu progreso académico y participación en la plataforma
					</p>
				</div>

				<DateRangeFilter
					period={period}
					onPeriodChange={handlePeriodChange}
					customDateStart={customDateStart}
					onCustomDateStartChange={setCustomDateStart}
					customDateEnd={customDateEnd}
					onCustomDateEndChange={setCustomDateEnd}
					onCustomFilter={handleCustomFilter}
				/>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Spinner size="lg" label="Cargando estadísticas..." />
				</div>
			) : (
				<>
					{/* Info Notice */}
					<div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
						<p className="text-sm text-primary-700">
							<span className="font-semibold">Nota:</span> Los datos mostrados
							son de ejemplo. Una vez que el backend esté integrado, verás tus
							estadísticas reales.
						</p>
					</div>

					{/* Charts Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Line Chart - Tutorías recibidas por mes */}
						<Card className="lg:col-span-2">
							<CardHeader className="flex flex-col items-start gap-2 pb-0">
								<h2 className="text-xl font-semibold">
									Tutorías Recibidas por Mes
								</h2>
								<p className="text-sm text-default-500">
									Seguimiento de tus sesiones de tutoría en los últimos 6 meses
								</p>
							</CardHeader>
							<CardBody className="pt-4">
								<div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart
											data={tutoringData}
											margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										>
											<CartesianGrid {...CHART_GRID_STYLE} />
											<XAxis dataKey="month" {...CHART_AXIS_STYLE} />
											<YAxis {...CHART_AXIS_STYLE} />
											<Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
											<Legend />
											<Line
												type="monotone"
												dataKey="sessions"
												name="Sesiones"
												stroke="hsl(var(--heroui-primary))"
												strokeWidth={2}
												activeDot={{ r: 8 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</CardBody>
						</Card>

						{/* Bar Chart - Materiales descargados */}
						<Card>
							<CardHeader className="flex flex-col items-start gap-2 pb-0">
								<h2 className="text-xl font-semibold">
									Materiales Descargados
								</h2>
								<p className="text-sm text-default-500">
									Distribución por categoría académica
								</p>
							</CardHeader>
							<CardBody className="pt-4">
								<div className="w-full h-[300px] sm:h-[350px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={materialsData}
											margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										>
											<CartesianGrid {...CHART_GRID_STYLE} />
											<XAxis
												dataKey="category"
												{...CHART_AXIS_STYLE}
												angle={-45}
												textAnchor="end"
												height={80}
											/>
											<YAxis {...CHART_AXIS_STYLE} />
											<Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
											<Legend />
											<Bar
												dataKey="downloads"
												name="Descargas"
												fill="hsl(var(--heroui-warning))"
												radius={[8, 8, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardBody>
						</Card>

						{/* Pie Chart - Participación en foros */}
						<Card>
							<CardHeader className="flex flex-col items-start gap-2 pb-0">
								<h2 className="text-xl font-semibold">
									Participación en Foros
								</h2>
								<p className="text-sm text-default-500">
									Distribución de tus interacciones comunitarias
								</p>
							</CardHeader>
							<CardBody className="pt-4">
								<div className="w-full h-[300px] sm:h-[350px]">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={forumData}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={({ name, percent }) =>
													`${name} ${((percent ?? 0) * 100).toFixed(0)}%`
												}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{forumData.map((_entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</CardBody>
						</Card>
					</div>

					{/* Summary Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardBody>
								<div className="flex flex-col gap-2">
									<p className="text-sm text-default-500">Total de Tutorías</p>
									<p className="text-3xl font-bold text-primary">
										{totalSessions}
									</p>
									<p className="text-xs text-default-400">Últimos 6 meses</p>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<div className="flex flex-col gap-2">
									<p className="text-sm text-default-500">Total de Descargas</p>
									<p className="text-3xl font-bold text-warning">
										{totalDownloads}
									</p>
									<p className="text-xs text-default-400">
										Materiales académicos
									</p>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<div className="flex flex-col gap-2">
									<p className="text-sm text-default-500">
										Interacciones en Foros
									</p>
									<p className="text-3xl font-bold text-success">
										{totalInteractions}
									</p>
									<p className="text-xs text-default-400">
										Preguntas, respuestas y comentarios
									</p>
								</div>
							</CardBody>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
