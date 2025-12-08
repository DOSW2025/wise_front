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
import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import { PageHeader } from '~/components/page-header';
import ScheduledTutoringsModal, {
	type ScheduledTutoring,
} from '~/components/scheduled-tutorings-modal';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';
import TutorScheduleModal from '~/components/tutor-schedule-modal';
import { useAuth } from '~/contexts/auth-context';
import { useStudentSessions } from '~/lib/hooks/useStudentSessions';
import { useTutores } from '~/lib/hooks/useTutores';
import type {
	StudentSession as BackendStudentSession,
	TutorProfile,
} from '~/lib/types/tutoria.types';

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
	timeSlots?: string[];
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

const getInitials = (name: string | undefined, fallback?: string): string => {
	if (fallback) return fallback;
	if (!name) return 'T';
	const parts = name.split(' ').filter(Boolean);
	const first = parts[0]?.[0] ?? '';
	const last = parts.slice(-1)[0]?.[0] ?? '';
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

const getStatusChipColor = (status: StudentSession['status']) => {
	if (status === 'confirmada') return 'success';
	if (status === 'pendiente') return 'warning';
	return 'danger';
};

type SessionModalityLabel = 'presencial' | 'virtual';

type SessionStatusColor = 'success' | 'warning' | 'danger';

interface SessionViewModel extends StudentSession {
	modalityLabel: SessionModalityLabel;
	dateLabel: string;
	durationMinutes: number;
	timeLabel: string;
	statusColor: SessionStatusColor;
	initials: string;
	avatarBg: string;
	dayLabel: string;
}

const buildSessionViewModel = (session: StudentSession): SessionViewModel => {
	const modalityLabel = session.modality ?? getModeLabel(session.mode);
	const dateLabel =
		session.date ?? new Date(session.scheduledAt).toLocaleDateString();
	const durationMinutes =
		session.duration ?? getDurationMinutes(session.startTime, session.endTime);
	const timeLabel = session.time ?? `${session.startTime} - ${session.endTime}`;
	const statusColor = getStatusChipColor(session.status);
	const initials = getInitials(session.tutorName, session.avatarInitials);
	const avatarBg = getAvatarBg(session.avatarColor);
	const dayLabel = getDayLabel(session.day);

	return {
		...session,
		modalityLabel,
		dateLabel,
		durationMinutes,
		timeLabel,
		statusColor,
		initials,
		avatarBg,
		dayLabel,
	};
};

const SessionHeader: React.FC<{
	session: SessionViewModel;
	avatarSize?: 'sm' | 'lg';
	subtitle?: React.ReactNode;
	actionArea?: React.ReactNode;
	showTopic?: boolean;
}> = ({
	session,
	avatarSize = 'sm',
	subtitle,
	actionArea,
	showTopic = true,
}) => {
	const sizeClass = avatarSize === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

	return (
		<div className="flex items-start justify-between ">
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<div
						className={`${session.avatarBg} ${sizeClass} rounded-full flex items-center justify-center text-white font-semibold`}
					>
						{session.initials}
					</div>
					<div>
						<h3 className="font-semibold">{session.tutorName}</h3>
						<div className="flex gap-2 mt-1 flex-wrap">
							<Chip size="sm" color="primary" variant="flat">
								{session.subject}
							</Chip>
							<Chip size="sm" color={session.statusColor} variant="flat">
								{session.status}
							</Chip>
						</div>
						{subtitle && (
							<p className="text-sm text-default-700 mt-1">{subtitle}</p>
						)}
					</div>
				</div>
				{showTopic && <p className="text-default-600 ml-11">{session.topic}</p>}
			</div>
			{actionArea}
		</div>
	);
};

const SessionMeta: React.FC<{
	session: SessionViewModel;
	includeDay?: boolean;
	className?: string;
}> = ({ session, includeDay = false, className }) => (
	<div
		className={`flex flex-wrap gap-4 text-sm text-default-700 ${className ?? ''}`}
	>
		<div className="flex items-center gap-1">
			<Calendar className="w-4 h-4" />
			{includeDay
				? `${session.dateLabel} (${session.dayLabel})`
				: session.dateLabel}
		</div>
		<div className="flex items-center gap-1">
			<Clock className="w-4 h-4" />
			{session.timeLabel} ({session.durationMinutes} min)
		</div>
		<div className="flex items-center gap-1">
			{session.modalityLabel === 'virtual' ? (
				<Video className="w-4 h-4" />
			) : (
				<MapPin className="w-4 h-4" />
			)}
			<span className="capitalize">{session.modalityLabel}</span>
			{session.location && (
				<>
					<span> - </span>
					{session.modalityLabel === 'virtual' &&
					session.location.startsWith('http') ? (
						<a
							href={session.location}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							{session.location}
						</a>
					) : (
						<span>{session.location}</span>
					)}
				</>
			)}
		</div>
	</div>
);

const SessionCardItem: React.FC<{
	session: StudentSession;
	onViewDetails: (session: StudentSession) => void;
	onCancel: (session: StudentSession) => void;
}> = ({ session, onViewDetails, onCancel }) => {
	const [tutorName, setTutorName] = React.useState<string>('Cargando...');
	const view = buildSessionViewModel(session);

	React.useEffect(() => {
		const fetchTutorName = async () => {
			try {
				const { getTutorName } = await import('~/lib/services/tutoria.service');
				const name = await getTutorName(session.tutorId);
				setTutorName(name);
			} catch (error) {
				console.error('Error fetching tutor name:', error);
				setTutorName('Tutor no disponible');
			}
		};

		fetchTutorName();
	}, [session.tutorId]);

	// Actualizar el tutorName en la vista
	const viewWithTutorName = { ...view, tutorName };

	return (
		<Card>
			<CardBody>
				<SessionHeader
					session={viewWithTutorName}
					actionArea={
						<div className="flex gap-2">
							<Button
								size="sm"
								color="primary"
								variant="flat"
								onPress={() => onViewDetails(session)}
							>
								Ver detalles
							</Button>
							<Button
								size="sm"
								variant="light"
								color="danger"
								isDisabled={view.status === 'cancelada'}
								onPress={() => onCancel(session)}
							>
								{view.status === 'cancelada' ? 'Cancelada' : 'Cancelar'}
							</Button>
						</div>
					}
				/>
				<SessionMeta session={view} className="ml-11 mt-2" />
			</CardBody>
		</Card>
	);
};

const SessionDetailsModal: React.FC<{
	session: StudentSession | null;
	isOpen: boolean;
	onClose: () => void;
	onRequestCancel: (session: StudentSession) => void;
}> = ({ session, isOpen, onClose, onRequestCancel }) => {
	const [tutorName, setTutorName] = React.useState<string>('Cargando...');
	const [materiaName, setMateriaName] = React.useState<string>('');

	React.useEffect(() => {
		if (!session) return;

		const fetchData = async () => {
			const { getTutorName, getMateria } = await import(
				'~/lib/services/tutoria.service'
			);

			try {
				const name = await getTutorName(session.tutorId);
				setTutorName(name);
			} catch (error) {
				console.error('Error fetching tutor name:', error);
				setTutorName('Tutor no disponible');
			}

			try {
				const materia = await getMateria(session.codigoMateria);
				setMateriaName(materia ? materia.nombre : session.codigoMateria);
			} catch (error) {
				console.error('Error fetching materia:', error);
				setMateriaName(session.codigoMateria);
			}
		};

		fetchData();
	}, [session]);

	const sessionWithUpdatedData = session
		? { ...session, tutorName, subject: materiaName || session.subject }
		: null;
	const view = sessionWithUpdatedData
		? buildSessionViewModel(sessionWithUpdatedData)
		: null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
			size="lg"
		>
			<ModalContent>
				{(onCloseModal) => {
					const handleClose = () => {
						onClose();
						onCloseModal();
					};

					return (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span>Detalle de tutoria</span>
								{view && (
									<span className="text-sm text-default-500">
										{view.subject} - {view.codigoMateria}
									</span>
								)}
							</ModalHeader>
							<ModalBody className="space-y-4">
								{view && (
									<>
										<SessionHeader
											session={view}
											avatarSize="lg"
											subtitle={`Codigo: ${view.codigoMateria}`}
											showTopic={false}
										/>

										<SessionMeta session={view} includeDay className="ml-11" />

										<div className="rounded-medium border border-default-200 bg-default-50 p-3 text-sm text-default-600">
											<p className="font-semibold text-default-700 mb-1">
												Comentarios
											</p>
											<p>
												{view.comentarios || 'Sin comentarios adicionales.'}
											</p>
										</div>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={handleClose}>
									Cerrar
								</Button>
								{session && (
									<Button
										color="danger"
										variant="flat"
										isDisabled={session.status === 'cancelada'}
										onPress={() => onRequestCancel(session)}
									>
										{session.status === 'cancelada'
											? 'Cancelada'
											: 'Cancelar tutoria'}
									</Button>
								)}
							</ModalFooter>
						</>
					);
				}}
			</ModalContent>
		</Modal>
	);
};

const CancelSessionModal: React.FC<{
	session: StudentSession | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (session: StudentSession) => void;
}> = ({ session, isOpen, onClose, onConfirm }) => {
	const view = session ? buildSessionViewModel(session) : null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
			size="md"
		>
			<ModalContent>
				{(onCloseConfirmModal) => {
					const handleClose = () => {
						onClose();
						onCloseConfirmModal();
					};

					return (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Confirmar cancelacion
							</ModalHeader>
							<ModalBody>
								<p className="text-default-600">
									?Estas seguro de que deseas cancelar esta tutoria
									{view && (
										<>
											{' con '}
											<span className="font-semibold">{view.tutorName}</span>
											{' el '}
											{view.dateLabel}?
										</>
									)}
								</p>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={handleClose}>
									Mantener tutoria
								</Button>
								<Button
									color="danger"
									variant="solid"
									onPress={() => {
										if (session) {
											onConfirm(session);
										}
										handleClose();
									}}
								>
									Cancelar tutoria
								</Button>
							</ModalFooter>
						</>
					);
				}}
			</ModalContent>
		</Modal>
	);
};

/**
 * Transforma una sesión del backend al formato StudentSession del componente
 */
const transformBackendSessionToComponentSession = (
	backendSession: BackendStudentSession,
): StudentSession => {
	// Mapear el status del backend al formato del componente
	const statusMap: Record<string, StudentSession['status']> = {
		PENDIENTE: 'pendiente',
		CONFIRMADA: 'confirmada',
		CANCELADA: 'cancelada',
		COMPLETADA: 'confirmada',
	};

	return {
		id: backendSession.id,
		tutorId: backendSession.tutorId,
		studentId: backendSession.studentId,
		tutorName: '', // Se llenará con datos del tutor si es necesario
		codigoMateria: backendSession.codigoMateria,
		subject: backendSession.codigoMateria, // Usar código como subject por defecto
		topic: backendSession.comentarios || 'Sin tema especificado',
		scheduledAt: backendSession.scheduledAt,
		day: backendSession.day,
		startTime: backendSession.startTime,
		endTime: backendSession.endTime,
		mode: backendSession.mode,
		status: statusMap[backendSession.status] || 'pendiente',
		location: backendSession.lugar || backendSession.linkConexion || undefined,
		comentarios: backendSession.comentarios || undefined,
	};
};

/**
 * Transforma un TutorProfile del backend al formato Tutor del componente
 */
const transformTutorProfileToTutor = (profile: TutorProfile): Tutor => {
	// Validar que disponibilidad exista
	const disponibilidad = profile.disponibilidad || {
		monday: [],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: [],
	};

	// Obtener los slots de disponibilidad de todos los días con tipado explícito
	const allSlots = Object.entries(disponibilidad).flatMap(([day, slots]) =>
		slots.map(
			(slot: {
				start: string;
				end: string;
				modalidad: string;
				lugar: string;
			}) => ({
				day,
				...slot,
			}),
		),
	);

	// Calcular disponibilidad en formato legible
	const daysWithAvailability = Object.entries(disponibilidad)
		.filter(([_, slots]) => slots.length > 0)
		.map(([day]) => day);

	const availability =
		daysWithAvailability.length > 0
			? `Disponible: ${daysWithAvailability.join(', ')}`
			: 'Sin disponibilidad';

	// Verificar si está disponible hoy
	const today = new Date()
		.toLocaleDateString('en-US', { weekday: 'long' })
		.toLowerCase();
	const isAvailableToday =
		(disponibilidad[today as keyof typeof disponibilidad] || []).length > 0;

	// Generar timeSlots en formato legible
	const timeSlots = allSlots.map(
		(slot) => `${slot.day} ${slot.start} - ${slot.end}`,
	);

	// Generar iniciales
	const avatarInitials =
		`${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`.toUpperCase();

	// Colores aleatorios para avatar (basado en el ID)
	const colors = ['#b81d24', '#008000', '#0073e6', '#f59e0b', '#8b5cf6'];
	const avatarColor =
		colors[Number.parseInt(profile.id.slice(-1), 16) % colors.length];

	return {
		id:
			Number.parseInt(profile.id.replace(/\D/g, '').slice(0, 8), 10) ||
			Math.floor(Math.random() * 100000),
		name: `${profile.nombre} ${profile.apellido}`,
		title: `Tutor - Semestre ${profile.semestre}`,
		department: profile.rol.nombre,
		avatarInitials,
		avatarColor,
		rating: 4.5, // TODO: Implementar sistema de calificaciones
		reviews: 0, // TODO: Implementar sistema de reseñas
		tags: allSlots
			.map((slot) => slot.modalidad)
			.filter((v, i, a) => a.indexOf(v) === i),
		availability,
		isAvailableToday,
		timeSlots,
	};
};

// Mock de tutorías agendadas (simulación de datos desde API)
const mockScheduledTutorings: ScheduledTutoring[] = [
	{
		id: 'sched-1',
		tutorId: 1,
		tutorName: 'Dr. María García',
		subject: 'Cálculo Diferencial',
		date: 'Viernes 10 de Diciembre',
		time: '15:00 - 16:00',
		modality: 'virtual',
		meetLink: 'https://meet.google.com/abc-defg-hij',
		studentNotes: 'Repasar límites y continuidad',
	},
	{
		id: 'sched-2',
		tutorId: 2,
		tutorName: 'Ing. Carlos Rodríguez',
		subject: 'React Avanzado',
		date: 'Sábado 11 de Diciembre',
		time: '10:00 - 11:30',
		modality: 'presencial',
		location: 'Biblioteca Central, Sala 3',
		studentNotes: 'Dudas sobre hooks personalizados y context',
	},
];

const dayNames = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
] as const;

