import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/react';
import { Calendar, Clock, MapPin, Search, Video } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { PageHeader } from '~/components/page-header';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';

interface Tutor {
	id: number;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor?: string;
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
}

interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

interface StudentSession {
	id: string;
	tutorId: string;
	studentId: string;
	tutorName: string;
	avatarInitials?: string;
	avatarColor?: string;
	codigoMateria: string;
	subject: string;
	topic: string;
	scheduledAt: string;
	day: string;
	startTime: string;
	endTime: string;
	mode: 'VIRTUAL' | 'PRESENCIAL';
	comentarios?: string;
	location?: string;
	modality?: 'presencial' | 'virtual';
	date?: string;
	time?: string;
	duration?: number;
	status: 'confirmada' | 'pendiente' | 'cancelada';
}

const getAvatarBg = (avatarColor?: string): string => {
	const colorMap: Record<string, string> = {
		'#b81d24': 'bg-red-500',
		'#ff9900': 'bg-orange-500',
		'#8a2be2': 'bg-purple-500',
		'#008000': 'bg-green-500',
	};

	return colorMap[avatarColor ?? ''] || 'bg-red-500';
};

const getInitials = (name: string, fallback?: string): string => {
	if (fallback) return fallback;
	const parts = name.split(' ').filter(Boolean);
	const first = parts[0]?.[0] ?? '';
	const last = parts.at(-1)?.[0] ?? '';
	const initials = `${first}${last || parts[0]?.[1] || ''}`.toUpperCase();
	return initials || 'T';
};

const getModeLabel = (
	mode: StudentSession['mode'],
): 'presencial' | 'virtual' =>
	mode === 'PRESENCIAL' ? 'presencial' : 'virtual';

const getDayLabel = (day: string): string => {
	const days: Record<string, string> = {
		monday: 'Lunes',
		tuesday: 'Martes',
		wednesday: 'Miercoles',
		thursday: 'Jueves',
		friday: 'Viernes',
		saturday: 'Sabado',
		sunday: 'Domingo',
	};

	return days[day.toLowerCase()] ?? day;
};

const getDurationMinutes = (start: string, end: string): number => {
	const toMinutes = (time: string) => {
		const [h, m] = time.split(':').map(Number);
		return h * 60 + m;
	};
	return Math.max(toMinutes(end) - toMinutes(start), 0);
};

const getStatusChipColor = (
	status: StudentSession['status'],
): 'success' | 'warning' | 'danger' => {
	if (status === 'confirmada') return 'success';
	if (status === 'pendiente') return 'warning';
	return 'danger';
};

// Nota: por ahora se usan datos mock, pendientes de conectar al backend
const mockTutors: Tutor[] = [
	{
		id: 1,
		name: 'Dr. Maria Garcia',
		title: 'Profesora de Matematicas',
		department: 'Ciencias Exactas',
		avatarInitials: 'MG',
		avatarColor: '#b81d24',
		rating: 4.9,
		reviews: 127,
		tags: ['Calculo', 'Algebra', 'Geometria'],
		availability: 'Lun-Vie 9:00-17:00',
		isAvailableToday: true,
	},
	{
		id: 2,
		name: 'Ing. Carlos Rodriguez',
		title: 'Tutor de Programacion',
		department: 'Ingenieria',
		avatarInitials: 'CR',
		avatarColor: '#008000',
		rating: 4.8,
		reviews: 89,
		tags: ['React', 'TypeScript', 'Node.js'],
		availability: 'Mar-Sab 14:00-20:00',
		isAvailableToday: false,
	},
];

