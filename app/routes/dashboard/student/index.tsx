import { Button, Card, CardBody } from '@heroui/react';
import { Link } from 'react-router';
import { StatsCard } from '~/components/stats-card';

export default function StudentDashboard() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Panel de Estudiante
				</h1>
				<p className="text-default-500">
					Bienvenido de nuevo. Aquí está tu resumen académico.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Tutorías Completadas"
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
							<title>Tutorías completadas</title>
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
					title="Próximas Tutorías"
					value={-1}
					description="Esta semana"
					color="primary"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Calendar icon"
						>
							<title>Próximas tutorías</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Materiales Descargados"
					value={-1}
					description="Total"
					color="warning"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Download icon"
						>
							<title>Materiales descargados</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Puntos de Reputación"
					value={-1}
					description="Sin conexión API"
					color="default"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Star icon"
						>
							<title>Puntos de reputación</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
					}
				/>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Acciones Rápidas</h2>
						<div className="flex flex-col gap-2">
							<Button
								as={Link}
								to="/dashboard/student/tutoring"
								color="primary"
								fullWidth
							>
								Buscar Tutoría
							</Button>
							<Button
								as={Link}
								to="/dashboard/student/materials"
								color="default"
								variant="bordered"
								fullWidth
							>
								Explorar Materiales
							</Button>
							<Button
								as={Link}
								to="/dashboard/student/community"
								color="default"
								variant="bordered"
								fullWidth
							>
								Ir a Comunidad
							</Button>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Próximas Tutorías</h2>
						<div className="space-y-3">
							<div className="flex items-start justify-between p-3 bg-default-100 rounded-lg">
								<div className="flex flex-col gap-1">
									<p className="font-semibold">Cálculo Diferencial</p>
									<p className="text-small text-default-500">
										con Prof. Juan Pérez
									</p>
									<p className="text-tiny text-default-400">Hoy a las 15:00</p>
								</div>
								<Button size="sm" color="primary" variant="flat">
									Ver detalles
								</Button>
							</div>
							<div className="flex items-start justify-between p-3 bg-default-100 rounded-lg">
								<div className="flex flex-col gap-1">
									<p className="font-semibold">
										Programación Orientada a Objetos
									</p>
									<p className="text-small text-default-500">
										con María González
									</p>
									<p className="text-tiny text-default-400">
										Mañana a las 10:00
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

			{/* Recent Materials */}
			<Card>
				<CardBody className="gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Materiales Recientes</h2>
						<Button
							as={Link}
							to="/dashboard/materials"
							size="sm"
							variant="light"
							color="primary"
						>
							Ver todos
						</Button>
					</div>
					{/* TODO: Conectar con API - Ejemplo con valores negativos para referencia */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 border border-default-200 rounded-lg opacity-60">
							<div className="flex items-start gap-3">
								<div className="p-2 bg-primary-50 text-primary rounded-lg">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-label="Document icon"
									>
										<title>Material descargable</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<p className="font-semibold text-sm">
										Material Ejemplo (Sin conexión)
									</p>
									<p className="text-tiny text-default-500">Sin datos de API</p>
									<p className="text-tiny text-default-400 mt-1">
										-1 descargas
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
