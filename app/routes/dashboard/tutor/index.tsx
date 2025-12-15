import { Avatar, Button, Card, CardBody, Chip, Spinner } from '@heroui/react';
import {
	AlertCircle,
	BookOpen,
	Clock,
	MessageSquare,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';
import { RecentComments } from '~/components/recent-comments';
import { StatsCard } from '~/components/stats-card';
import { useAuth } from '~/contexts/auth-context';
import {
	useAverageRating,
	useTopMaterials,
	useTutorDashboard,
} from '~/lib/hooks/useTutorDashboard';
import { useTutoriaStats } from '~/lib/hooks/useTutoriaStats';
import { usePendingSessions } from './hooks/usePendingSessions';
import { useTutorProfile } from './hooks/useTutorProfile';
import { useUpcomingSessions } from './hooks/useUpcomingSessions';

export default function TutorDashboard() {
	const location = useLocation();
	const isMainDashboard = location.pathname === '/dashboard/tutor';
	const { user } = useAuth();
	const { data: dashboardData, isLoading, error } = useTutorDashboard();

	// Obtener estadísticas reales desde el backend
	const { data: tutoriaStats, isLoading: isLoadingStats } = useTutoriaStats(
		user?.id || '',
		!!user?.id,
	);

	// Obtener calificación promedio del tutor por materiales
	const { data: averageRatingData, isLoading: isLoadingAverageRating } =
		useAverageRating(user?.id || '');

	// Obtener materiales top del tutor
	const { data: topMaterials = [], isLoading: isLoadingTopMaterials } =
		useTopMaterials(user?.id || '');

	// Obtener perfil del tutor con ratings/comentarios
	const {
		data: tutorProfile,
		isLoading: isLoadingProfile,
		isError: isErrorProfile,
	} = useTutorProfile(user?.id || '', !!user?.id);
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
					value={
						isLoadingStats ? '...' : (tutoriaStats?.sesionesCompletadas ?? 0)
					}
					description="Sesiones completadas"
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
						isLoadingAverageRating
							? '...'
							: averageRatingData && averageRatingData.calificacionPromedio > 0
								? averageRatingData.calificacionPromedio.toFixed(1)
								: 'Sin calificaciones'
					}
					description={
						averageRatingData && averageRatingData.calificacionPromedio > 0
							? 'Calificación de materiales'
							: 'Aún no ha recibido valoraciones'
					}
					color="warning"
					icon={<Star className="w-6 h-6" />}
				/>
				<StatsCard
					title="Horas de Tutoría"
					value={
						isLoadingStats
							? '...'
							: `${tutoriaStats?.horasDeTutoria?.toFixed(1) ?? 0}h`
					}
					description="Tiempo total dedicado"
					color="primary"
					icon={<Clock className="w-6 h-6" />}
				/>
				<StatsCard
					title="Solicitudes Pendientes"
					value={
						isLoadingStats ? '...' : (tutoriaStats?.sesionesPendientes ?? 0)
					}
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
						{isLoadingTopMaterials ? (
							<div className="flex justify-center py-8">
								<Spinner size="sm" />
							</div>
						) : topMaterials.length > 0 ? (
							<div className="space-y-3 max-h-96 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent scrollbar-hide">
								{topMaterials.map((material) => (
									<div
										key={material.id}
										className="flex items-center justify-between p-3 bg-default-100 rounded-lg"
									>
										<div>
											<p className="font-semibold text-sm">{material.nombre}</p>
											<p className="text-small text-default-500">
												{material.tags?.[0] || 'Sin categoría'}
											</p>
											<div className="flex items-center gap-4 mt-1">
												<span className="text-tiny text-default-400">
													{material.descargas} descargas
												</span>
												<span className="text-tiny text-default-400">
													⭐{' '}
													{material.calificacionPromedio?.toFixed(1) || 'N/A'}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<TrendingUp className="w-4 h-4 text-success" />
											<span className="text-tiny text-success">
												{material.vistos || 0} vistas
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-center text-default-500 py-4">
								No hay materiales disponibles
							</p>
						)}
					</CardBody>
				</Card>

				{/* Comentarios Recientes */}
				<RecentComments
					ratings={tutorProfile?.ratings ?? []}
					isLoading={isLoadingProfile}
					isError={isErrorProfile}
				/>
			</div>
		</div>
	);
}