const buildScheduledAtFromNow = (daysFromNow: number, startTime: string) => {
	const [hours, minutes] = startTime.split(':').map(Number);
	const baseDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

	const scheduledDate = new Date(
		Date.UTC(
			baseDate.getUTCFullYear(),
			baseDate.getUTCMonth(),
			baseDate.getUTCDate(),
			hours,
			minutes,
			0,
			0,
		),
	);

	const day = dayNames[scheduledDate.getUTCDay()];

	return { scheduledAt: scheduledDate.toISOString(), day };
};

// Reemplazar estas sesiones mock con datos reales de backend cuando haya conexion.
const _mockSessions: StudentSession[] = [
	(() => {
		const { scheduledAt, day } = buildScheduledAtFromNow(2, '14:00');
		return {
			id: '201',
			tutorId: '550e8400-e29b-41d4-a716-446655440000',
			studentId: '660e8400-e29b-41d4-a716-446655440001',
			tutorName: 'Dra. Paula Reyes',
			avatarInitials: 'PR',
			avatarColor: '#8a2be2',
			codigoMateria: 'DOSW',
			subject: 'Desarrollo de Software',
			topic: 'Proyecto final y entregables',
			scheduledAt,
			day,
			startTime: '14:00',
			endTime: '16:00',
			mode: 'VIRTUAL',
			comentarios: 'Necesito ayuda con el proyecto final de la materia',
			status: 'pendiente',
		};
	})(),
	(() => {
		const { scheduledAt, day } = buildScheduledAtFromNow(4, '10:00');
		return {
			id: '202',
			tutorId: '550e8400-e29b-41d4-a716-446655440010',
			studentId: '660e8400-e29b-41d4-a716-446655440001',
			tutorName: 'Ing. Carlos Rodriguez',
			avatarInitials: 'CR',
			avatarColor: '#008000',
			codigoMateria: 'ALG1',
			subject: 'Algebra Lineal',
			topic: 'Repaso para examen parcial',
			scheduledAt,
			day,
			startTime: '10:00',
			endTime: '11:00',
			mode: 'VIRTUAL',
			comentarios: 'Resolver dudas del temario y ejercicios clave',
			status: 'confirmada',
		};
	})(),
	(() => {
		const { scheduledAt, day } = buildScheduledAtFromNow(6, '16:15');
		return {
			id: '203',
			tutorId: '550e8400-e29b-41d4-a716-446655440002',
			studentId: '660e8400-e29b-41d4-a716-446655440001',
			tutorName: 'Mtro. Daniel Perez',
			avatarInitials: 'DP',
			avatarColor: '#ff9900',
			codigoMateria: 'FIS2',
			subject: 'Fisica II',
			topic: 'Circuitos RLC y resonancia',
			scheduledAt,
			day,
			startTime: '16:15',
			endTime: '17:05',
			mode: 'PRESENCIAL',
			location: 'Aula 204 - Ciencias',
			comentarios: 'Revisar ejercicios del laboratorio previo',
			status: 'confirmada',
		};
	})(),
	(() => {
		const { scheduledAt, day } = buildScheduledAtFromNow(8, '19:15');
		return {
			id: '204',
			tutorId: '550e8400-e29b-41d4-a716-446655440003',
			studentId: '660e8400-e29b-41d4-a716-446655440001',
			tutorName: 'Lic. Ana Valdez',
			avatarInitials: 'AV',
			avatarColor: '#008000',
			codigoMateria: 'REDAC',
			subject: 'Redaccion Academica',
			topic: 'Estructura de articulos de investigacion',
			scheduledAt,
			day,
			startTime: '19:15',
			endTime: '19:50',
			mode: 'VIRTUAL',
			comentarios: 'Practicar introduccion y conclusiones',
			status: 'cancelada',
		};
	})(),
];

