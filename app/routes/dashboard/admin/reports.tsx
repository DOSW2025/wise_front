import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Spinner,
} from '@heroui/react';
import {
	Activity,
	AlertTriangle,
	BarChart3,
	BookOpen,
	Calendar,
	Download,
	PieChart as PieIcon,
	TrendingUp,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import {
	BarChart,
	LineChart,
	PeriodCalendar,
	PieChart,
	StatsCard,
	SubjectDetailTable,
} from '~/components';
import { useDateFilter } from '~/lib/hooks/useDateFilter';

export default function AdminReports() {
	const [mainTab, setMainTab] = useState<'stats' | 'history'>('stats');
	const [chartTab, setChartTab] = useState<'users' | 'sessions'>('users');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const { period, isLoading, handlePeriodChange } = useDateFilter();

	// Datos de ejemplo (conectar a API posteriormente)
	const topSubjects = [
		{ subject: 'Matemáticas', sessions: 1240, percentage: 32 },
		{ subject: 'Programación', sessions: 980, percentage: 25 },
		{ subject: 'Física', sessions: 720, percentage: 18 },
		{ subject: 'Química', sessions: 540, percentage: 14 },
		{ subject: 'Inglés', sessions: 410, percentage: 11 },
	];

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Reportes y Métricas
					</h1>
					<p className="text-default-500">Visión general de la plataforma</p>
				</div>
				<div className="flex gap-3">
					<Button
						variant="bordered"
						color="default"
						size="md"
						startContent={<Download className="w-4 h-4" />}
						className="font-medium px-5 py-2.5 text-sm"
					>
						PDF
					</Button>
					<Button
						variant="solid"
						color="danger"
						size="md"
						startContent={<Download className="w-4 h-4" />}
						className="font-medium px-5 py-2.5 text-sm bg-[#990000] text-white hover:opacity-90 focus-visible:outline-none"
					>
						Excel
					</Button>
				</div>
			</div>

			{/* Tabs Principales */}
			<div className="flex gap-2 items-center">
				<Button
					variant={mainTab === 'stats' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setMainTab('stats')}
				>
					Estadísticas
				</Button>
				<Button
					variant={mainTab === 'history' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setMainTab('history')}
				>
					Historial
				</Button>
			</div>

			{/* Filtros (solo estadísticas) */}
			{mainTab === 'stats' && (
				<div className="bg-white rounded-lg px-6 py-4 border border-default-200 flex flex-wrap items-center gap-4">
					<span className="text-sm font-medium text-default-600 flex items-center gap-2">
						<Calendar className="w-4 h-4" /> Período:
					</span>
					<div className="flex gap-2 flex-wrap">
						<Button
							size="sm"
							variant={period === 'semana' ? 'solid' : 'bordered'}
							color={period === 'semana' ? 'primary' : 'default'}
							className={period === 'semana' ? '' : 'border-default-300'}
							onPress={() => handlePeriodChange('semana')}
						>
							Semana
						</Button>
						<Button
							size="sm"
							variant={period === 'mes' ? 'solid' : 'bordered'}
							color={period === 'mes' ? 'danger' : 'default'}
							className={period === 'mes' ? '' : 'border-default-300'}
							onPress={() => handlePeriodChange('mes')}
						>
							Mes
						</Button>
						<Button
							size="sm"
							variant={period === 'trimestre' ? 'solid' : 'bordered'}
							color={period === 'trimestre' ? 'warning' : 'default'}
							className={period === 'trimestre' ? '' : 'border-default-300'}
							onPress={() => handlePeriodChange('trimestre')}
						>
							Trimestre
						</Button>
						<Button
							size="sm"
							variant={period === 'año' ? 'solid' : 'bordered'}
							color={period === 'año' ? 'success' : 'default'}
							className={period === 'año' ? '' : 'border-default-300'}
							onPress={() => handlePeriodChange('año')}
						>
							Año
						</Button>
					</div>
					<div className="ml-auto">
						<PeriodCalendar
							selectedDate={selectedDate}
							onDateChange={setSelectedDate}
						/>
					</div>
				</div>
			)}

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Spinner size="lg" label="Cargando estadísticas..." />
				</div>
			) : (
				<>
					{mainTab === 'stats' && (
						<div className="space-y-6">
							{/* Métricas principales */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<StatsCard
									title="Total de Usuarios"
									value={1234}
									icon={<Users className="w-6 h-6" />}
									color="success"
									trend={{ value: '+12%', isPositive: true }}
								/>
								<StatsCard
									title="Sesiones este Mes"
									value={342}
									icon={<Calendar className="w-6 h-6" />}
									color="primary"
									trend={{ value: '+8%', isPositive: true }}
								/>
								<StatsCard
									title="Materiales Publicados"
									value={856}
									icon={<BookOpen className="w-6 h-6" />}
									color="warning"
									trend={{ value: '+15%', isPositive: true }}
								/>
								<StatsCard
									title="Horas Totales"
									value={1527}
									icon={<TrendingUp className="w-6 h-6" />}
									color="success"
									trend={{ value: '+10%', isPositive: true }}
								/>
							</div>

							{/* Gráficos */}
							<BarChart
								title="Tutorías por Materia"
								data={topSubjects.map((d) => ({
									label: d.subject,
									value: d.sessions,
									maxValue: 1300,
								}))}
								detailsLink="#"
								color="#990000"
							/>

							<PieChart
								title="Distribución de Usuarios por Rol"
								data={[
									{ label: 'Estudiantes', color: '#2563eb', percentage: 82 },
									{ label: 'Tutores', color: '#10b981', percentage: 16 },
									{ label: 'Administradores', color: '#f59e0b', percentage: 2 },
								]}
								size={200}
							/>

							<LineChart
								title={
									chartTab === 'users'
										? 'Crecimiento de Usuarios'
										: 'Actividad de Tutorías'
								}
								data={
									chartTab === 'users'
										? [
												{ month: 'Jun', value: 920 },
												{ month: 'Jul', value: 980 },
												{ month: 'Ago', value: 1040 },
												{ month: 'Sep', value: 1120 },
												{ month: 'Oct', value: 1248 },
											]
										: [
												{ month: 'Jun', value: 280 },
												{ month: 'Jul', value: 300 },
												{ month: 'Ago', value: 315 },
												{ month: 'Sep', value: 330 },
												{ month: 'Oct', value: 342 },
											]
								}
								tabs={[
									{ label: 'Usuarios', value: 'users' },
									{ label: 'Tutorías', value: 'sessions' },
								]}
								activeTab={chartTab}
								onTabChange={(tab: string) =>
									setChartTab(tab as 'users' | 'sessions')
								}
								color="#990000"
							/>

							{/* Tabla de top materias */}
							<SubjectDetailTable
								title="Top Materias"
								data={topSubjects.map((s) => ({
									subject: s.subject,
									sessions: s.sessions,
									totalHours: '-',
									averageDuration: '-',
								}))}
							/>

							{/* Indicadores adicionales */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Card>
									<CardHeader className="flex items-center justify-between px-6 py-5">
										<h3 className="text-lg font-semibold text-foreground">
											Salud del Sistema
										</h3>
										<BarChart3 className="w-5 h-5 text-default-400" />
									</CardHeader>
									<CardBody className="px-6 py-5 space-y-3">
										<div className="flex justify-between">
											<span className="text-default-600">Disponibilidad</span>
											<span className="font-bold text-success">99.9%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">
												Tiempo de respuesta
											</span>
											<span className="font-bold text-primary">180 ms</span>
										</div>
									</CardBody>
								</Card>

								<Card>
									<CardHeader className="flex items-center justify-between px-6 py-5">
										<h3 className="text-lg font-semibold text-foreground">
											Actividad Reciente
										</h3>
										<PieIcon className="w-5 h-5 text-default-400" />
									</CardHeader>
									<CardBody className="px-6 py-5 space-y-3">
										{[
											{
												label: 'Nuevo usuario registrado',
												tag: 'success' as const,
												time: 'Hace 5 min',
											},
											{
												label: 'Material validado',
												tag: 'primary' as const,
												time: 'Hace 12 min',
											},
											{
												label: 'Reporte recibido',
												tag: 'danger' as const,
												time: 'Hace 23 min',
											},
											{
												label: 'Tutoría completada',
												tag: 'success' as const,
												time: 'Hace 1 hora',
											},
										].map((a, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between"
											>
												<span className="text-sm">{a.label}</span>
												<div className="flex items-center gap-2">
													<Chip size="sm" color={a.tag} variant="flat">
														{a.time}
													</Chip>
												</div>
											</div>
										))}
									</CardBody>
								</Card>
							</div>
						</div>
					)}

					{mainTab === 'history' && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card>
									<CardBody className="text-center">
										<div className="text-2xl font-bold text-success">1,234</div>
										<div className="text-sm text-default-500">
											Total de Usuarios
										</div>
									</CardBody>
								</Card>
								<Card>
									<CardBody className="text-center">
										<div className="text-2xl font-bold text-primary">342</div>
										<div className="text-sm text-default-500">
											Sesiones este Mes
										</div>
									</CardBody>
								</Card>
								<Card>
									<CardBody className="text-center">
										<div className="text-2xl font-bold text-warning">856</div>
										<div className="text-sm text-default-500">
											Materiales Publicados
										</div>
									</CardBody>
								</Card>
								<Card>
									<CardBody className="text-center">
										<div className="text-2xl font-bold text-success">1,527</div>
										<div className="text-sm text-default-500">
											Horas Totales
										</div>
									</CardBody>
								</Card>
							</div>

							<Card>
								<CardHeader className="px-6 py-5">
									<h3 className="text-lg font-semibold text-foreground">
										Resumen de Actividad
									</h3>
								</CardHeader>
								<CardBody className="px-6 py-5 space-y-3">
									<div className="flex justify-between">
										<span className="text-default-600">
											Altas de usuarios (30d)
										</span>
										<span className="font-bold">+184</span>
									</div>
									<div className="flex justify-between">
										<span className="text-default-600">
											Materiales validados (30d)
										</span>
										<span className="font-bold">+256</span>
									</div>
									<div className="flex justify-between">
										<span className="text-default-600">
											Reportes resueltos (30d)
										</span>
										<span className="font-bold">+19</span>
									</div>
								</CardBody>
							</Card>
						</div>
					)}
				</>
			)}
		</div>
	);
}
