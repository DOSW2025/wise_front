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
	getUserGrowth,
	getUserStatistics,
} from '~/lib/services/user.service';
import type {
	RoleStatisticsResponse,
	UserGrowthResponse,
	UserStatisticsResponse,
} from '~/lib/types/api.types';

const COLORS = [
	'hsl(var(--heroui-primary))',
	'hsl(var(--heroui-success))',
	'hsl(var(--heroui-warning))',
];

const WEEK_OPTIONS = [
	{ label: '1 semana', value: 1 },
	{ label: '4 semanas', value: 4 },
	{ label: '12 semanas', value: 12 },
	{ label: '26 semanas', value: 26 },
	{ label: '52 semanas (1 año)', value: 52 },
];

function getGrowthStatsDescription(
	growthStats: UserGrowthResponse | null,
	selectedWeeks: number,
): string {
	if (growthStats?.period) {
		const weeksPlural = growthStats.period.semanas > 1 ? 's' : '';
		return `${growthStats.totalUsuariosNuevos} nuevos usuarios en las últimas ${growthStats.period.semanas} semana${weeksPlural}`;
	}

	const selectedWeeksPlural = selectedWeeks > 1 ? 's' : '';
	return `Últimas ${selectedWeeks} semana${selectedWeeksPlural}`;
}

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
	const [selectedWeeks, setSelectedWeeks] = useState(12);

	// Estados para datos del API
	const [userStats, setUserStats] = useState<UserStatisticsResponse | null>(
		null,
	);
	const [roleStats, setRoleStats] = useState<RoleStatisticsResponse | null>(
		null,
	);
	const [growthStats, setGrowthStats] = useState<UserGrowthResponse | null>(
		null,
	);
	const [isLoadingStats, setIsLoadingStats] = useState(true);

	// Cargar estadísticas del API
	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoadingStats(true);
				const [userStatsData, roleStatsData, growthStatsData] =
					await Promise.all([
						getUserStatistics(),
						getRoleStatistics(),
						getUserGrowth({ weeks: selectedWeeks }),
					]);
				setUserStats(userStatsData);
				setRoleStats(roleStatsData);
				setGrowthStats(growthStatsData);
			} catch (error) {
				console.error('Error fetching statistics:', error);
			} finally {
				setIsLoadingStats(false);
			}
		};

		fetchStats();
	}, [selectedWeeks]);

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

			{/* Periodo de filtrado */}
			<div className="flex justify-end">
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

			{isLoading || isLoadingStats ? (
				<div className="flex justify-center items-center h-64">
					<Spinner size="lg" label="Cargando métricas..." />
				</div>
			) : (
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
												{roleDistributionData.map((entry, index) => (
													<Cell
														key={entry.name}
														fill={COLORS[index % COLORS.length]}
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
						<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-0">
							<div>
								<h2 className="text-xl font-semibold">
									Crecimiento de Usuarios
								</h2>
								<p className="text-sm text-default-500">
									{getGrowthStatsDescription(growthStats, selectedWeeks)}
								</p>
							</div>
							<div className="flex gap-2 flex-wrap">
								{WEEK_OPTIONS.map((option) => (
									<Button
										key={option.value}
										size="sm"
										variant={selectedWeeks === option.value ? 'solid' : 'light'}
										color="primary"
										onPress={() => setSelectedWeeks(option.value)}
									>
										{option.label}
									</Button>
								))}
							</div>
						</CardHeader>
						<CardBody className="pt-4">
							{growthStats &&
							Array.isArray(growthStats.data) &&
							growthStats.data.length > 0 ? (
								<div className="w-full h-[300px] sm:h-[350px]">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart
											data={growthStats?.data || []}
											margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										>
											<CartesianGrid {...CHART_GRID_STYLE} />
											<XAxis
												dataKey="fecha"
												{...CHART_AXIS_STYLE}
												angle={-45}
												textAnchor="end"
												height={80}
											/>
											<YAxis {...CHART_AXIS_STYLE} allowDecimals={false} />
											<Tooltip
												contentStyle={CHART_TOOLTIP_STYLE}
												labelFormatter={(label) => `Fecha: ${label}`}
												formatter={(value: number, _name: string, props) => [
													`${value} usuarios nuevos`,
													`Semana ${props.payload.semana}`,
												]}
											/>
											<Legend />
											<Line
												type="monotone"
												dataKey="conteo"
												name="Usuarios Nuevos"
												stroke="hsl(var(--heroui-primary))"
												strokeWidth={2}
												dot={{ r: 4 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="flex justify-center items-center h-[300px]">
									<p className="text-default-400">
										No hay datos de crecimiento disponibles para este período
									</p>
								</div>
							)}
						</CardBody>
					</Card>
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
