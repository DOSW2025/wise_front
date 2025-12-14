import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Tab,
	Tabs,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	Award,
	BarChart3,
	Calendar,
	Clock,
	FileText,
	MessageSquare,
	PieChart,
	Star,
	TrendingUp,
	User,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import { DateRangeFilter } from '~/components';
import {
	MonthlyStatsChart,
	PerformanceMetricCard,
	RecentSessionsTable,
	StudentFeedbackList,
	SubjectExpertiseList,
} from '~/components/tutor';
import { useDateFilter } from '~/lib/hooks/useDateFilter';
import {
	mockMonthlyStats,
	mockRecentSessions,
	mockStudentFeedback,
	mockSubjectExpertise,
	mockTutorPerformance,
} from '~/lib/mocks/tutor-performance.mock';

interface CompletedSession {
	id: string;
	studentName: string;
	studentAvatar?: string;
	subject: string;
	topic: string;
	date: string;
	time: string;
	duration: number;
	modality: 'presencial' | 'virtual';
	location?: string;
	status: 'completed';
	rating?: number;
	comment?: string;
	hasResponse?: boolean;
	responseText?: string;
}

export default function TutorReports() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedSession, setSelectedSession] =
		useState<CompletedSession | null>(null);
	const [responseText, setResponseText] = useState('');
	const [activeTab, setActiveTab] = useState<'history' | 'ratings'>('history');
	const [_chartType, _setChartType] = useState<'sessions' | 'ratings'>(
		'sessions',
	);

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

	// Datos para gráficos de reportes
	const subjectData: {
		subject: string;
		sessions: number;
		percentage: number;
	}[] = [
		{ subject: 'Matemáticas', sessions: 35, percentage: 30 },
		{ subject: 'Física', sessions: 28, percentage: 24 },
		{ subject: 'Química', sessions: 25, percentage: 21 },
		{ subject: 'Programación', sessions: 20, percentage: 17 },
		{ subject: 'Inglés', sessions: 10, percentage: 8 },
	];

	const modalityData: { type: string; sessions: number; percentage: number }[] =
		[
			{ type: 'Virtual', sessions: 70, percentage: 60 },
			{ type: 'Presencial', sessions: 48, percentage: 40 },
		];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const [completedSessions, setCompletedSessions] = useState<
		CompletedSession[]
	>([
		{
			id: '-1',
			studentName: 'Estudiante Ejemplo (Sin conexión)',
			subject: 'Sin datos de API',
			topic: 'Esperando conexión',
			date: '1900-01-01',
			time: '00:00',
			duration: -1,
			modality: 'virtual',
			status: 'completed',
			rating: -1,
			comment: 'Comentario de ejemplo. Conectar con API para ver datos reales.',
			hasResponse: false,
		},
	]);

	const handleResponse = (session: CompletedSession) => {
		setSelectedSession(session);
		setResponseText(session.responseText || '');
		onOpen();
	};

	const saveResponse = () => {
		if (selectedSession && responseText.trim()) {
			setCompletedSessions(
				completedSessions.map((session) =>
					session.id === selectedSession.id
						? {
								...session,
								hasResponse: true,
								responseText: responseText.trim(),
							}
						: session,
				),
			);
			onClose();
			setResponseText('');
		}
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${i < rating ? 'fill-warning text-warning' : 'text-default-300'}`}
			/>
		));
	};

	const ratedSessions = completedSessions.filter((session) => session.rating);
	const averageRating =
		ratedSessions.length > 0
			? ratedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) /
				ratedSessions.length
			: 0;

	const totalHours =
		completedSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
	const uniqueStudents = new Set(completedSessions.map((s) => s.studentName))
		.size;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Reportes y Métricas
					</h1>
					<p className="text-default-500">
						Análisis profesional de tu actividad, rendimiento y evaluaciones
					</p>
				</div>
			</div>

			{/* Tabs for different sections */}
			<Tabs
				color="primary"
				variant="underlined"
				size="lg"
				defaultSelectedKey="reports"
			>
				{/* Tab 1: Reportes con Gráficos */}
				<Tab
					key="reports"
					title={
						<div className="flex items-center gap-2">
							<PieChart className="w-4 h-4" />
							<span>Reportes</span>
						</div>
					}
				>
					<div className="mt-6 space-y-6">
						{/* Métricas principales */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardBody className="text-center">
									<TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
									<div className="text-2xl font-bold text-primary">
										{completedSessions.length}
									</div>
									<div className="text-sm text-default-500">
										Tutorías Realizadas
									</div>
								</CardBody>
							</Card>
							<Card>
								<CardBody className="text-center">
									<Star className="w-8 h-8 text-warning mx-auto mb-2" />
									<div className="text-2xl font-bold text-warning">
										{averageRating.toFixed(1)}
									</div>
									<div className="text-sm text-default-500">
										Calificación Promedio
									</div>
								</CardBody>
							</Card>
							<Card>
								<CardBody className="text-center">
									<Users className="w-8 h-8 text-success mx-auto mb-2" />
									<div className="text-2xl font-bold text-success">
										{uniqueStudents}
									</div>
									<div className="text-sm text-default-500">
										Estudiantes Únicos
									</div>
								</CardBody>
							</Card>
							<Card>
								<CardBody className="text-center">
									<Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
									<div className="text-2xl font-bold text-secondary">
										{totalHours.toFixed(1)}
									</div>
									<div className="text-sm text-default-500">Horas Totales</div>
								</CardBody>
							</Card>
						</div>

						{/* Gráfico de barras - Tutorías por materia */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<BarChart3 className="w-5 h-5 text-primary" />
									<h3 className="text-lg font-semibold">
										Tutorías por Materia
									</h3>
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex items-end justify-center gap-8 h-64 p-4">
									{subjectData.map((data, _index) => {
										const height = (data.sessions / 35) * 180;
										return (
											<div
												key={data.subject}
												className="flex flex-col items-center gap-2 group relative"
											>
												<div
													className="w-16 rounded-t-lg transition-all duration-300 hover:brightness-110 cursor-pointer"
													style={{
														height: `${height}px`,
														backgroundColor: '#990000',
													}}
												/>
												<div className="text-xs text-center max-w-16">
													{data.subject.split(' ')[0]}
												</div>
												{/* Tooltip */}
												<div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
													{data.subject}: {data.sessions} sesiones (
													{data.percentage}%)
												</div>
											</div>
										);
									})}
								</div>
							</CardBody>
						</Card>

						{/* Gráfico de pastel - Modalidades de Tutoría */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Award className="w-5 h-5 text-success" />
									<h3 className="text-lg font-semibold">
										Modalidades de Tutoría
									</h3>
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex items-center justify-center gap-8">
									{/* Gráfico de pastel */}
									<div className="relative w-48 h-48">
										<svg
											className="w-full h-full transform -rotate-90"
											viewBox="0 0 100 100"
										>
											{(() => {
												let cumulativePercentage = 0;
												const colors = [
													'hsl(var(--heroui-success))',
													'hsl(var(--heroui-info) / 1)',
												];
												return modalityData.map((data, index) => {
													const startAngle = cumulativePercentage * 3.6;
													cumulativePercentage += data.percentage;
													const endAngle = cumulativePercentage * 3.6;
													const largeArcFlag = data.percentage > 50 ? 1 : 0;
													const x1 =
														50 + 40 * Math.cos((startAngle * Math.PI) / 180);
													const y1 =
														50 + 40 * Math.sin((startAngle * Math.PI) / 180);
													const x2 =
														50 + 40 * Math.cos((endAngle * Math.PI) / 180);
													const y2 =
														50 + 40 * Math.sin((endAngle * Math.PI) / 180);
													return (
														<path
															key={index}
															d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
															fill={colors[index]}
															className="hover:brightness-110 transition-all duration-300 cursor-pointer transform-origin-center hover:scale-105"
															style={{ transformOrigin: '50px 50px' }}
														/>
													);
												});
											})()}
										</svg>
									</div>
									{/* Leyenda */}
									<div className="space-y-3">
										{modalityData.map((data, index) => {
											const colorClasses = [
												'bg-success',
												'bg-[hsl(var(--heroui-info))]',
											];
											return (
												<div
													key={data.type}
													className="flex items-center gap-3 hover:bg-default-50 p-2 rounded-lg transition-colors cursor-pointer"
												>
													<div
														className={`w-4 h-4 rounded ${colorClasses[index]}`}
													/>
													<div className="flex-1">
														<div className="font-medium text-sm">
															{data.type}
														</div>
														<div className="text-xs text-default-500">
															{data.percentage}% ({data.sessions} sesiones)
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</CardBody>
						</Card>

						{/* Métricas de rendimiento */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<h3 className="text-lg font-semibold">Rendimiento Semanal</h3>
								</CardHeader>
								<CardBody>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span>Promedio de sesiones/semana</span>
											<span className="font-semibold">6.2</span>
										</div>
										<div className="flex justify-between">
											<span>Duración promedio</span>
											<span className="font-semibold">95 min</span>
										</div>
										<div className="flex justify-between">
											<span>Modalidad más usada</span>
											<span className="font-semibold">Virtual (60%)</span>
										</div>
									</div>
								</CardBody>
							</Card>

							<Card>
								<CardHeader>
									<h3 className="text-lg font-semibold">Feedback Recibido</h3>
								</CardHeader>
								<CardBody>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span>Evaluaciones recibidas</span>
											<span className="font-semibold">
												{ratedSessions.length}/{completedSessions.length}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Comentarios positivos</span>
											<span className="font-semibold">95%</span>
										</div>
										<div className="flex justify-between">
											<span>Tasa de respuesta</span>
											<span className="font-semibold">
												{Math.round(
													(ratedSessions.filter((s) => s.hasResponse).length /
														ratedSessions.length) *
														100,
												)}
												%
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				</Tab>

				{/* Tab 2: Análisis de Desempeño */}
				<Tab
					key="performance"
					title={
						<div className="flex items-center gap-2">
							<BarChart3 className="w-4 h-4" />
							<span>Análisis de Desempeño</span>
						</div>
					}
				>
					<div className="mt-6 space-y-6">
						{/* Performance Metrics Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<PerformanceMetricCard
								title="Sesiones Totales"
								value={mockTutorPerformance.totalSessions}
								subtitle="En los últimos 3 meses"
								trend="up"
								trendValue="+12%"
								icon={<Users className="w-5 h-5" />}
								color="primary"
							/>
							<PerformanceMetricCard
								title="Calificación Promedio"
								value={mockTutorPerformance.averageRating.toFixed(1)}
								subtitle="De 5.0 estrellas"
								trend="up"
								trendValue="+0.2"
								icon={<Star className="w-5 h-5" />}
								color="warning"
							/>
							<PerformanceMetricCard
								title="Horas Impartidas"
								value={`${mockTutorPerformance.totalHours}h`}
								subtitle="Tiempo total de enseñanza"
								trend="up"
								trendValue="+8h"
								icon={<Clock className="w-5 h-5" />}
								color="success"
							/>
							<PerformanceMetricCard
								title="Tasa de Asistencia"
								value={`${mockTutorPerformance.completionRate}%`}
								subtitle="Estudiantes que asistieron"
								trend="stable"
								trendValue="0%"
								icon={<Award className="w-5 h-5" />}
								color="secondary"
							/>
						</div>

						{/* Additional Metrics */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<PerformanceMetricCard
								title="Estudiantes Únicos"
								value={mockTutorPerformance.totalStudents}
								subtitle="Diferentes estudiantes atendidos"
								icon={<Users className="w-5 h-5" />}
								color="primary"
							/>
							<PerformanceMetricCard
								title="Tiempo de Respuesta"
								value={`${mockTutorPerformance.responseTime}h`}
								subtitle="Promedio de respuesta a solicitudes"
								icon={<Clock className="w-5 h-5" />}
								color="success"
							/>
						</div>

						{/* Recent Sessions */}
						<RecentSessionsTable sessions={mockRecentSessions} />

						{/* Subjects and Monthly Stats */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<SubjectExpertiseList subjects={mockSubjectExpertise} />
							<MonthlyStatsChart stats={mockMonthlyStats} />
						</div>

						{/* Student Feedback */}
						<StudentFeedbackList feedback={mockStudentFeedback} />
					</div>
				</Tab>

				<Tab
					key="history"
					title={
						<div className="flex items-center gap-2">
							<FileText className="w-4 h-4" />
							<span>Historial y Evaluaciones</span>
						</div>
					}
				>
					<div className="mt-6 space-y-6">
						<div className="flex justify-between items-center">
							<div>
								<h2 className="text-xl font-bold text-foreground">
									Historial de Sesiones
								</h2>
								<p className="text-sm text-default-500">
									Sesiones completadas y evaluaciones recibidas
								</p>
							</div>
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

						{isLoading ? (
							<div className="flex justify-center items-center h-64">
								<Spinner size="lg" label="Cargando estadísticas..." />
							</div>
						) : (
							<div className="space-y-6">
								{/* Estadísticas generales */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<Card>
										<CardBody className="text-center">
											<div className="text-2xl font-bold text-primary">
												{completedSessions.length}
											</div>
											<div className="text-sm text-default-500">
												Tutorías Realizadas
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardBody className="text-center">
											<div className="text-2xl font-bold text-warning">
												{averageRating.toFixed(1)}
											</div>
											<div className="text-sm text-default-500">
												Calificación Promedio
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardBody className="text-center">
											<div className="text-2xl font-bold text-success">
												{ratedSessions.length}
											</div>
											<div className="text-sm text-default-500">
												Evaluaciones Recibidas
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardBody className="text-center">
											<div className="text-2xl font-bold text-danger">
												{
													ratedSessions.filter(
														(s) => !s.hasResponse && s.comment,
													).length
												}
											</div>
											<div className="text-sm text-default-500">
												Sin Responder
											</div>
										</CardBody>
									</Card>
								</div>

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
											Tutorías Completadas
										</h2>
										<div className="grid gap-4">
											{completedSessions.map((session) => (
												<Card key={session.id}>
													<CardBody>
														<div className="flex items-start justify-between">
															<div className="flex items-center gap-3">
																<Avatar
																	src={session.studentAvatar}
																	name={session.studentName}
																	size="md"
																	showFallback
																/>
																<div className="space-y-1">
																	<h3 className="font-semibold">
																		{session.studentName}
																	</h3>
																	<div className="flex items-center gap-2">
																		<Chip
																			size="sm"
																			color="primary"
																			variant="flat"
																		>
																			{session.subject}
																		</Chip>
																		<span className="text-sm text-default-600">
																			{session.topic}
																		</span>
																	</div>
																	<div className="flex items-center gap-4 text-sm text-default-500">
																		<div className="flex items-center gap-1">
																			<Calendar className="w-4 h-4" />
																			{new Date(
																				session.date,
																			).toLocaleDateString()}
																		</div>
																		<div className="flex items-center gap-1">
																			<Clock className="w-4 h-4" />
																			{session.time} ({session.duration}min)
																		</div>
																		<span className="capitalize">
																			{session.modality}
																		</span>
																	</div>
																</div>
															</div>
															<div className="flex items-center gap-2">
																{session.rating && (
																	<div className="flex items-center gap-1">
																		{renderStars(session.rating)}
																		<span className="text-sm font-medium ml-1">
																			{session.rating}/5
																		</span>
																	</div>
																)}
																<Chip size="sm" color="success" variant="flat">
																	Completada
																</Chip>
															</div>
														</div>
													</CardBody>
												</Card>
											))}
										</div>
									</div>
								)}

								{/* Evaluaciones y Comentarios */}
								{activeTab === 'ratings' && (
									<div className="space-y-4">
										<h2 className="text-xl font-semibold">
											Evaluaciones Recibidas
										</h2>
										<div className="grid gap-4">
											{ratedSessions.map((session) => (
												<Card
													key={session.id}
													className={
														!session.hasResponse && session.comment
															? 'border-warning'
															: ''
													}
												>
													<CardHeader className="pb-2">
														<div className="flex items-start justify-between w-full">
															<div className="flex items-center gap-3">
																<Avatar
																	src={session.studentAvatar}
																	name={session.studentName}
																	size="sm"
																	showFallback
																/>
																<div>
																	<h3 className="font-semibold">
																		{session.studentName}
																	</h3>
																	<p className="text-sm text-default-500">
																		{session.subject} -{' '}
																		{new Date(
																			session.date,
																		).toLocaleDateString()}
																	</p>
																</div>
															</div>
															<div className="flex items-center gap-2">
																{renderStars(session.rating || 0)}
																<span className="font-medium">
																	{session.rating}/5
																</span>
															</div>
														</div>
													</CardHeader>
													<CardBody className="pt-0">
														{session.comment && (
															<div className="space-y-3">
																<div className="p-3 bg-default-50 rounded-lg">
																	<p className="text-sm">{session.comment}</p>
																</div>

																{session.hasResponse && session.responseText ? (
																	<div className="p-3 bg-primary-50 rounded-lg border-l-4 border-primary">
																		<div className="flex items-center gap-2 mb-2">
																			<User className="w-4 h-4 text-primary" />
																			<span className="text-sm font-medium text-primary">
																				Tu respuesta:
																			</span>
																		</div>
																		<p className="text-sm">
																			{session.responseText}
																		</p>
																	</div>
																) : (
																	<Button
																		size="sm"
																		color="primary"
																		variant="flat"
																		startContent={
																			<MessageSquare className="w-4 h-4" />
																		}
																		onPress={() => handleResponse(session)}
																	>
																		Responder
																	</Button>
																)}
															</div>
														)}
													</CardBody>
												</Card>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</Tab>
			</Tabs>

			{/* Modal para responder comentarios */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>Responder Comentario</ModalHeader>
					<ModalBody>
						{selectedSession && (
							<div className="space-y-4">
								<div className="p-3 bg-default-100 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<Avatar
											src={selectedSession.studentAvatar}
											name={selectedSession.studentName}
											size="sm"
											showFallback
										/>
										<span className="font-medium">
											{selectedSession.studentName}
										</span>
										<div className="flex items-center gap-1">
											{renderStars(selectedSession.rating || 0)}
										</div>
									</div>
									<p className="text-sm text-default-600">
										{selectedSession.comment}
									</p>
								</div>
								<Textarea
									label="Tu respuesta"
									placeholder="Escribe tu respuesta al comentario del estudiante..."
									value={responseText}
									onValueChange={setResponseText}
									minRows={3}
								/>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={saveResponse}
							isDisabled={!responseText.trim()}
						>
							Enviar Respuesta
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