const StudentTutoringPage: React.FC = () => {
	// Obtener usuario autenticado
	const { user } = useAuth();

	// Obtener tutores desde el backend
	const {
		data: tutoresData,
		isLoading: isLoadingTutors,
		error: tutorsError,
	} = useTutores();

	// Obtener sesiones del estudiante desde el backend
	const {
		data: sessionsData,
		isLoading: isLoadingSessions,
		error: sessionsError,
	} = useStudentSessions(user?.id || '', !!user?.id);

	// Transformar los datos del backend al formato del componente
	const tutors = tutoresData
		? tutoresData.map(transformTutorProfileToTutor)
		: [];

	// Transformar las sesiones del backend
	const sessions = sessionsData
		? sessionsData.map(transformBackendSessionToComponentSession)
		: [];

	const [searchValue, setSearchValue] = useState('');
	const [activeTab, setActiveTab] = useState<'search' | 'my-sessions'>(
		'search',
	);
	const [selectedSession, setSelectedSession] = useState<StudentSession | null>(
		null,
	);
	const [sessionToCancel, setSessionToCancel] = useState<StudentSession | null>(
		null,
	);
	const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
	const [scheduledTutorings, setScheduledTutorings] = useState<
		ScheduledTutoring[]
	>(mockScheduledTutorings);
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		isOpen: isConfirmOpen,
		onOpen: onOpenConfirm,
		onClose: onCloseConfirm,
	} = useDisclosure();

	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	const getFutureSessionsSortedByProximity = useCallback(
		(list: StudentSession[]) => {
			const now = Date.now();

			return [...list]
				.filter((session) => new Date(session.scheduledAt).getTime() >= now)
				.sort((a, b) => {
					const timeA = new Date(a.scheduledAt).getTime();
					const timeB = new Date(b.scheduledAt).getTime();

					return timeA - now - (timeB - now);
				});
		},
		[], // la función no depende de nada externo
	);

	const futureSessions = useMemo(
		() => getFutureSessionsSortedByProximity(sessions),
		[sessions, getFutureSessionsSortedByProximity],
	);

	const handleSearch = (_filters: TutorFilters) => {};

	// TODO: Llamar al backend para cancelar la tutoria
	const handleCancelSession = (id: string) => {
		console.log('Cancelar sesión:', id);
		// TODO: Implementar cancelación en el backend y refetch de datos
	};

	const openSessionDetails = (session: StudentSession) => {
		setSelectedSession(session);
		onOpen();
	};

	const closeSessionDetails = () => {
		setSelectedSession(null);
		onClose();
	};

	const handleScheduleTutoring = (data: {
		tutorId: number;
		name: string;
		email: string;
		slot: string;
		notes?: string;
	}) => {
		console.log('Nueva tutoría agendada:', data);
		// En producción: guardar en API y actualizar lista
		const newTutoring: ScheduledTutoring = {
			id: `sched-${Date.now()}`,
			tutorId: data.tutorId,
			tutorName: selectedTutor?.name || 'Tutor',
			subject: selectedTutor?.tags[0] || 'Sin tema',
			date: data.slot,
			time: data.slot.split(' ').slice(1).join(' ') || '00:00',
			modality: 'virtual',
			studentNotes: data.notes,
		};
		setScheduledTutorings([...scheduledTutorings, newTutoring]);
	};

	const handleCancelTutoring = (id: string) => {
		console.log('Cancelando tutoría:', id);
		setScheduledTutorings(
			scheduledTutorings.filter((t: ScheduledTutoring) => t.id !== id),
		);
	};

	return (
		<div className="">
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

					{isLoadingTutors ? (
						<Card>
							<CardBody className="p-6 text-center">
								<p className="text-default-500">
									Cargando tutores disponibles...
								</p>
							</CardBody>
						</Card>
					) : tutorsError ? (
						<Card>
							<CardBody className="p-6 text-center">
								<p className="text-danger text-lg">Error al cargar tutores</p>
								<p className="text-default-500 mt-2">{tutorsError.message}</p>
							</CardBody>
						</Card>
					) : (
						<>
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
									<TutorCard
										key={tutor.id}
										tutor={tutor}
										onOpenChat={onOpenChat}
										onOpen={(t) => {
											setSelectedTutor(t);
											setIsScheduleOpen(true);
										}}
									/>
								))}
							</div>
						</>
					)}
				</>
			)}{' '}
			{activeTab === 'my-sessions' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Sesiones programadas</h2>
					</div>

					{/* Loading state */}
					{isLoadingSessions && (
						<div className="grid gap-4">
							{[...Array(3)].map((_, i) => (
								<Card key={i}>
									<CardBody className="h-32 bg-default-100 animate-pulse" />
								</Card>
							))}
						</div>
					)}

					{/* Error state */}
					{sessionsError && (
						<Card>
							<CardBody className="text-center py-12">
								<p className="text-danger">
									Error al cargar las tutorías:{' '}
									{sessionsError instanceof Error
										? sessionsError.message
										: 'Error desconocido'}
								</p>
							</CardBody>
						</Card>
					)}

					{/* Content */}
					{!isLoadingSessions &&
						!sessionsError &&
						(futureSessions.length === 0 ? (
							<Card>
								<CardBody className="text-center py-12">
									<Calendar className="w-12 h-12 text-default-300 mx-auto mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										No tienes tutorias programadas
									</h3>
									<p className="text-default-500 mb-4">
										Cuando confirmes una tutoria aparecera aqui.
									</p>
									<Button
										color="primary"
										onPress={() => setActiveTab('search')}
									>
										Agendar tutoria
									</Button>
								</CardBody>
							</Card>
						) : (
							<div className="grid gap-4">
								{futureSessions.map((session) => (
									<SessionCardItem
										key={session.id}
										session={session}
										onViewDetails={openSessionDetails}
										onCancel={(currentSession) => {
											setSessionToCancel(currentSession);
											onOpenConfirm();
										}}
									/>
								))}
							</div>
						))}
				</div>
			)}
			<SessionDetailsModal
				session={selectedSession}
				isOpen={isOpen}
				onClose={closeSessionDetails}
				onRequestCancel={(session) => {
					setSessionToCancel(session);
					onOpenConfirm();
				}}
			/>
			<CancelSessionModal
				session={sessionToCancel}
				isOpen={isConfirmOpen}
				onClose={() => {
					setSessionToCancel(null);
					onCloseConfirm();
				}}
				onConfirm={(session) => {
					handleCancelSession(session.id);
				}}
			/>
			{/* Modal de agendar tutoría */}
			<TutorScheduleModal
				tutor={selectedTutor}
				isOpen={isScheduleOpen}
				onClose={() => setIsScheduleOpen(false)}
				onSchedule={handleScheduleTutoring}
			/>
			{/* Modal de mis tutorías agendadas */}
			<ScheduledTutoringsModal
				tutorings={scheduledTutorings}
				isOpen={false}
				onClose={() => {}}
				onCancel={handleCancelTutoring}
			/>
		</div>
	);
};

export default StudentTutoringPage;