// Nota: por ahora se usan sesiones mock, pendientes de conectar al backend
const mockSessions: StudentSession[] = [
	{
		id: '101',
		tutorId: '550e8400-e29b-41d4-a716-446655440000',
		studentId: '660e8400-e29b-41d4-a716-446655440001',
		tutorName: 'Dra. Paula Reyes',
		avatarInitials: 'PR',
		avatarColor: '#8a2be2',
		codigoMateria: 'DOSW',
		subject: 'Desarrollo de Software',
		topic: 'Proyecto final y entregables',
		scheduledAt: '2025-12-25T14:00:00.000Z',
		day: 'monday',
		startTime: '14:00',
		endTime: '16:00',
		mode: 'VIRTUAL',
		comentarios: 'Necesito ayuda con el proyecto final de la materia',
		status: 'pendiente',
	},
	{
		id: '103',
		tutorId: '550e8400-e29b-41d4-a716-446655440003',
		studentId: '660e8400-e29b-41d4-a716-446655440001',
		tutorName: 'Lic. Ana Valdez',
		avatarInitials: 'AV',
		avatarColor: '#008000',
		codigoMateria: 'REDAC',
		subject: 'Redaccion Academica',
		topic: 'Estructura de articulos de investigacion',
		scheduledAt: '2026-05-09T19:15:00.000Z',
		day: 'saturday',
		startTime: '19:15',
		endTime: '19:50',
		mode: 'VIRTUAL',
		comentarios: 'Practicar introduccion y conclusiones',
		status: 'cancelada',
	},
	{
		id: '102',
		tutorId: '550e8400-e29b-41d4-a716-446655440002',
		studentId: '660e8400-e29b-41d4-a716-446655440001',
		tutorName: 'Mtro. Daniel Perez',
		avatarInitials: 'DP',
		avatarColor: '#ff9900',
		codigoMateria: 'FIS2',
		subject: 'Fisica II',
		topic: 'Circuitos RLC y resonancia',
		scheduledAt: '2026-09-07T16:15:00.000Z',
		day: 'monday',
		startTime: '16:15',
		endTime: '17:05',
		mode: 'PRESENCIAL',
		location: 'Aula 204 - Ciencias',
		comentarios: 'Revisar ejercicios del laboratorio previo',
		status: 'confirmada',
	},
];

