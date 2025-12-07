import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Spinner,
} from '@heroui/react';
import { TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { StatsCard } from '~/components/stats-card';
import { useDateFilter } from '~/lib/hooks/useDateFilter';
import {
	getRoleStatistics,
	getUserStatistics,
} from '~/lib/services/user.service';
import type {
	RoleStatisticsResponse,
	UserStatisticsResponse,
} from '~/lib/types/api.types';

// Mock admin metrics (replace with API when available)
const subjectsBarData = [
	{ subject: 'Matemáticas', sessions: 1200 },
	{ subject: 'Programación', sessions: 980 },
	{ subject: 'Física', sessions: 720 },
	{ subject: 'Química', sessions: 540 },
	{ subject: 'Inglés', sessions: 410 },
];

const growthData = [
	{ month: 'Jun', users: 1248 },
	{ month: 'Jul', users: 1207 },
	{ month: 'Ago', users: 1166 },
	{ month: 'Sep', users: 1104 },
	{ month: 'Oct', users: 920 },
];

const topSubjectsTable = [
	{ subject: 'Matemáticas', sessions: 1240, hours: 152 },
	{ subject: 'Programación', sessions: 980, hours: 138 },
	{ subject: 'Física', sessions: 720, hours: 96 },
	{ subject: 'Química', sessions: 540, hours: 81 },
	{ subject: 'Inglés', sessions: 410, hours: 64 },
];

const COLORS = [
	'hsl(var(--heroui-primary))',
	'hsl(var(--heroui-success))',
	'hsl(var(--heroui-warning))',
];

export default function AdminReports() {
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
	const [mainTab, setMainTab] = useState<'stats' | 'history'>('stats');

	// Estados para datos del API
	const [userStats, setUserStats] = useState<UserStatisticsResponse | null>(
		null,
	);
	const [roleStats, setRoleStats] = useState<RoleStatisticsResponse | null>(
		null,
	);
	const [isLoadingStats, setIsLoadingStats] = useState(true);

	// Cargar estadísticas del API
	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoadingStats(true);
				const [userStatsData, roleStatsData] = await Promise.all([
					getUserStatistics(),
					getRoleStatistics(),
				]);
				setUserStats(userStatsData);
				setRoleStats(roleStatsData);
			} catch (error) {
				console.error('Error fetching statistics:', error);
			} finally {
				setIsLoadingStats(false);
			}
		};

		fetchStats();
	}, []);

	// Preparar datos para el gráfico de pie
	const roleDistributionData =
		roleStats?.roles.map((role) => {
			const displayName =
				role.rol === 'estudiante'
					? 'Estudiantes'
					: role.rol === 'tutor'
						? 'Tutores'
						: role.rol === 'admin'
							? 'Administradores'
							: role.rol;
			return {
				name: displayName,
				value: role.porcentaje,
				count: role.conteo,
			};
		}) || [];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Reportes y Estadísticas
				</h1>
				<p className="text-default-500">Visión general de la plataforma</p>
			</div>

			{/* Tabs principales como en Tutor */}
			<div className="flex gap-2 items-center">
				<Button
					variant={mainTab === 'stats' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setMainTab('stats')}
				>
					Estadísticas y Gráficos
				</Button>
				<Button
					variant={mainTab === 'history' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setMainTab('history')}
				>
					Historial y Evaluaciones
				</Button>
				{/* Periodo alineado con las pestañas, debajo del título */}
				<div className="ml-auto">
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
			</div>

			{isLoading || isLoadingStats ? (
				<div className="flex justify-center items-center h-64">
					<Spinner size="lg" label="Cargando métricas..." />
				</div>
			) : mainTab === 'stats' ? (
				<>
					{/* Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Total de Usuarios"
							value={userStats?.resumen.total || 0}
							icon={<Users className="w-5 h-5" />}
							color="success"
							description={`${userStats?.resumen.activos.porcentaje || 0}% activos`}
						/>
						<StatsCard
							title="Usuarios Activos"
							value={userStats?.resumen.activos.conteo || 0}
							icon={<Users className="w-5 h-5" />}
							color="primary"
							description={`${userStats?.resumen.activos.porcentaje || 0}%`}
						/>
						<StatsCard
							title="Usuarios Suspendidos"
							value={userStats?.resumen.suspendidos.conteo || 0}
							icon={<TrendingUp className="w-5 h-5" />}
							color="warning"
							description={`${userStats?.resumen.suspendidos.porcentaje || 0}%`}
						/>
						<StatsCard
							title="Usuarios Inactivos"
							value={userStats?.resumen.inactivos.conteo || 0}
							icon={<ClockIcon />}
							color="default"
							description={`${userStats?.resumen.inactivos.porcentaje || 0}%`}
						/>
					</div>

					{/* Tutorias por Materia */}
					<Card>
						<CardHeader className="flex justify-between items-center">
							<div className="flex flex-col">
								<h2 className="text-xl font-semibold">Tutorías por Materia</h2>
								<p className="text-sm text-default-500">
									Distribución de sesiones por materia
								</p>
							</div>
							<Button variant="light" color="danger">
								Ver detalles
							</Button>
						</CardHeader>
						<CardBody>
							<div className="w-full h-[320px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={subjectsBarData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid {...CHART_GRID_STYLE} />
										<XAxis dataKey="subject" {...CHART_AXIS_STYLE} />
										<YAxis {...CHART_AXIS_STYLE} />
										<Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
										<Bar
											dataKey="sessions"
											name="Sesiones"
											fill="hsl(var(--heroui-primary))"
											radius={[8, 8, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardBody>
					</Card>

					{/* Role Distribution */}
					<Card>
						<CardHeader className="flex items-center justify-between gap-2 pb-0">
							<h2 className="text-xl font-semibold">
								Distribución de Usuarios por Rol
							</h2>
						</CardHeader>
						<CardBody className="pt-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
								<div className="md:col-span-2 w-full h-[260px] sm:h-[320px]">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={roleDistributionData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={110}
												fill="hsl(var(--heroui-primary))"
												dataKey="value"
												label={({ name, value }) => `${name}: ${value}%`}
											>
												{roleDistributionData.map((_entry, index) => (
													<Cell
														key={entry.name}
														fill={
															COLORS[
																roleDistributionData.indexOf(entry) %
																	COLORS.length
															]
														}
													/>
												))}
											</Pie>
											<Tooltip
												contentStyle={CHART_TOOLTIP_STYLE}
												formatter={(value: number, name: string, props) => [
													`${value}% (${props.payload.count} usuarios)`,
													name,
												]}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className="flex flex-col gap-3 md:justify-center">
									{roleDistributionData.map((role, index) => {
										const colorMap = ['primary', 'success', 'warning'] as const;
										return (
											<Chip
												key={role.name}
												color={colorMap[index % colorMap.length]}
												variant="flat"
												className="justify-start"
											>
												{role.name} {role.value}% ({role.count})
											</Chip>
										);
									})}
								</div>
							</div>
						</CardBody>
					</Card>

					{/* Growth Line */}
					<Card>
						<CardHeader className="flex flex-col items-start gap-2 pb-0">
							<h2 className="text-xl font-semibold">Crecimiento de Usuarios</h2>
							<div className="flex gap-2">
								<Chip color="primary" variant="flat">
									Usuarios
								</Chip>
							</div>
						</CardHeader>
						<CardBody className="pt-4">
							<div className="w-full h-[300px] sm:h-[350px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={growthData}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid {...CHART_GRID_STYLE} />
										<XAxis dataKey="month" {...CHART_AXIS_STYLE} />
										<YAxis {...CHART_AXIS_STYLE} />
										<Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
										<Legend />
										<Line
											type="monotone"
											dataKey="users"
											name="Usuarios"
											stroke="hsl(var(--heroui-primary))"
											strokeWidth={2}
											dot={{ r: 4 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</CardBody>
					</Card>

					{/* Top Materias Table */}
					<Card>
						<CardHeader className="flex flex-col items-start gap-2 pb-0">
							<h2 className="text-xl font-semibold">Top Materias</h2>
						</CardHeader>
						<CardBody className="pt-4">
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-default-500">
											<th className="text-left py-2 px-3">Materia</th>
											<th className="text-left py-2 px-3">Sesiones</th>
											<th className="text-left py-2 px-3">Horas Totales</th>
											<th className="text-left py-2 px-3">Promedio</th>
										</tr>
									</thead>
									<tbody>
										{topSubjectsTable.map((row) => (
											<tr
												key={row.subject}
												className="border-t border-default-200"
											>
												<td className="py-2 px-3">{row.subject}</td>
												<td className="py-2 px-3">{row.sessions}</td>
												<td className="py-2 px-3">{row.hours} h</td>
												<td className="py-2 px-3">
													<Chip color="success" variant="flat">
														~ 1h 20m
													</Chip>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>

					{/* System Health & Recent Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader className="flex items-center gap-2">
								<h2 className="text-xl font-semibold">Salud del Sistema</h2>
							</CardHeader>
							<CardBody className="pt-2">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-default-500">Disponibilidad</span>
										<span className="text-success font-semibold">99.9%</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-default-500">
											Tiempo de respuesta
										</span>
										<span className="text-danger font-semibold">180 ms</span>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader className="flex items-center gap-2">
								<h2 className="text-xl font-semibold">Actividad Reciente</h2>
							</CardHeader>
							<CardBody className="pt-2">
								<ul className="space-y-2">
									<li className="flex items-center justify-between">
										<span>Nuevo usuario registrado</span>
										<Chip color="success" variant="flat">
											Hace 5 min
										</Chip>
									</li>
									<li className="flex items-center justify-between">
										<span>Material validado</span>
										<Chip color="danger" variant="flat">
											Hace 12 min
										</Chip>
									</li>
									<li className="flex items-center justify-between">
										<span>Reporte recibido</span>
										<Chip color="danger" variant="flat">
											Hace 23 min
										</Chip>
									</li>
									<li className="flex items-center justify-between">
										<span>Tutoría completada</span>
										<Chip variant="flat">Hace 1 hora</Chip>
									</li>
								</ul>
							</CardBody>
						</Card>
					</div>
				</>
			) : (
				<>
					{/* Historial y Evaluaciones (similar a Tutor) */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader className="flex flex-col items-start gap-2 pb-0">
								<h2 className="text-xl font-semibold">Historial de Eventos</h2>
								<p className="text-sm text-default-500">
									Actividad administrativa reciente
								</p>
							</CardHeader>
							<CardBody className="pt-4">
								<ul className="space-y-3">
									<li className="flex items-center justify-between">
										<span>Usuario desactivado</span>
										<Chip variant="flat">Hace 3 h</Chip>
									</li>
									<li className="flex items-center justify-between">
										<span>Material marcado como destacado</span>
										<Chip color="primary" variant="flat">
											Hace 4 h
										</Chip>
									</li>
									<li className="flex items-center justify-between">
										<span>Reporte moderado</span>
										<Chip color="warning" variant="flat">
											Hace 6 h
										</Chip>
									</li>
								</ul>
							</CardBody>
						</Card>

						<Card>
							<CardHeader className="flex flex-col items-start gap-2 pb-0">
								<h2 className="text-xl font-semibold">
									Evaluaciones del Sistema
								</h2>
								<p className="text-sm text-default-500">
									Indicadores de calidad
								</p>
							</CardHeader>
							<CardBody className="pt-4">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span>Tiempo medio de verificación</span>
										<Chip variant="flat">15 min</Chip>
									</div>
									<div className="flex items-center justify-between">
										<span>Tasa de aprobación de materiales</span>
										<Chip color="success" variant="flat">
											92%
										</Chip>
									</div>
									<div className="flex items-center justify-between">
										<span>Reportes resueltos</span>
										<Chip color="primary" variant="flat">
											78%
										</Chip>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}

function ClockIcon() {
	return (
		<svg
			className="w-5 h-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 8v5l3 1"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}
