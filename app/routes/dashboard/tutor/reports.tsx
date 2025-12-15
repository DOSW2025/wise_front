import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Skeleton,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import {
	AlertCircle,
	Ban,
	CalendarOff,
	CheckCheck,
	CheckCircle,
	CheckCircle2,
	Clock,
	Star,
	StarOff,
	TrendingUp,
	User,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '~/contexts/auth-context';
import { getUserName } from '~/lib/services/tutoria.service';
import type { TutorSessionWithRating } from '~/lib/types/tutoria.types';
import { useTutorReputacion } from './hooks/useTutorReputacion';
import { useTutorSessionHistory } from './hooks/useTutorSessionHistory';
import { useTutorStats } from './hooks/useTutorStats';

// Helper: Formatear fecha a español
const formatDateToSpanish = (isoDate: string): string => {
	const date = new Date(isoDate);
	const dayNames = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	];
	const monthNames = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic',
	];
	const dayName = dayNames[date.getDay()];
	const day = date.getDate();
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	return `${dayName}, ${day} ${month}, ${year}`;
};

// Helper: Renderizar estrellas de calificación
const renderStars = (score: number) => {
	return Array.from({ length: 5 }, (_, i) => {
		if (i < score) {
			return (
				<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
			);
		}
		return <StarOff key={i} className="w-4 h-4 text-default-300" />;
	});
};

// Helper: Obtener configuración de badge según estado
const getStatusConfig = (status: string) => {
	switch (status) {
		case 'PENDIENTE':
			return {
				color: 'warning' as const,
				icon: <Clock className="w-3 h-3" />,
				label: 'Pendiente',
			};
		case 'CONFIRMADA':
			return {
				color: 'primary' as const,
				icon: <CheckCircle className="w-3 h-3" />,
				label: 'Confirmada',
			};
		case 'COMPLETADA':
			return {
				color: 'success' as const,
				icon: <CheckCheck className="w-3 h-3" />,
				label: 'Completada',
			};
		case 'CANCELADA':
			return {
				color: 'danger' as const,
				icon: <XCircle className="w-3 h-3" />,
				label: 'Cancelada',
			};
		case 'RECHAZADA':
			return {
				color: 'danger' as const,
				icon: <Ban className="w-3 h-3" />,
				label: 'Rechazada',
			};
		default:
			return {
				color: 'default' as const,
				icon: <Clock className="w-3 h-3" />,
				label: status,
			};
	}
};

// Component: Fetch and display student name
const StudentName = ({ studentId }: { studentId: string }) => {
	const { data: studentName, isLoading } = useQuery({
		queryKey: ['studentName', studentId],
		queryFn: () => getUserName(studentId),
		staleTime: 1000 * 60 * 10, // 10 minutos
		gcTime: 1000 * 60 * 30, // 30 minutos
	});

	if (isLoading) {
		return <span className="text-default-400">Cargando...</span>;
	}

	return <span>{studentName || 'Estudiante'}</span>;
};

