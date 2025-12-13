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
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { Calendar, Clock, MapPin, Search, Star, Video, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import { FeedbackModal } from '~/components';
import { PageHeader } from '~/components/page-header';
import { RatingModal } from '~/components/rating-modal';
import ScheduledTutoringsModal, {
	type ScheduledTutoring,
} from '~/components/scheduled-tutorings-modal';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';
import TutorScheduleModal from '~/components/tutor-schedule-modal';
import { useAuth } from '~/contexts/auth-context';
import { useCancelSession } from '~/lib/hooks/useCancelSession';
import { useStudentSessions } from '~/lib/hooks/useStudentSessions';
import { useTutores } from '~/lib/hooks/useTutores';
import type {
	StudentSession as BackendStudentSession,
	TutorProfile,
} from '~/lib/types/tutoria.types';

interface Tutor {
	id: number;
	tutorId: string;
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
	disponibilidad?: TutorProfile['disponibilidad'];
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
	status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA' | 'RECHAZADA';
	rated?: boolean; // Indica si el estudiante ya calificó la sesión
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
): 'success' | 'warning' | 'danger' | 'default' => {
	const colorMap: Record<
		StudentSession['status'],
		'success' | 'warning' | 'danger' | 'default'
	> = {
		CONFIRMADA: 'success',
		PENDIENTE: 'warning',
		CANCELADA: 'danger',
		COMPLETADA: 'success',
		RECHAZADA: 'danger',
	};
	return colorMap[status] || 'default';
};

const getStatusLabel = (status: StudentSession['status']): string => {
	const labelMap: Record<StudentSession['status'], string> = {
		PENDIENTE: 'Pendiente',
		CONFIRMADA: 'Confirmada',
		CANCELADA: 'Cancelada',
		COMPLETADA: 'Completada',
		RECHAZADA: 'Rechazada',
	};
	return labelMap[status] || status;
};

const canCancelSession = (status: StudentSession['status']): boolean => {
	return status === 'PENDIENTE' || status === 'CONFIRMADA';
};

type SessionModalityLabel = 'presencial' | 'virtual';

type SessionStatusColor = 'success' | 'warning' | 'danger' | 'default';

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
								{getStatusLabel(session.status)}
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
	onRate?: (session: StudentSession) => void;
}> = ({ session, onViewDetails, onCancel, onRate }) => {
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

	const showRatingButton = view.status === 'COMPLETADA' && !session.rated;
	const alreadyRated = view.status === 'COMPLETADA' && session.rated;

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
							{canCancelSession(view.status) && (
								<Button
									size="sm"
									variant="flat"
									color="danger"
									onPress={() => onCancel(session)}
									startContent={<X className="w-4 h-4" />}
								>
									Cancelar
								</Button>
							)}
							{showRatingButton && onRate && (
								<Button
									size="sm"
									variant="flat"
									color="warning"
									onPress={() => onRate(session)}
									startContent={<Star className="w-4 h-4" />}
								>
									Calificar
								</Button>
							)}
							{alreadyRated && (
								<Chip size="sm" color="success" variant="flat">
									Calificada
								</Chip>
							)}
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
								{session && canCancelSession(session.status) && (
									<Button
										color="danger"
										variant="flat"
										onPress={() => onRequestCancel(session)}
										startContent={<X className="w-4 h-4" />}
									>
										Cancelar tutoría
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
	onConfirm: (session: StudentSession, razon: string) => void;
	isPending?: boolean;
}> = ({ session, isOpen, onClose, onConfirm, isPending = false }) => {
	const [razon, setRazon] = React.useState('');

	const handleClose = () => {
		setRazon('');
		onClose();
	};

	const handleConfirm = () => {
		if (session && razon.trim()) {
			onConfirm(session, razon);
			setRazon('');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open && !isPending) handleClose();
			}}
			size="md"
			isDismissable={!isPending}
		>
			<ModalContent>
				{(onCloseModal) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Cancelar Tutoría
						</ModalHeader>
						<ModalBody className="gap-4">
							<p className="text-default-600">
								¿Estás seguro de que deseas cancelar esta tutoría?
							</p>

							<Textarea
								label="Razón de cancelación"
								placeholder="Explica el motivo de la cancelación..."
								value={razon}
								onValueChange={setRazon}
								isRequired
								variant="bordered"
								minRows={3}
								maxRows={6}
								description="Este campo es obligatorio"
								isDisabled={isPending}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="light"
								onPress={() => {
									handleClose();
									onCloseModal();
								}}
								isDisabled={isPending}
							>
								Volver
							</Button>
							<Button
								color="danger"
								variant="solid"
								onPress={handleConfirm}
								isDisabled={!razon.trim() || isPending}
								isLoading={isPending}
							>
								{isPending ? 'Cancelando...' : 'Confirmar Cancelación'}
							</Button>
						</ModalFooter>
					</>
				)}
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
		PENDIENTE: 'PENDIENTE',
		CONFIRMADA: 'CONFIRMADA',
		CANCELADA: 'CANCELADA',
		COMPLETADA: 'COMPLETADA',
		RECHAZADA: 'RECHAZADA',
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
		status: statusMap[backendSession.status] || 'PENDIENTE',
		location: backendSession.lugar || backendSession.linkConexion || undefined,
		comentarios: backendSession.comentarios || undefined,
		rated: backendSession.rated || false,
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

	// Usar calificación y comentarios reales del backend
	// Buscar primero en tutorProfile (anidado), luego en el nivel superior
	const rating =
		profile.tutorProfile?.calificacion ?? profile.calificacion ?? 0;
	const reviews = profile.tutorProfile?.comentarios ?? profile.comentarios ?? 0;

	// 🔍 DEBUG: Ver qué datos llegan del backend
	console.log('📊 Tutor Profile Data:', {
		tutorId: profile.id,
		nombre: `${profile.nombre} ${profile.apellido}`,
		'tutorProfile.calificacion': profile.tutorProfile?.calificacion,
		'tutorProfile.comentarios': profile.tutorProfile?.comentarios,
		'profile.calificacion': profile.calificacion,
		'profile.comentarios': profile.comentarios,
		'rating (final)': rating,
		'reviews (final)': reviews,
		fullProfile: profile,
	});

	return {
		id:
			Number.parseInt(profile.id.replaceAll(/\D/g, '').slice(0, 8), 10) ||
			Math.floor(Math.random() * 100000),
		tutorId: profile.id, // Agregar el ID del tutor del backend
		name: `${profile.nombre} ${profile.apellido}`,
		title: `Tutor - Semestre ${profile.semestre}`,
		department: profile.rol.nombre,
		avatarInitials,
		avatarColor,
		rating,
		reviews,
		tags: allSlots
			.map((slot) => slot.modalidad)
			.filter((v, i, a) => a.indexOf(v) === i),
		availability,
		isAvailableToday,
		timeSlots,
		disponibilidad, // Agregar disponibilidad completa para el modal
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
			status: 'PENDIENTE',
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
			status: 'CONFIRMADA',
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
			status: 'CONFIRMADA',
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
			status: 'CANCELADA',
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

	// Hook para cancelar sesiones
	const { mutate: cancelSessionMutation, isPending: isCanceling } =
		useCancelSession();

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
	const [sessionToRate, setSessionToRate] = useState<StudentSession | null>(
		null,
	);
	const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
	const [scheduledTutorings, setScheduledTutorings] = useState<
		ScheduledTutoring[]
	>(mockScheduledTutorings);
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [feedback, setFeedback] = useState<{
		isOpen: boolean;
		type: 'success' | 'error';
		title?: string;
		message: string;
	}>({
		isOpen: false,
		type: 'success',
		message: '',
	});

	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		isOpen: isConfirmOpen,
		onOpen: onOpenConfirm,
		onClose: onCloseConfirm,
	} = useDisclosure();

	const {
		isOpen: isRatingOpen,
		onOpen: onOpenRating,
		onClose: onCloseRating,
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

	const handleCancelSession = (session: StudentSession, razon: string) => {
		if (!user?.id) {
			console.error('Usuario no autenticado');
			return;
		}

		cancelSessionMutation(
			{
				sessionId: session.id,
				data: {
					userId: user.id,
					razon,
				},
			},
			{
				onSuccess: () => {
					console.log('✅ Sesión cancelada exitosamente');
					setSessionToCancel(null);
					onCloseConfirm();
					if (selectedSession?.id === session.id) {
						onClose();
					}
				},
				onError: (error) => {
					console.error('❌ Error al cancelar sesión:', error);
				},
			},
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

	const handleScheduleSuccess = (message: string) => {
		setIsScheduleOpen(false);
		setSelectedTutor(null);
		setFeedback({
			isOpen: true,
			type: 'success',
			message,
		});
		setActiveTab('my-sessions');
	};

	const handleScheduleError = (message: string) => {
		setFeedback({
			isOpen: true,
			type: 'error',
			message,
		});
	};

	const handleCancelTutoring = (id: string) => {
		console.log('Cancelando tutoría:', id);
		setScheduledTutorings(
			scheduledTutorings.filter((t: ScheduledTutoring) => t.id !== id),
		);
	};

	const handleOpenRating = (session: StudentSession) => {
		setSessionToRate(session);
		onOpenRating();
	};

	const handleRatingSuccess = () => {
		setFeedback({
			isOpen: true,
			type: 'success',
			title: '¡Sesión Calificada!',
			message: 'Calificación enviada exitosamente. ¡Gracias por tu feedback!',
		});
		setSessionToRate(null);
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

					{isLoadingTutors && (
						<Card>
							<CardBody className="p-6 text-center">
								<p className="text-default-500">
									Cargando tutores disponibles...
								</p>
							</CardBody>
						</Card>
					)}

					{tutorsError && (
						<Card>
							<CardBody className="p-6 text-center">
								<p className="text-danger text-lg">Error al cargar tutores</p>
								<p className="text-default-500 mt-2">{tutorsError.message}</p>
							</CardBody>
						</Card>
					)}

					{!isLoadingTutors && !tutorsError && (
						<>
							<div className="flex justify-between items-center pt-2 border-t border-default-200">
								<p className="text-default-600">
									{tutors.length} tutores encontrados
								</p>
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
							{Array.from({ length: 3 }, (_, i) => (
								<Card key={`skeleton-loading-card-${i}`}>
									<CardBody className="h-32 bg-default-100 animate-pulse" />
								</Card>
							))}
						</div>
					)}{' '}
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
										onRate={handleOpenRating}
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
					if (!isCanceling) {
						setSessionToCancel(null);
						onCloseConfirm();
					}
				}}
				onConfirm={handleCancelSession}
				isPending={isCanceling}
			/>
			{/* Modal de Calificación */}
			{sessionToRate && (
				<RatingModal
					isOpen={isRatingOpen}
					onClose={onCloseRating}
					sessionId={sessionToRate.id}
					raterId={user?.id || ''}
					tutorName={sessionToRate.tutorName}
					subjectName={sessionToRate.subject}
					onSuccess={handleRatingSuccess}
				/>
			)}
			{/* Modal de agendar tutoría */}
			<TutorScheduleModal
				tutor={selectedTutor}
				isOpen={isScheduleOpen}
				onClose={() => setIsScheduleOpen(false)}
				studentId={user?.id || ''}
				onSuccess={handleScheduleSuccess}
				onError={handleScheduleError}
			/>
			{/* Modal de mis tutorías agendadas */}
			<ScheduledTutoringsModal
				tutorings={scheduledTutorings}
				isOpen={false}
				onClose={() => {}}
				onCancel={handleCancelTutoring}
			/>
			{/* Modal de Feedback */}
			<FeedbackModal
				isOpen={feedback.isOpen}
				onClose={() => setFeedback({ ...feedback, isOpen: false })}
				type={feedback.type}
				title={feedback.title}
				message={feedback.message}
			/>
		</div>
	);
};

export default StudentTutoringPage;
