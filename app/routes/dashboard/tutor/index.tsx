import { Button, Card, CardBody } from '@heroui/react';
import { Link } from 'react-router';
import { StatsCard } from '~/components/stats-card';

export default function TutorDashboard() {
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
					value={48}
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
					value="4.8"
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
					value={32}
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
					value={96}
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

			{/* Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Acciones Rápidas</h2>
						<div className="flex flex-col gap-2">
							<Button
								as={Link}
								to="/dashboard/my-tutoring/schedule"
								color="primary"
								fullWidth
							>
								Configurar Disponibilidad
							</Button>
							<Button
								as={Link}
								to="/dashboard/materials/upload"
								color="default"
								variant="bordered"
								fullWidth
							>
								Subir Material
							</Button>
							<Button
								as={Link}
								to="/dashboard/stats"
								color="default"
								variant="bordered"
								fullWidth
							>
								Ver Estadísticas Completas
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 bg-success-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<svg
									className="w-5 h-5 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
								<p className="text-sm font-semibold text-success">
									Tendencia Positiva
								</p>
							</div>
							<p className="text-2xl font-bold text-success">+15%</p>
							<p className="text-tiny text-success-600">
								Aumento en solicitudes vs mes anterior
							</p>
						</div>
						<div className="p-4 bg-warning-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<svg
									className="w-5 h-5 text-warning"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
									/>
								</svg>
								<p className="text-sm font-semibold text-warning">
									Comentarios Recientes
								</p>
							</div>
							<p className="text-2xl font-bold text-warning">8</p>
							<p className="text-tiny text-warning-600">Sin responder</p>
						</div>
						<div className="p-4 bg-primary-50 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<svg
									className="w-5 h-5 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
									/>
								</svg>
								<p className="text-sm font-semibold text-primary">
									Insignias Ganadas
								</p>
							</div>
							<p className="text-2xl font-bold text-primary">12</p>
							<p className="text-tiny text-primary-600">Total acumulado</p>
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
							to="/dashboard/stats"
							size="sm"
							variant="light"
							color="primary"
						>
							Ver todas
						</Button>
					</div>
					<div className="space-y-3">
						{[
							{
								student: 'Pedro Ramírez',
								rating: 5,
								comment:
									'Excelente tutor, muy claro en sus explicaciones y paciente.',
								date: 'Hace 2 días',
							},
							{
								student: 'Laura Silva',
								rating: 5,
								comment:
									'Me ayudó mucho a entender los conceptos. Muy recomendado.',
								date: 'Hace 5 días',
							},
						].map((review, index) => (
							<div
								key={index}
								className="p-4 border border-default-200 rounded-lg"
							>
								<div className="flex items-start justify-between mb-2">
									<p className="font-semibold">{review.student}</p>
									<div className="flex items-center gap-1">
										{[...Array(review.rating)].map((_, i) => (
											<svg
												key={i}
												className="w-4 h-4 text-warning fill-current"
												viewBox="0 0 24 24"
											>
												<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
											</svg>
										))}
									</div>
								</div>
								<p className="text-sm text-default-600 mb-1">
									{review.comment}
								</p>
								<p className="text-tiny text-default-400">{review.date}</p>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