export default function TutorReports() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<'history' | 'ratings'>('history');

	// Obtener estadísticas del tutor
	const {
		data: tutorStats,
		isLoading: isLoadingStats,
		error: statsError,
	} = useTutorStats(user?.id || '', !!user?.id);

	// Obtener reputación del tutor
	const {
		data: tutorReputacion,
		isLoading: isLoadingReputacion,
		error: reputacionError,
	} = useTutorReputacion(user?.id || '', !!user?.id);

	// Obtener historial de sesiones
	const {
		data: sessionHistory,
		isLoading: isLoadingHistory,
		error: historyError,
	} = useTutorSessionHistory(user?.id || '', !!user?.id);

	const isLoading = isLoadingStats || isLoadingReputacion || isLoadingHistory;
	const hasError = statsError || reputacionError || historyError;

	// Ordenar sesiones por fecha (más recientes primero)
	const sortedSessions = sessionHistory
		? [...sessionHistory].sort(
				(a, b) =>
					new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
			)
		: [];

	// Filtrar sesiones calificadas para la pestaña de evaluaciones
	const ratedSessions = sortedSessions.filter((session) => session.rated);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Reportes y métricas de tutorías
					</h1>
					<p className="text-default-500">
						Revisa tus rendimientos como tutos, historial de sesiones y
						evaluaciones recibidas.
					</p>
				</div>
			</div>

			<div className="mt-6 space-y-6">
				<div>
					<h2 className="text-xl font-bold text-foreground">
						Estadísticas generales de tus sesiones de tutoría
					</h2>
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner size="lg" label="Cargando estadísticas..." />
					</div>
				) : hasError ? (
					<Card>
						<CardBody className="text-center py-8">
							<p className="text-danger">
								Error al cargar las estadísticas. Por favor, intenta nuevamente.
							</p>
						</CardBody>
					</Card>
				) : (
					<div className="space-y-6">
						{/* Estadísticas generales */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{/* Total de Sesiones */}
							<Card className="border-l-4 border-l-primary">
								<CardBody className="text-center">
									<TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
									<div className="text-3xl font-bold text-primary">
										{tutorStats?.totalSesiones || 0}
									</div>
									<div className="text-sm text-default-500 font-medium">
										Total de Sesiones
									</div>
								</CardBody>
							</Card>

							{/* Calificación Promedio */}
							<Card className="border-l-4 border-l-warning">
								<CardBody className="text-center">
									<div className="flex items-center justify-center gap-1 mb-2">
										<Star className="w-8 h-8 text-warning fill-warning" />
									</div>
									<div className="text-3xl font-bold text-warning">
										{tutorReputacion?.reputacion?.toFixed(2) || '0.00'}
									</div>
									<div className="text-sm text-default-500 font-medium">
										Calificación Promedio
									</div>
									<div className="text-xs text-default-400 mt-1">
										{tutorReputacion?.totalRatings || 0} calificaciones
									</div>
								</CardBody>
							</Card>

							{/* Horas de Tutoría */}
							<Card className="border-l-4 border-l-success">
								<CardBody className="text-center">
									<Clock className="w-8 h-8 text-success mx-auto mb-2" />
									<div className="text-3xl font-bold text-success">
										{tutorStats?.horasDeTutoria?.toFixed(1) || '0.0'}
									</div>
									<div className="text-sm text-default-500 font-medium">
										Horas Impartidas
									</div>
								</CardBody>
							</Card>

							{/* Sesiones Completadas */}
							<Card className="border-l-4 border-l-secondary">
								<CardBody className="text-center">
									<CheckCircle2 className="w-8 h-8 text-secondary mx-auto mb-2" />
									<div className="text-3xl font-bold text-secondary">
										{tutorStats?.sesionesCompletadas || 0}
									</div>
									<div className="text-sm text-default-500 font-medium">
										Sesiones Completadas
									</div>
								</CardBody>
							</Card>
						</div>

						{/* Estadísticas Detalladas */}
						<Card>
							<CardHeader>
								<h3 className="text-lg font-semibold">Desglose de Sesiones</h3>
							</CardHeader>
							<CardBody>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
											<Clock className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-blue-600">
												{tutorStats?.sesionesPendientes || 0}
											</div>
											<div className="text-xs text-default-600">Pendientes</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
											<CheckCircle2 className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-green-600">
												{tutorStats?.sesionesConfirmadas || 0}
											</div>
											<div className="text-xs text-default-600">
												Confirmadas
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
											<CheckCircle2 className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-purple-600">
												{tutorStats?.sesionesCompletadas || 0}
											</div>
											<div className="text-xs text-default-600">
												Completadas
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
											<XCircle className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-orange-600">
												{tutorStats?.sesionesCanceladas || 0}
											</div>
											<div className="text-xs text-default-600">Canceladas</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
											<XCircle className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-red-600">
												{tutorStats?.sesionesRechazadas || 0}
											</div>
											<div className="text-xs text-default-600">Rechazadas</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
										<div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
											<Star className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-2xl font-bold text-yellow-600">
												{tutorStats?.totalCalificaciones || 0}
											</div>
											<div className="text-xs text-default-600">
												Calificaciones
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						{/* Tabs secundarios */}
						<div className="flex gap-2">
							<Button
								variant={activeTab === 'history' ? 'solid' : 'light'}
								color="primary"
								onPress={() => setActiveTab('history')}
							>
								Historial de Tutorías
							</Button>
							<Button
								variant={activeTab === 'ratings' ? 'solid' : 'light'}
								color="primary"
								onPress={() => setActiveTab('ratings')}
							>
								Evaluaciones y Comentarios
							</Button>
						</div>

						{/* Historial de Tutorías */}
						{activeTab === 'history' && (
							<div className="space-y-4">
								<h2 className="text-xl font-semibold">
									Historial Completo de Sesiones
								</h2>

								{isLoadingHistory ? (
									<Card>
										<CardBody className="space-y-3">
											{Array.from({ length: 6 }).map((_, i) => (
												<div key={i} className="flex items-center gap-4">
													<Skeleton className="w-12 h-12 rounded-full" />
													<div className="flex-1 space-y-2">
														<Skeleton className="h-4 w-3/4" />
														<Skeleton className="h-3 w-1/2" />
													</div>
													<Skeleton className="h-8 w-24" />
												</div>
											))}
										</CardBody>
									</Card>
								) : historyError ? (
									<Card>
										<CardBody className="text-center py-12">
											<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-danger mb-2">
												No pudimos cargar tu historial
											</h3>
											<p className="text-default-500">
												Ocurrió un error al obtener tus sesiones. Por favor,
												intenta nuevamente.
											</p>
										</CardBody>
									</Card>
								) : sortedSessions.length === 0 ? (
									<Card>
										<CardBody className="text-center py-12">
											<CalendarOff className="w-12 h-12 text-default-400 mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-default-700 mb-2">
												Aún no tienes sesiones en tu historial
											</h3>
											<p className="text-default-500">
												Cuando realices tutorías, aparecerán aquí.
											</p>
										</CardBody>
									</Card>
								) : (
									<Card>
										<CardBody className="p-0">
											<Table
												aria-label="Historial de sesiones de tutoría"
												removeWrapper
												className="min-w-full"
											>
												<TableHeader>
													<TableColumn>ESTUDIANTE</TableColumn>
													<TableColumn>MATERIA</TableColumn>
													<TableColumn>ESTADO</TableColumn>
													<TableColumn>FECHA</TableColumn>
													<TableColumn>HORA</TableColumn>
													<TableColumn>CALIFICACIÓN</TableColumn>
												</TableHeader>
												<TableBody>
													{sortedSessions.map((session) => {
														const statusConfig = getStatusConfig(
															session.status,
														);
														return (
															<TableRow key={session.id}>
																{/* Estudiante */}
																<TableCell>
																	<div className="flex items-center gap-2">
																		<User className="w-4 h-4 text-default-400" />
																		<span className="text-sm">
																			<StudentName
																				studentId={session.studentId}
																			/>
																		</span>
																	</div>
																</TableCell>

																{/* Materia */}
																<TableCell>
																	<Chip
																		size="sm"
																		variant="flat"
																		color="default"
																	>
																		{session.codigoMateria}
																	</Chip>
																</TableCell>

																{/* Estado */}
																<TableCell>
																	<Chip
																		size="sm"
																		color={statusConfig.color}
																		variant="flat"
																		startContent={statusConfig.icon}
																	>
																		{statusConfig.label}
																	</Chip>
																</TableCell>

																{/* Fecha */}
																<TableCell>
																	<div className="text-sm">
																		{formatDateToSpanish(session.scheduledAt)}
																	</div>
																</TableCell>

																{/* Hora */}
																<TableCell>
																	<div className="text-sm font-mono">
																		{session.startTime} - {session.endTime}
																	</div>
																</TableCell>

																{/* Calificación */}
																<TableCell>
																	{session.rated && session.rating ? (
																		<div className="flex items-center gap-2">
																			<div className="flex items-center gap-0.5">
																				{renderStars(session.rating.score)}
																			</div>
																			<span className="text-sm font-medium text-yellow-600">
																				{session.rating.score}/5
																			</span>
																		</div>
																	) : (
																		<span className="text-sm text-default-400">
																			Sin calificar
																		</span>
																	)}
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</CardBody>
									</Card>
								)}
							</div>
						)}

						{/* Evaluaciones y Comentarios */}
						{activeTab === 'ratings' && (
							<div className="space-y-4">
								<h2 className="text-xl font-semibold">
									Evaluaciones Recibidas
								</h2>

								{isLoadingHistory ? (
									<Card>
										<CardBody className="space-y-4">
											{Array.from({ length: 3 }).map((_, i) => (
												<div key={i} className="space-y-3">
													<div className="flex items-center gap-3">
														<Skeleton className="w-10 h-10 rounded-full" />
														<div className="flex-1 space-y-2">
															<Skeleton className="h-4 w-1/3" />
															<Skeleton className="h-3 w-1/4" />
														</div>
														<Skeleton className="h-6 w-20" />
													</div>
													<Skeleton className="h-16 w-full rounded-lg" />
												</div>
											))}
										</CardBody>
									</Card>
								) : historyError ? (
									<Card>
										<CardBody className="text-center py-12">
											<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-danger mb-2">
												No pudimos cargar las evaluaciones
											</h3>
											<p className="text-default-500">
												Ocurrió un error al obtener las evaluaciones. Por favor,
												intenta nuevamente.
											</p>
										</CardBody>
									</Card>
								) : ratedSessions.length === 0 ? (
									<Card>
										<CardBody className="text-center py-12">
											<Star className="w-12 h-12 text-default-400 mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-default-700 mb-2">
												Aún no tienes evaluaciones
											</h3>
											<p className="text-default-500">
												Cuando los estudiantes califiquen tus tutorías,
												aparecerán aquí.
											</p>
										</CardBody>
									</Card>
								) : (
									<div className="grid gap-4">
										{ratedSessions.map((session) => (
											<Card key={session.id}>
												<CardHeader className="pb-2">
													<div className="flex items-start justify-between w-full">
														<div className="flex items-center gap-3">
															<User className="w-10 h-10 text-default-400 rounded-full bg-default-100 p-2" />
															<div>
																<h3 className="font-semibold">
																	<StudentName studentId={session.studentId} />
																</h3>
																<p className="text-sm text-default-500">
																	{session.codigoMateria} -{' '}
																	{formatDateToSpanish(session.scheduledAt)}
																</p>
															</div>
														</div>
														<div className="flex items-center gap-2">
															<div className="flex items-center gap-0.5">
																{renderStars(session.rating?.score || 0)}
															</div>
															<span className="font-medium text-yellow-600">
																{session.rating?.score || 0}/5
															</span>
														</div>
													</div>
												</CardHeader>
												<CardBody className="pt-0">
													{session.rating?.comment && (
														<div className="p-3 bg-default-50 rounded-lg">
															<p className="text-sm">
																{session.rating.comment}
															</p>
														</div>
													)}
												</CardBody>
											</Card>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
