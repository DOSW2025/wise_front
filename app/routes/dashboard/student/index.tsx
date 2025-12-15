import { Button, Card, CardBody, Spinner } from '@heroui/react';
import { AlertCircle, BookOpen, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { RecommendedTutorsList } from '~/components/recommended-tutors-list';
import { StatsCard } from '~/components/stats-card';
import { StudentUpcomingTutoringsCard } from '~/components/student-upcoming-tutorings-card';
import { TutorProfileModal } from '~/components/tutor-profile-modal';
import { useAuth } from '~/contexts/auth-context';
import {
	useMaterialsByDate,
	useStudentDashboard,
} from '~/lib/hooks/useStudentDashboard';
import { useTutoriaStats } from '~/lib/hooks/useTutoriaStats';

export default function StudentDashboard() {
	const { user } = useAuth();
	const { data: dashboardData, isLoading, error } = useStudentDashboard();
	const { data: stats, isLoading: isLoadingStats } = useTutoriaStats(
		user?.id || '',
		!!user?.id,
	);
	const { data: materialsByDate = [], isLoading: isLoadingMaterialsByDate } =
		useMaterialsByDate();
	const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground font-heading">
					Panel de Estudiante
				</h1>
				<p className="text-default-500">
					Resumen de tu progreso académico y actividades recientes.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Tutorías Completadas"
					value={isLoadingStats ? '...' : (stats?.sesionesCompletadas ?? 0)}
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
					value={isLoadingStats ? '...' : (stats?.sesionesConfirmadas ?? 0)}
					description="Confirmadas"
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
					title="Horas de Tutoría"
					value={isLoadingStats ? '...' : `${stats?.horasDeTutoria || 0}h`}
					description="Este semestre"
					color="warning"
					icon={<TrendingUp className="w-6 h-6" />}
				/>
				<StatsCard
					title="Calificaciones"
					value={isLoadingStats ? '...' : stats?.totalCalificaciones || 0}
					description="Total recibidas"
					color="default"
					icon={<BookOpen className="w-6 h-6" />}
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Próximas Tutorías */}
				<StudentUpcomingTutoringsCard />

				{/* Tutores Recomendados */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
								<Users className="w-5 h-5 text-primary" />
								Tutores Recomendados
							</h2>
							<Button
								as={Link}
								to="/dashboard/student/tutoring"
								size="sm"
								variant="light"
								color="primary"
								className="font-nav"
							>
								Ver más
							</Button>
						</div>
						<RecommendedTutorsList />
					</CardBody>
				</Card>
			</div>

			{/* Secondary Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Materiales Recientes */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
								<BookOpen className="w-5 h-5 text-primary" />
								Materiales Recientes
							</h2>
							<Button
								as={Link}
								to="/dashboard/student/materials"
								size="sm"
								variant="light"
								color="primary"
								className="font-nav"
							>
								Ver todos
							</Button>
						</div>
						{isLoadingMaterialsByDate ? (
							<div className="flex justify-center py-8">
								<Spinner size="sm" />
							</div>
						) : materialsByDate.length > 0 ? (
							<div className="space-y-3 max-h-96 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent scrollbar-hide">
								{materialsByDate.map((material) => {
									const timeAgo = Math.floor(
										(Date.now() -
											new Date(
												material.createdAt ||
													material.downloadedAt ||
													new Date(),
											).getTime()) /
											(1000 * 60 * 60 * 24),
									);

									let timeText = 'hoy';
									if (timeAgo > 1) {
										timeText = `hace ${timeAgo} días`;
									} else if (timeAgo === 1) {
										timeText = 'ayer';
									}

									const displayName =
										material.nombre || material.name || 'Sin nombre';
									const displaySubject =
										material.tags?.[0] || material.subject || 'Sin categoría';
									const actionText = 'Publicado';

									return (
										<div
											key={material.id}
											className="flex items-center justify-between p-3 bg-default-100 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div className="p-2 bg-secondary-50 text-primary rounded-lg">
													<BookOpen className="w-4 h-4" />
												</div>
												<div>
													<p className="font-semibold text-sm">{displayName}</p>
													<p className="text-small text-default-500">
														{displaySubject}
													</p>
													<p className="text-tiny text-default-400">
														{actionText} {timeText}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<Star className="w-3 h-3 text-yellow-500 fill-current" />
												<span className="text-tiny">
													{material.vistos || 0} vistas
												</span>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-center text-default-500 py-4">
								No hay materiales recientes
							</p>
						)}
					</CardBody>
				</Card>

				{/* Actividad Reciente */}
				<Card>
					<CardBody className="gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
								<MessageSquare className="w-5 h-5 text-primary" />
								Actividad Reciente
							</h2>
							<Button
								as={Link}
								to="/dashboard/student/progress"
								size="sm"
								variant="light"
								color="primary"
								className="font-nav"
							>
								Ver progreso
							</Button>
						</div>
						<div className="space-y-3">
							{recentActivity?.length ? (
								recentActivity.slice(0, 2).map((activity) => {
									const timeAgo = new Date(
										Date.now() - new Date(activity.createdAt).getTime(),
									).getHours();

									let timeText = 'Hace poco';
									if (timeAgo > 24) {
										timeText = 'Ayer';
									} else if (timeAgo > 0) {
										timeText = `Hace ${timeAgo} horas`;
									}

									const bgColor =
										activity.type === 'tutoring_completed'
											? 'bg-green-50 border border-green-200'
											: 'bg-blue-50 border border-blue-200';
									const dotColor =
										activity.type === 'tutoring_completed'
											? 'bg-green-500'
											: 'bg-blue-500';
									return (
										<div
											key={activity.id}
											className={`p-3 rounded-lg ${bgColor}`}
										>
											<div className="flex items-center gap-2 mb-1">
												<div
													className={`w-2 h-2 rounded-full ${dotColor}`}
												></div>
												<span className="font-semibold text-sm">
													{activity.title}
												</span>
											</div>
											<p className="text-sm text-default-600">
												{activity.description}
											</p>
											<p className="text-tiny text-default-400">{timeText}</p>
										</div>
									);
								})
							) : (
								<p className="text-center text-default-500 py-4">
									No hay actividad reciente
								</p>
							)}
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Modal del perfil del tutor */}
			<TutorProfileModal
				isOpen={!!selectedTutorId}
				onClose={() => setSelectedTutorId(null)}
				tutorId={selectedTutorId}
			/>
		</div>
	);
}
