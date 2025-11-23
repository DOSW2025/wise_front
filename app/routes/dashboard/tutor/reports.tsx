import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spinner,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	Award,
	BarChart3,
	Calendar,
	Clock,
	MessageSquare,
	Star,
	TrendingUp,
	User,
	Users,
} from 'lucide-react';
import { useState } from 'react';

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
	const [_chartType, _setChartType] = useState<'sessions' | 'ratings'>(
		'sessions',
	);

	const [period, setPeriod] = useState<string>('last-month');
	const [customDateStart, setCustomDateStart] = useState('');
	const [customDateEnd, setCustomDateEnd] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handlePeriodChange = (keys: any) => {
		const newPeriod = Array.from(keys)[0] as string;
		setPeriod(newPeriod);
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	const handleCustomFilter = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const _monthlyData: { month: string; sessions: number; rating: number }[] = [
		{ month: 'Ejemplo', sessions: -1, rating: -1 },
	];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const subjectData: {
		subject: string;
		sessions: number;
		percentage: number;
	}[] = [{ subject: 'Sin datos de API', sessions: -1, percentage: -1 }];

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const modalityData: { type: string; sessions: number; percentage: number }[] =
		[{ type: 'Sin conexión', sessions: -1, percentage: -1 }];

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
						Reportes y Estadísticas
					</h1>
					<p className="text-default-500">
						Analiza tu desempeño, historial y evaluaciones recibidas.
					</p>
				</div>

				{/* Tabs principales */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex gap-2">
						<Button
							variant={mainTab === 'stats' ? 'solid' : 'light'}
							color="primary"
							onPress={() => setMainTab('stats')}
						>
							Estadísticas y Gráficos
						</Button>
						<Button
							variant={mainTab === 'history' ? 'solid' : 'light'}
							color="primary"
							onPress={() => setMainTab('history')}
						>
							Historial y Evaluaciones
						</Button>
					</div>

					<div className="flex flex-wrap gap-2 items-center bg-default-50 p-2 rounded-lg">
						<Select
							label="Periodo"
							className="w-40"
							size="sm"
							selectedKeys={[period]}
							onSelectionChange={handlePeriodChange}
						>
							<SelectItem key="last-week">Última semana</SelectItem>
							<SelectItem key="last-month">Último mes</SelectItem>
							<SelectItem key="semester">Semestre actual</SelectItem>
							<SelectItem key="year">Año actual</SelectItem>
							<SelectItem key="custom">Personalizado</SelectItem>
						</Select>

						{period === 'custom' && (
							<div className="flex gap-2 items-center">
								<Input
									type="date"
									label="Desde"
									size="sm"
									value={customDateStart}
									onValueChange={setCustomDateStart}
									className="w-32"
								/>
								<Input
									type="date"
									label="Hasta"
									size="sm"
									value={customDateEnd}
									onValueChange={setCustomDateEnd}
									className="w-32"
								/>
								<Button
									isIconOnly
									size="sm"
									color="primary"
									variant="flat"
									onPress={handleCustomFilter}
								>
									<TrendingUp className="w-4 h-4" />
								</Button>
							</div>
						)}
					</div>
				</div>
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
										<div className="text-sm text-default-500">
											Horas Totales
										</div>
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
													// Usando colores semánticos del tema: success y info (definidos en brand theme)
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
												// Clases Tailwind para colores semánticos
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
										<h3 className="text-lg font-semibold">
											Rendimiento Semanal
										</h3>
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
