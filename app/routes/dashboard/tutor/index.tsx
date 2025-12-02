import { Button, Card, CardBody, CardHeader, Tab, Tabs } from '@heroui/react';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { StatsCard } from '~/components/stats-card';

export default function TutorDashboard() {
	const location = useLocation();
	const isMainDashboard = location.pathname === '/dashboard/tutor';

	const [growthTab, setGrowthTab] = useState<'usuarios' | 'tutorias'>(
		'usuarios',
	);

	const growthData = useMemo(() => {
		const months = ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'];
		return growthTab === 'usuarios'
			? months.map((m, i) => ({ label: m, value: 100 + i * 20 }))
			: months.map((m, i) => ({ label: m, value: 15 + i * 3 }));
	}, [growthTab]);

	function MiniLineChart({
		data,
		color = '#990000',
		width = 900,
		height = 260,
	}: {
		data: { label: string; value: number }[];
		color?: string;
		width?: number;
		height?: number;
	}) {
		const padding = { top: 20, right: 20, bottom: 30, left: 40 };
		const innerW = width - padding.left - padding.right;
		const innerH = height - padding.top - padding.bottom;
		const values = data.map((d) => d.value);
		const min = Math.min(...values);
		const max = Math.max(...values);
		const y = (v: number) =>
			innerH - (innerH * (v - min)) / (max === min ? 1 : max - min);
		const x = (idx: number) => (innerW / (data.length - 1)) * idx;
		const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');

		return (
			<svg viewBox={`0 0 ${width} ${height}`} className="w-full">
				<g transform={`translate(${padding.left}, ${padding.top})`}>
					{/* grid lines */}
					{Array.from({ length: 6 }).map((_, i) => (
						<line
							key={i}
							x1={0}
							y1={(innerH / 5) * i}
							x2={innerW}
							y2={(innerH / 5) * i}
							stroke="#e5e7eb"
							strokeWidth={1}
						/>
					))}

					{/* polyline */}
					<polyline
						fill="none"
						stroke={color}
						strokeWidth={3}
						points={points}
					/>

					{/* points */}
					{data.map((d, i) => (
						<g key={d.label} transform={`translate(${x(i)}, ${y(d.value)})`}>
							<circle r={5} fill={color} />
							<circle
								r={7}
								fill="white"
								fillOpacity={0}
								stroke={color}
								strokeWidth={1}
							/>
						</g>
					))}

					{/* x labels */}
					{data.map((d, i) => (
						<text
							key={`lbl-${d.label}`}
							x={x(i)}
							y={innerH + 20}
							textAnchor="middle"
							fontSize={12}
							fill="#6b7280"
						>
							{d.label}
						</text>
					))}
				</g>
			</svg>
		);
	}

	if (!isMainDashboard) {
		return <Outlet />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Panel de Tutor</h1>
				<p className="text-default-500">
					Gestiona tus tutorías y ve el impacto de tu trabajo.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Tutorías Realizadas"
					value={-1}
					description="Este semestre"
					color="success"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Check circle icon"
						>
							<title>Tutorías realizadas</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Calificación Promedio"
					value="-1"
					description="De 5.0 estrellas"
					color="warning"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Star icon"
						>
							<title>Calificación promedio</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Estudiantes Atendidos"
					value={-1}
					description="Únicos este mes"
					color="primary"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Horas de Tutoría"
					value={-1}
					description="Este semestre"
					color="default"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					}
				/>
			</div>

			{/* Crecimiento (Usuarios/Tutorías) */}
			<Card>
				<CardHeader className="flex items-center justify-between px-6 py-5">
					<h2 className="text-lg font-semibold">Crecimiento de Usuarios</h2>
					<Tabs
						selectedKey={growthTab}
						onSelectionChange={(k) =>
							setGrowthTab(k as 'usuarios' | 'tutorias')
						}
						variant="bordered"
						color="danger"
						size="sm"
					>
						<Tab key="usuarios" title="Usuarios" />
						<Tab key="tutorias" title="Tutorías" />
					</Tabs>
				</CardHeader>
				<CardBody className="px-2 pb-6">
					<MiniLineChart data={growthData} />
				</CardBody>
			</Card>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Acciones Rápidas</h2>
						<div className="flex flex-col gap-2">
							<Button
								as={Link}
								to="/dashboard/tutor/scheduled"
								color="primary"
								fullWidth
							>
								Ver Sesiones Programadas
							</Button>
							<Button
								as={Link}
								to="/dashboard/tutor/materials"
								color="default"
								variant="bordered"
								fullWidth
							>
								Gestionar Materiales
							</Button>
							<Button
								as={Link}
								to="/dashboard/tutor/reports"
								color="default"
								variant="bordered"
								fullWidth
							>
								Ver Reportes
							</Button>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Próximas Sesiones</h2>
						<div className="space-y-3">
							<div className="flex items-start justify-between p-3 bg-default-100 rounded-lg">
								<div className="flex flex-col gap-1">
									<p className="font-semibold">Álgebra Lineal</p>
									<p className="text-small text-default-500">
										con Carlos Rodríguez
									</p>
									<p className="text-tiny text-default-400">Hoy a las 14:00</p>
								</div>
								<Button size="sm" color="primary" variant="flat">
									Iniciar
								</Button>
							</div>
							<div className="flex items-start justify-between p-3 bg-default-100 rounded-lg">
								<div className="flex flex-col gap-1">
									<p className="font-semibold">Estructuras de Datos</p>
									<p className="text-small text-default-500">
										con Ana Martínez
									</p>
									<p className="text-tiny text-default-400">
										Mañana a las 16:00
									</p>
								</div>
								<Button size="sm" color="primary" variant="flat">
									Ver detalles
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Performance Overview */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Resumen de Desempeño</h2>
					{/* TODO: Conectar con API - datos hardcodeados eliminados */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 bg-default-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm font-semibold text-default-600">
									Tendencia
								</p>
							</div>
							<p className="text-2xl font-bold text-default-600">-1%</p>
							<p className="text-tiny text-default-500">Sin datos de API</p>
						</div>
						<div className="p-4 bg-default-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm font-semibold text-default-600">
									Comentarios
								</p>
							</div>
							<p className="text-2xl font-bold text-default-600">-1</p>
							<p className="text-tiny text-default-500">Sin datos de API</p>
						</div>
						<div className="p-4 bg-default-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm font-semibold text-default-600">
									Insignias
								</p>
							</div>
							<p className="text-2xl font-bold text-default-600">-1</p>
							<p className="text-tiny text-default-500">Sin datos de API</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Recent Reviews */}
			<Card>
				<CardBody className="gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Reseñas Recientes</h2>
						<Button
							as={Link}
							to="/dashboard/tutor/reports"
							size="sm"
							variant="light"
							color="primary"
						>
							Ver todas
						</Button>
					</div>
					{/* TODO: Conectar con API - Ejemplo con valores negativos para referencia */}
					<div className="space-y-3">
						<div className="p-4 border border-default-200 rounded-lg opacity-60">
							<div className="flex items-start justify-between mb-2">
								<p className="font-semibold">
									Estudiante Ejemplo (Sin conexión)
								</p>
								<div className="flex items-center gap-1">
									<svg
										className="w-4 h-4 text-default-300 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
									<span className="text-sm">-1</span>
								</div>
							</div>
							<p className="text-sm text-default-600 mb-1">
								Este es un comentario de ejemplo. Conectar con API para ver
								datos reales.
							</p>
							<p className="text-tiny text-default-400">Sin fecha</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