const StudentTutoringPage: React.FC = () => {
	const [tutors] = useState<Tutor[]>(mockTutors);
	// Nota: en el futuro, inicializar tutors con datos del backend
	const [searchValue, setSearchValue] = useState('');
	const [activeTab, setActiveTab] = useState<'search' | 'my-sessions'>(
		'search',
	);
	const [sessions, setSessions] = useState<StudentSession[]>(mockSessions);
	// Nota: en el futuro, inicializar sessions con datos del backend
	const [selectedSession, setSelectedSession] = useState<StudentSession | null>(
		null,
	);
	const [sessionToCancel, setSessionToCancel] = useState<StudentSession | null>(
		null,
	);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		isOpen: isConfirmOpen,
		onOpen: onOpenConfirm,
		onClose: onCloseConfirm,
	} = useDisclosure();

	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	const getFutureSessionsSortedByProximity = (list: StudentSession[]) => {
		const now = Date.now();

		return [...list]
			.filter((session) => new Date(session.scheduledAt).getTime() >= now)
			.sort((a, b) => {
				const timeA = new Date(a.scheduledAt).getTime();
				const timeB = new Date(b.scheduledAt).getTime();

				const diffA = Math.abs(timeA - now);
				const diffB = Math.abs(timeB - now);

				return diffA - diffB;
			});
	};

	const futureSessions = getFutureSessionsSortedByProximity(sessions);

	const handleSearch = (_filters: TutorFilters) => {
		// Pendiente: conectar filtros con backend
	};

	const handleCancelSession = (id: string) => {
		// Pendiente: llamar al backend para cancelar la tutoría
		setSessions((prev) =>
			prev.map((s) => (s.id === id ? { ...s, status: 'cancelada' } : s)),
		);
	};

	const openSessionDetails = (session: StudentSession) => {
		setSelectedSession(session);
		onOpen();
	};

	const closeSessionDetails = () => {
		setSelectedSession(null);
		onClose();
	};

	return (
		<div className="space-y-6 p-4 md:p-6">
			<PageHeader title="Tutorias" description="Panel de Estudiante" />

			<div className="flex gap-2">
				<Button
					variant={activeTab === 'search' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('search')}
				>
					Agendar tutoria
				</Button>
				<Button
					variant={activeTab === 'my-sessions' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('my-sessions')}
				>
					Mis tutorias
				</Button>
			</div>

			{activeTab === 'search' && (
				<>
					<Card>
						<CardBody className="p-4">
							<div className="mb-4">
								<Input
									type="text"
									placeholder="Buscar por nombre, materia o tema..."
									value={searchValue}
									onValueChange={setSearchValue}
									startContent={<Search className="w-5 h-5 text-default-400" />}
									isClearable
									onClear={() => setSearchValue('')}
									variant="bordered"
									fullWidth
								/>
							</div>
							<TutorFilter onApplyFilters={handleSearch} />
						</CardBody>
					</Card>

					<div className="flex justify-between items-center pt-2 border-t border-default-200">
						<p className="text-default-600">
							{tutors.length} tutores encontrados
						</p>
						<Button
							variant="light"
							color="danger"
							startContent={<Calendar className="w-5 h-5" />}
						>
							Ver calendario
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{tutors.map((tutor) => (
							<TutorCard key={tutor.id} tutor={tutor} onOpenChat={onOpenChat} />
						))}
					</div>
				</>
			)}

			{activeTab === 'my-sessions' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Sesiones programadas</h2>
					</div>

					{futureSessions.length === 0 ? (
						<Card>
							<CardBody className="text-center py-12">
								<Calendar className="w-12 h-12 text-default-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No tienes tutorias programadas
								</h3>
								<p className="text-default-500 mb-4">
									Cuando confirmes una tutoria aparecera aqui.
								</p>
								<Button color="primary" onPress={() => setActiveTab('search')}>
									Agendar tutoria
								</Button>
							</CardBody>
						</Card>
					) : (
						<div className="grid gap-4">
							{futureSessions.map((session) => {
								const modalityLabel =
									session.modality ?? getModeLabel(session.mode);
								const sessionDate =
									session.date ??
									new Date(session.scheduledAt).toLocaleDateString();
								const sessionDuration =
									session.duration ??
									getDurationMinutes(session.startTime, session.endTime);
								const sessionTime =
									session.time ?? `${session.startTime} - ${session.endTime}`;

								return (
									<Card key={session.id}>
										<CardBody>
											<div className="flex items-start justify-between">
												<div className="space-y-2">
													<div className="flex items-center gap-3">
														<div
															className={`${getAvatarBg(
																session.avatarColor,
															)} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}
														>
															{getInitials(
																session.tutorName,
																session.avatarInitials,
															)}
														</div>
														<div>
															<h3 className="font-semibold">
																{session.tutorName}
															</h3>
															<div className="flex gap-2 mt-1">
																<Chip size="sm" color="primary" variant="flat">
																	{session.subject}
																</Chip>
																<Chip
																	size="sm"
																	color={getStatusChipColor(session.status)}
																	variant="flat"
																>
																	{session.status}
																</Chip>
															</div>
														</div>
													</div>
													<p className="text-default-600 ml-11">
														{session.topic}
													</p>
													<div className="flex flex-wrap gap-4 text-sm text-default-500 ml-11">
														<div className="flex items-center gap-1">
															<Calendar className="w-4 h-4" />
															{sessionDate}
														</div>
														<div className="flex items-center gap-1">
															<Clock className="w-4 h-4" />
															{sessionTime} ({sessionDuration} min)
														</div>
														<div className="flex items-center gap-1">
															{modalityLabel === 'virtual' ? (
																<Video className="w-4 h-4" />
															) : (
																<MapPin className="w-4 h-4" />
															)}
															<span className="capitalize">
																{modalityLabel}
															</span>
															{session.location && (
																<span> - {session.location}</span>
															)}
														</div>
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														size="sm"
														color="primary"
														variant="flat"
														onPress={() => openSessionDetails(session)}
													>
														Ver detalles
													</Button>
													<Button
														size="sm"
														variant="light"
														color="danger"
														isDisabled={session.status === 'cancelada'}
														onPress={() => {
															setSessionToCancel(session);
															onOpenConfirm();
														}}
													>
														{session.status === 'cancelada'
															? 'Cancelada'
															: 'Cancelar'}
													</Button>
												</div>
											</div>
										</CardBody>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			)}

			{/* Modal de detalle de tutoría */}
			<Modal
				isOpen={isOpen}
				onOpenChange={(open) => {
					if (!open) closeSessionDetails();
				}}
				size="lg"
			>
				<ModalContent>
					{(onCloseModal) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span>Detalle de tutoría</span>
								{selectedSession && (
									<span className="text-sm text-default-500">
										{selectedSession.subject} · {selectedSession.codigoMateria}
									</span>
								)}
							</ModalHeader>
							<ModalBody className="space-y-4">
								{selectedSession && (
									<>
										<div className="flex items-center gap-3">
											<div
												className={`${getAvatarBg(
													selectedSession.avatarColor,
												)} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}
											>
												{getInitials(
													selectedSession.tutorName,
													selectedSession.avatarInitials,
												)}
											</div>
											<div>
												<h3 className="font-semibold text-base">
													{selectedSession.tutorName}
												</h3>
												<div className="flex gap-2 mt-1 flex-wrap">
													<Chip size="sm" color="primary" variant="flat">
														{selectedSession.subject}
													</Chip>
													<Chip
														size="sm"
														variant="flat"
														color={getStatusChipColor(selectedSession.status)}
													>
														{selectedSession.status}
													</Chip>
												</div>
												<p className="text-sm text-default-500 mt-1">
													Código: {selectedSession.codigoMateria}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-default-600">
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4" />
												<span>
													{new Date(
														selectedSession.scheduledAt,
													).toLocaleDateString()}{' '}
													({getDayLabel(selectedSession.day)})
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4" />
												<span>
													{selectedSession.startTime} -{' '}
													{selectedSession.endTime} (
													{getDurationMinutes(
														selectedSession.startTime,
														selectedSession.endTime,
													)}{' '}
													min)
												</span>
											</div>
											<div className="flex items-center gap-2">
												{getModeLabel(selectedSession.mode) === 'virtual' ? (
													<Video className="w-4 h-4" />
												) : (
													<MapPin className="w-4 h-4" />
												)}
												<span className="capitalize">
													{getModeLabel(selectedSession.mode)}
												</span>
												{selectedSession.location && (
													<span>- {selectedSession.location}</span>
												)}
											</div>
											<div className="flex items-center gap-2">
												<span className="font-semibold text-default-700">
													Tutor ID:
												</span>
												<span className="font-mono text-xs text-default-500">
													{selectedSession.tutorId}
												</span>
											</div>
										</div>

										<div className="rounded-medium border border-default-200 bg-default-50 p-3 text-sm text-default-600">
											<p className="font-semibold text-default-700 mb-1">
												Comentarios
											</p>
											<p>
												{selectedSession.comentarios ||
													'Sin comentarios adicionales.'}
											</p>
										</div>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onCloseModal}>
									Cerrar
								</Button>
								{selectedSession && (
									<Button
										color="danger"
										variant="flat"
										isDisabled={selectedSession.status === 'cancelada'}
										onPress={() => {
											setSessionToCancel(selectedSession);
											onOpenConfirm();
										}}
									>
										{selectedSession.status === 'cancelada'
											? 'Cancelada'
											: 'Cancelar tutoría'}
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de confirmación de cancelación */}
			<Modal
				isOpen={isConfirmOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSessionToCancel(null);
						onCloseConfirm();
					}
				}}
				size="md"
			>
				<ModalContent>
					{(onCloseConfirmModal) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Confirmar cancelación
							</ModalHeader>
							<ModalBody>
								<p className="text-default-600">
									¿Estás seguro de que deseas cancelar esta tutoría
									{sessionToCancel && (
										<>
											{' con '}
											<span className="font-semibold">
												{sessionToCancel.tutorName}
											</span>
											{' el '}
											{new Date(
												sessionToCancel.scheduledAt,
											).toLocaleDateString()}
											?
										</>
									)}
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={() => {
										setSessionToCancel(null);
										onCloseConfirmModal();
									}}
								>
									Mantener tutoría
								</Button>
								<Button
									color="danger"
									variant="solid"
									onPress={() => {
										if (sessionToCancel) {
											handleCancelSession(sessionToCancel.id);
										}
										setSessionToCancel(null);
										onCloseConfirmModal();
									}}
								>
									Cancelar tutoría
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

export default StudentTutoringPage;
