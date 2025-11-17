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
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { Calendar, Clock, MessageSquare, Star, User } from 'lucide-react';
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
	const [activeTab, setActiveTab] = useState<'history' | 'ratings'>('history');

	const [completedSessions, setCompletedSessions] = useState<
		CompletedSession[]
	>([
		{
			id: '1',
			studentName: 'Ana García',
			subject: 'Cálculo I',
			topic: 'Límites y continuidad',
			date: '2024-01-10',
			time: '14:00',
			duration: 120,
			modality: 'virtual',
			status: 'completed',
			rating: 5,
			comment:
				'Excelente tutor, muy claro en sus explicaciones y paciente. Me ayudó mucho a entender los conceptos.',
			hasResponse: false,
		},
		{
			id: '2',
			studentName: 'Carlos Rodríguez',
			subject: 'Álgebra Lineal',
			topic: 'Matrices y determinantes',
			date: '2024-01-08',
			time: '10:00',
			duration: 90,
			modality: 'presencial',
			location: 'Aula 205',
			status: 'completed',
			rating: 4,
			comment: 'Muy buena sesión, aunque me gustaría más ejemplos prácticos.',
			hasResponse: true,
			responseText:
				'Gracias por tu feedback. En la próxima sesión incluiré más ejercicios prácticos.',
		},
		{
			id: '3',
			studentName: 'María López',
			subject: 'Física I',
			topic: 'Cinemática',
			date: '2024-01-05',
			time: '16:00',
			duration: 60,
			modality: 'virtual',
			status: 'completed',
			rating: 5,
			comment:
				'Perfecto, resolvió todas mis dudas sobre movimiento rectilíneo.',
			hasResponse: false,
		},
		{
			id: '4',
			studentName: 'Pedro Ramírez',
			subject: 'Cálculo I',
			topic: 'Derivadas',
			date: '2024-01-03',
			time: '09:00',
			duration: 90,
			modality: 'presencial',
			location: 'Aula 101',
			status: 'completed',
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

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Historial y Evaluaciones
					</h1>
					<p className="text-default-500">
						Revisa tu historial de tutorías y gestiona las evaluaciones
						recibidas.
					</p>
				</div>

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
							<div className="text-sm text-default-500">Sin Responder</div>
						</CardBody>
					</Card>
				</div>

				{/* Tabs */}
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
			</div>

			{/* Historial de Tutorías */}
			{activeTab === 'history' && (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Tutorías Completadas</h2>
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
												<h3 className="font-semibold">{session.studentName}</h3>
												<div className="flex items-center gap-2">
													<Chip size="sm" color="primary" variant="flat">
														{session.subject}
													</Chip>
													<span className="text-sm text-default-600">
														{session.topic}
													</span>
												</div>
												<div className="flex items-center gap-4 text-sm text-default-500">
													<div className="flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														{new Date(session.date).toLocaleDateString()}
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{session.time} ({session.duration}min)
													</div>
													<span className="capitalize">{session.modality}</span>
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
					<h2 className="text-xl font-semibold">Evaluaciones Recibidas</h2>
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
												<h3 className="font-semibold">{session.studentName}</h3>
												<p className="text-sm text-default-500">
													{session.subject} -{' '}
													{new Date(session.date).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{renderStars(session.rating || 0)}
											<span className="font-medium">{session.rating}/5</span>
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
													<p className="text-sm">{session.responseText}</p>
												</div>
											) : (
												<Button
													size="sm"
													color="primary"
													variant="flat"
													startContent={<MessageSquare className="w-4 h-4" />}
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
