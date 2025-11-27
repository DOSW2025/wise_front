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
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	Calendar,
	Clock,
	MessageSquare,
	Star,
	TrendingUp,
	User,
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
	const [mainTab, setMainTab] = useState<'stats' | 'history'>('stats');
	const [activeTab, setActiveTab] = useState<'history' | 'ratings'>('history');
	const [chartType, setChartType] = useState<'sessions' | 'ratings'>(
		'sessions',
	);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const { period, isLoading, handlePeriodChange } = useDateFilter();

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const _monthlyData: { month: string; sessions: number; rating: number }[] = [
		{ month: 'Ejemplo', sessions: -1, rating: -1 },
	];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const subjectData: {
		subject: string;
		sessions: number;
		percentage: number;
	}[] = [
		{ subject: 'Matemáticas', sessions: 360, percentage: 40 },
		{ subject: 'Programación', sessions: 300, percentage: 33 },
		{ subject: 'Física', sessions: 200, percentage: 22 },
		{ subject: 'Química', sessions: 150, percentage: 16 },
		{ subject: 'Inglés', sessions: 120, percentage: 13 },
	];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const _modalityData: {
		type: string;
		sessions: number;
		percentage: number;
	}[] = [{ type: 'Sin conexión', sessions: -1, percentage: -1 }];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const [completedSessions, setCompletedSessions] = useState<
		CompletedSession[]
	>([
		// Datos de ejemplo para desarrollo - valores ajustados para que den totales de 87 sesiones, 156 estudiantes, 4.8 rating, 134 horas
		{
			id: '1',
			studentName: 'Juan García',
			subject: 'Matemáticas',
			topic: 'Álgebra Lineal',
			date: '2024-11-20',
			time: '14:00',
			duration: 120,
			modality: 'virtual',
			status: 'completed',
			rating: 5,
		},
		{
			id: '2',
			studentName: 'María López',
			subject: 'Programación',
			topic: 'React Hooks',
			date: '2024-11-19',
			time: '15:30',
			duration: 90,
			modality: 'presencial',
			status: 'completed',
			rating: 5,
		},
		{
			id: '3',
			studentName: 'Carlos Rodríguez',
			subject: 'Física',
			topic: 'Mecánica Clásica',
			date: '2024-11-18',
			time: '10:00',
			duration: 150,
			modality: 'virtual',
			status: 'completed',
			rating: 4,
		},
		{
			id: '4',
			studentName: 'Ana Martínez',
			subject: 'Inglés',
			topic: 'Gramática Avanzada',
			date: '2024-11-17',
			time: '16:00',
			duration: 60,
			modality: 'virtual',
			status: 'completed',
			rating: 5,
		},
		{
			id: '5',
			studentName: 'Pedro Sánchez',
			subject: 'Química',
			topic: 'Reacciones Químicas',
			date: '2024-11-16',
			time: '11:00',
			duration: 120,
			modality: 'presencial',
			status: 'completed',
			rating: 5,
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

	const _totalHours =
		completedSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
	const _uniqueStudents = new Set(completedSessions.map((s) => s.studentName))
		.size;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{/* Encabezado */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Reportes y Métricas
						</h1>
						<p className="text-default-500">
							Seguimiento de tu desempeño como tutor
						</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="bordered"
							color="default"
							startContent={
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
							}
						>
							PDF
						</Button>
						<Button
							variant="solid"
							color="primary"
							startContent={
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
							}
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
						Historial y Evaluaciones
					</Button>
				</div>

				{/* Filtros - Panel (solo en vista de Estadísticas) */}
				{mainTab === 'stats' && (
					<div className="bg-white rounded-lg px-6 py-4 border border-default-200 flex flex-wrap items-center gap-4">
						{/* Etiqueta Período */}
						<span className="text-sm font-medium text-default-600 flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							Período:
						</span>

						{/* Botones de Período */}
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

						{/* Calendario */}
						<div className="ml-auto">
							<PeriodCalendar
								selectedDate={selectedDate}
								onDateChange={(date) => setSelectedDate(date)}
							/>
						</div>
					</div>
				)}
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Spinner size="lg" label="Cargando estadísticas..." />
				</div>
			) : (
				<>
					{/* Contenido de Estadísticas */}
					{mainTab === 'stats' && (
						<div className="space-y-6">
							{/* Métricas principales */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<StatsCard
									title="Sesiones Impartidas"
									value={87}
									icon={<Calendar className="w-6 h-6" />}
									color="primary"
									trend={{ value: '5%', isPositive: true }}
								/>
								<StatsCard
									title="Estudiantes Ayudados"
									value={156}
									icon={<Users className="w-6 h-6" />}
									color="success"
									trend={{ value: '12%', isPositive: true }}
								/>
								<StatsCard
									title="Calificación Promedio"
									value="4.8"
									icon={<TrendingUp className="w-6 h-6" />}
									color="warning"
									trend={{ value: '0.2', isPositive: true }}
								/>
								<StatsCard
									title="Horas Totales"
									value={134}
									icon={<Clock className="w-6 h-6" />}
									color="secondary"
									trend={{ value: '8%', isPositive: true }}
								/>
							</div>
							{/* Sección de Gráficos y Análisis */}
							{/* Gráfico de barras - Tutorías por materia */}
							<BarChart
								title="Tus Tutorías por Materia"
								data={subjectData.map((d) => ({
									label: d.subject,
									value: d.sessions,
									maxValue: 360,
								}))}
								detailsLink="#"
								color="#990000"
							/>
							{/* Gráfico de pastel - Distribución de Actividad */}
							<PieChart
								title="Distribución de Actividad"
								data={[
									{
										label: 'Tutorías',
										color: '#990000',
										percentage: 45,
									},
									{
										label: 'Eventos',
										color: '#f59e0b',
										percentage: 28,
									},
									{
										label: 'Materiales',
										color: '#10b981',
										percentage: 27,
									},
								]}
								size={200}
							/>
							{/* Gráfico de líneas - Tu desempeño en el tiempo */}
							<LineChart
								title="Tu Desempeño en el Tiempo"
								data={
									chartType === 'sessions'
										? [
												{ month: 'Jun', value: 18 },
												{ month: 'Jul', value: 21 },
												{ month: 'Ago', value: 19 },
												{ month: 'Sep', value: 24 },
												{ month: 'Oct', value: 28 },
											]
										: [
												{ month: 'Jun', value: 4.5 },
												{ month: 'Jul', value: 4.8 },
												{ month: 'Ago', value: 4.6 },
												{ month: 'Sep', value: 4.7 },
												{ month: 'Oct', value: 4.9 },
											]
								}
								tabs={[
									{ label: 'Sesiones', value: 'sessions' },
									{ label: 'Calificación', value: 'ratings' },
								]}
								activeTab={chartType}
								onTabChange={(tab: string) =>
									setChartType(tab as 'sessions' | 'ratings')
								}
								color="#990000"
							/>{' '}
							{/* Tabla de detalles por materia */}
							<SubjectDetailTable
								title="Detalle por Materia"
								data={[
									{
										subject: 'Matemáticas',
										sessions: 342,
										totalHours: '456h',
										averageDuration: '1.3h/sesión',
									},
									{
										subject: 'Programación',
										sessions: 298,
										totalHours: '421h',
										averageDuration: '1.4h/sesión',
									},
									{
										subject: 'Física',
										sessions: 201,
										totalHours: '287h',
										averageDuration: '1.4h/sesión',
									},
									{
										subject: 'Química',
										sessions: 156,
										totalHours: '198h',
										averageDuration: '1.3h/sesión',
									},
									{
										subject: 'Inglés',
										sessions: 123,
										totalHours: '165h',
										averageDuration: '1.3h/sesión',
									},
								]}
							/>
							{/* Métricas de rendimiento */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Rendimiento Semanal */}
								<Card>
									<CardHeader className="flex flex-col items-start px-6 py-5">
										<h3 className="text-lg font-semibold text-foreground">
											Rendimiento Semanal
										</h3>
									</CardHeader>
									<CardBody className="px-6 py-5 space-y-3">
										<div className="flex justify-between">
											<span className="text-default-600">
												Promedio de sesiones
											</span>
											<span className="font-bold text-primary">6.2</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">
												Duración promedio
											</span>
											<span className="font-bold text-primary">95 min</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">
												Modalidad más usada
											</span>
											<span className="font-bold text-default-700">
												Virtual (60%)
											</span>
										</div>
									</CardBody>
								</Card>

								{/* Feedback Recibido */}
								<Card>
									<CardHeader className="flex flex-col items-start px-6 py-5">
										<h3 className="text-lg font-semibold text-foreground">
											Feedback Recibido
										</h3>
									</CardHeader>
									<CardBody className="px-6 py-5 space-y-3">
										<div className="flex justify-between">
											<span className="text-default-600">
												Evaluaciones recibidas
											</span>
											<span className="font-bold text-primary">
												{ratedSessions.length} / {completedSessions.length}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">
												Comentarios positivos
											</span>
											<span className="font-bold text-success">95%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">
												Tasa de respuesta
											</span>
											<span className="font-bold text-warning">
												{ratedSessions.length > 0
													? Math.round(
															(ratedSessions.filter((s) => s.hasResponse)
																.length /
																ratedSessions.length) *
																100,
														)
													: 0}
												%
											</span>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>
					)}

					{/* Contenido de Historial y Evaluaciones */}
					{mainTab === 'history' && (
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
												ratedSessions.filter((s) => !s.hasResponse && s.comment)
													.length
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
																	{new Date(session.date).toLocaleDateString()}
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
				</>
			)}

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
