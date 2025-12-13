import { Avatar, Button, Card, CardBody, Chip, Spinner } from '@heroui/react';
import {
	AlertCircle,
	BookOpen,
	Clock,
	MessageSquare,
	TrendingUp,
	Users,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';
import { StatsCard } from '~/components/stats-card';
import { useTutorDashboard } from '~/lib/hooks/useTutorDashboard';
import { usePendingSessions } from './hooks/usePendingSessions';
import { useUpcomingSessions } from './hooks/useUpcomingSessions';

export default function TutorDashboard() {
	const location = useLocation();
	const isMainDashboard = location.pathname === '/dashboard/tutor';
	const { data: dashboardData, isLoading, error } = useTutorDashboard();
	const {
		data: upcomingSessions,
		isLoading: isLoadingSessions,
		error: sessionsError,
	} = useUpcomingSessions();
	const {
		data: pendingSessions,
		isLoading: isLoadingPending,
		error: pendingError,
	} = usePendingSessions();

	if (!isMainDashboard) {
		return <Outlet />;
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center">
					<Spinner size="lg" color="primary" />
					<p className="mt-4 text-default-600">Cargando dashboard...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
				<h3 className="text-lg font-semibold mb-2">
					Error al cargar el dashboard
				</h3>
				<p className="text-default-500">Intenta recargar la página</p>
			</div>
		);
	}

	const { stats, recentRequests, popularMaterials, recentReviews } =
		dashboardData || {};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) return 'Hoy';
		if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
		return date.toLocaleDateString('es-ES', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Panel de Tutor</h1>
				<p className="text-default-500">
					Resumen de tu actividad y elementos importantes de tus secciones.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Tutorías Realizadas"
					value={stats?.tutoriasRealizadas || 0}
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
					value={
						stats?.totalRatings === 0
							? 'Sin calificaciones'
							: (stats?.calificacionPromedio?.toFixed(1) ?? '0.0')
					}
					description={
						stats?.totalRatings === 0
							? 'Aún no ha recibido valoraciones'
							: 'De 5.0 estrellas'
					}
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
					value={stats?.estudiantesAtendidos || 0}
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
					title="Solicitudes Pendientes"
					value={stats?.solicitudesPendientes || 0}
					description="Requieren atención"
					color="danger"
					icon={<AlertCircle className="w-6 h-6" />}
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Próximas Sesiones */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<Clock className="w-5 h-5 text-primary" />
								Próximas Sesiones
							</h2>
							<Button
								as={Link}
								to="/dashboard/tutor/scheduled"
								size="sm"
								variant="light"
								color="primary"
							>
								Ver todas
							</Button>
						</div>
						<div className="space-y-3">
							{isLoadingSessions ? (
								<div className="flex justify-center py-4">
									<Spinner size="sm" />
								</div>
							) : sessionsError ? (
								<p className="text-center text-danger py-4 text-sm">
									Error al cargar sesiones
								</p>
							) : upcomingSessions?.length ? (
								upcomingSessions.slice(0, 2).map((session, index) => {
									const initials = session.studentName
										.split(' ')
										.map((n) => n[0])
										.join('')
										.toUpperCase()
										.slice(0, 2);
									return (
										<div
											key={index}
											className="flex items-start justify-between p-3 bg-default-100 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<Avatar
													name={initials}
													size="sm"
													className="bg-primary text-white"
												/>
												<div className="flex flex-col gap-1">
													<p className="font-semibold text-sm">
														{session.subjectName}
													</p>
													<p className="text-small text-default-500">
														{session.studentName}
													</p>
													<p className="text-tiny text-default-400">
														{formatDate(session.date)} a las {session.startTime}
													</p>
												</div>
											</div>
											<Chip size="sm" color="success" variant="flat">
												Confirmada
											</Chip>
										</div>
									);
								})
							) : (
								<p className="text-center text-default-500 py-4">
									No hay sesiones próximas
								</p>
							)}
						</div>
					</CardBody>
				</Card>

				{/* Solicitudes Recientes */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<Users className="w-5 h-5 text-primary" />
								Solicitudes Recientes
							</h2>
							<Button
								as={Link}
								to="/dashboard/tutor/requests"
								size="sm"
								variant="light"
								color="primary"
							>
								Ver todas
							</Button>
						</div>
						<div className="space-y-3">
							{isLoadingPending ? (
								<div className="flex justify-center py-4">
									<Spinner size="sm" />
								</div>
							) : pendingError ? (
								<p className="text-center text-danger py-4 text-sm">
									Error al cargar solicitudes
								</p>
							) : pendingSessions?.length ? (
								pendingSessions.slice(0, 2).map((request, index) => {
									const initials = request.studentName
										.split(' ')
										.map((n) => n[0])
										.join('')
										.toUpperCase()
										.slice(0, 2);
									const timeAgo = Math.floor(
										(Date.now() - new Date(request.createdAt).getTime()) /
											(1000 * 60 * 60),
									);
									return (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<Avatar
													name={initials}
													size="sm"
													className="bg-warning text-white"
												/>
												<div className="flex flex-col gap-1">
													<p className="font-semibold text-sm">
														{request.studentName}
													</p>
													<p className="text-small text-default-600">
														{request.subjectName}
													</p>
													<p className="text-tiny text-default-400">
														{timeAgo > 0
															? `Hace ${timeAgo} hora${timeAgo > 1 ? 's' : ''}`
															: 'Hace poco'}
													</p>
												</div>
											</div>
											<Chip size="sm" color="warning" variant="flat">
												Pendiente
											</Chip>
										</div>
									);
								})
							) : (
								<p className="text-center text-default-500 py-4">
									No hay solicitudes recientes
								</p>
							)}
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Secondary Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Mis Materiales Populares */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<BookOpen className="w-5 h-5 text-primary" />
								Mis Materiales Populares
							</h2>
							<Button
								as={Link}
								to="/dashboard/tutor/materials"
								size="sm"
								variant="light"
								color="primary"
							>
								Ver todos
							</Button>
						</div>
						<div className="space-y-3">
							{popularMaterials?.length ? (
								popularMaterials.slice(0, 2).map((material) => (
									<div
										key={material.id}
										className="flex items-center justify-between p-3 bg-default-100 rounded-lg"
									>
										<div>
											<p className="font-semibold text-sm">{material.nombre}</p>
											<p className="text-small text-default-500">
												{material.materia}
											</p>
											<div className="flex items-center gap-4 mt-1">
												<span className="text-tiny text-default-400">
													{material.descargas} descargas
												</span>
												<span className="text-tiny text-default-400">
													⭐ {material.calificacion.toFixed(1)}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<TrendingUp className="w-4 h-4 text-success" />
											<span className="text-tiny text-success">
												+{material.weeklyGrowth} esta semana
											</span>
										</div>
									</div>
								))
							) : (
								<p className="text-center text-default-500 py-4">
									No hay materiales disponibles
								</p>
							)}
						</div>
					</CardBody>
				</Card>

				{/* Comentarios Recientes */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<MessageSquare className="w-5 h-5 text-primary" />
								Comentarios Recientes
							</h2>
							<Button
								as={Link}
								to="/dashboard/tutor/reports"
								size="sm"
								variant="light"
								color="primary"
							>
								Ver todos
							</Button>
						</div>
						<div className="space-y-3">
							{recentReviews?.length ? (
								recentReviews.slice(0, 2).map((review) => {
									const initials = review.studentName
										.split(' ')
										.map((n) => n[0])
										.join('')
										.toUpperCase();
									const timeAgo = new Date(
										Date.now() - new Date(review.createdAt).getTime(),
									).getHours();
									const stars = '⭐'.repeat(review.rating);
									return (
										<div
											key={review.id}
											className="p-3 bg-default-100 rounded-lg"
										>
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<Avatar
														src={review.studentAvatar}
														name={initials}
														size="sm"
														className="bg-blue-500 text-white"
													/>
													<span className="font-semibold text-sm">
														{review.studentName}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<span className="text-yellow-500">{stars}</span>
												</div>
											</div>
											<p className="text-sm text-default-600 mb-1">
												"{review.comment}"
											</p>
											<p className="text-tiny text-default-400">
												{timeAgo > 24
													? 'Ayer'
													: timeAgo > 0
														? `Hace ${timeAgo} horas`
														: 'Hace poco'}
											</p>
										</div>
									);
								})
							) : (
								<p className="text-center text-default-500 py-4">
									No hay comentarios recientes
								</p>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
