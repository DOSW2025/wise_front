/**
 * UpcomingTutoringsCard Component
 * Componente para mostrar las próximas tutorías agendadas del estudiante
 */

import {
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
	Skeleton,
} from '@heroui/react';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import React, { useState } from 'react';
import type { UpcomingSession } from '../lib/types/tutoria.types';
import { useUpcomingSessions } from '../routes/dashboard/tutor/hooks/useUpcomingSessions';

interface UpcomingTutoringsCardProps {
	userId: string;
}

// Interfaces para compatibilidad con el modal de tutoring.tsx
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

// Funciones auxiliares del modal de tutoring.tsx
const getAvatarBg = (avatarColor?: string): string => {
	const colorMap: Record<string, string> = {
		'#b81d24': 'bg-danger',
		'#ff9900': 'bg-orange-500',
		'#8a2be2': 'bg-purple-500',
		'#008000': 'bg-success',
	};
	return colorMap[avatarColor ?? ''] || 'bg-danger';
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
): SessionStatusColor => {
	if (status === 'confirmada') return 'success';
	if (status === 'pendiente') return 'warning';
	return 'danger';
};

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

// Componentes del modal de tutoring.tsx - Versión consolidada
const getAvatarSizeClass = (size?: 'sm' | 'lg'): string =>
	size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

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
}) => (
	<div className="flex items-start justify-between ">
		<div className="space-y-2">
			<div className="flex items-center gap-3">
				<div
					className={`${session.avatarBg} ${getAvatarSizeClass(avatarSize)} rounded-full flex items-center justify-center text-white font-semibold`}
				>
					{session.initials}
				</div>
				<div>
					<h3 className="font-heading font-semibold">{session.tutorName}</h3>
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

const getModalityIcon = (modality: string) =>
	modality === 'virtual' ? (
		<Video className="w-4 h-4" />
	) : (
		<MapPin className="w-4 h-4" />
	);

const LocationContent: React.FC<{ location: string; modality: string }> = ({
	location,
	modality,
}) =>
	modality === 'virtual' && location.startsWith('http') ? (
		<a
			href={location}
			target="_blank"
			rel="noopener noreferrer"
			className="text-primary hover:underline"
		>
			{location}
		</a>
	) : (
		<span>{location}</span>
	);

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
			{getModalityIcon(session.modalityLabel)}
			<span className="capitalize">{session.modalityLabel}</span>
			{session.location && (
				<>
					<span> - </span>
					<LocationContent
						location={session.location}
						modality={session.modalityLabel}
					/>
				</>
			)}
		</div>
	</div>
);

// Modal de detalles - exactamente igual al de tutoring.tsx
const SessionDetailsModal: React.FC<{
	session: StudentSession | null;
	isOpen: boolean;
	onClose: () => void;
}> = ({ session, isOpen, onClose }) => {
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
								<span className="font-heading">Detalle de tutoria</span>
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
							</ModalFooter>
						</>
					);
				}}
			</ModalContent>
		</Modal>
	);
};

// Convertir UpcomingSession a StudentSession
const convertUpcomingToStudentSession = (
	upcoming: UpcomingSession,
): StudentSession => {
	// Calcular endTime (asumiendo 1 hora de duración)
	const [hours, minutes] = upcoming.startTime.split(':').map(Number);
	const endTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

	return {
		id: `upcoming-${upcoming.date}-${upcoming.startTime}`,
		tutorId: '', // Se llenará desde el backend
		studentId: upcoming.studentName,
		tutorName: upcoming.tutorName,
		codigoMateria: '', // Se llenará desde el backend
		subject: upcoming.subjectName,
		topic: upcoming.subjectName,
		scheduledAt: upcoming.date,
		day: upcoming.day,
		startTime: upcoming.startTime,
		endTime,
		mode: 'VIRTUAL', // Valor por defecto
		comentarios: '',
		status: 'confirmada',
	};
};

/**
 * Formatea la fecha y hora de una sesión
 */
const WEEK_DAYS = [
	'Domingo',
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
];

const MONTHS = [
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

const formatTimeAsAmPm = (time: string): string => {
	const [hours, minutes] = time.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

function formatSessionDateTime(date: string, startTime: string): string {
	const sessionDate = new Date(date);
	const dayName = WEEK_DAYS[sessionDate.getDay()];
	const day = sessionDate.getDate();
	const month = MONTHS[sessionDate.getMonth()];
	const timeFormatted = formatTimeAsAmPm(startTime);
	return `${dayName}, ${day} ${month} - ${timeFormatted}`;
}

/**
 * Item de sesión individual - Versión consolidada
 */
const SessionItemHeader: React.FC<{
	subjectName: string;
	tutorName: string;
	onViewDetails: () => void;
}> = ({ subjectName, tutorName, onViewDetails }) => (
	<div className="flex items-start justify-between gap-2">
		<div className="flex-1">
			<h4 className="font-heading font-semibold text-default-900 mb-1">
				{subjectName}
			</h4>
			<p className="font-sans text-sm text-default-600">con {tutorName}</p>
		</div>
		<Button
			className="font-nav"
			size="sm"
			color="primary"
			variant="flat"
			onPress={onViewDetails}
		>
			Ver detalles
		</Button>
	</div>
);

function SessionItem({
	session,
	onViewDetails,
}: {
	session: UpcomingSession;
	onViewDetails: (session: StudentSession) => void;
}) {
	const handleViewDetails = () =>
		onViewDetails(convertUpcomingToStudentSession(session));

	return (
		<div className="flex flex-col gap-2 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
			<SessionItemHeader
				subjectName={session.subjectName}
				tutorName={session.tutorName}
				onViewDetails={handleViewDetails}
			/>
			<div className="flex items-center gap-3 mt-2">
				<Chip
					variant="flat"
					color="primary"
					size="sm"
					startContent={<Calendar className="w-3 h-3" />}
				>
					{formatSessionDateTime(session.date, session.startTime)}
				</Chip>
			</div>
		</div>
	);
}

/**
 * Skeleton de carga - Versión consolidada
 */
const SkeletonItemRow: React.FC = () => (
	<div className="flex flex-col gap-2 p-4 rounded-lg bg-default-50">
		<div className="flex items-start justify-between gap-2">
			<div className="flex-1 space-y-2">
				<Skeleton className="h-5 w-3/4 rounded-lg" />
				<Skeleton className="h-4 w-1/2 rounded-lg" />
			</div>
		</div>
		<div className="flex items-center gap-3 mt-2">
			<Skeleton className="h-6 w-40 rounded-full" />
			<Skeleton className="h-6 w-20 rounded-full" />
		</div>
	</div>
);

function UpcomingSessionsSkeleton() {
	return (
		<div className="space-y-3">
			{[1, 2, 3].map((i) => (
				<SkeletonItemRow key={i} />
			))}
		</div>
	);
}

/**
 * Estado vacío
 */
function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-8 px-4 text-center">
			<div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center mb-4">
				<Calendar className="w-8 h-8 text-default-400" />
			</div>
			<p className="text-default-600 font-medium mb-1">
				No tienes tutorías próximas
			</p>
			<p className="text-sm text-default-400">
				Agenda una tutoría para verla aquí
			</p>
		</div>
	);
}

/**
 * Componente principal - Versión consolidada
 */
interface ContentRendererProps {
	isLoading: boolean;
	isError: boolean;
	sessions: UpcomingSession[] | undefined;
	onViewDetails: (session: StudentSession) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
	isLoading,
	isError,
	sessions,
	onViewDetails,
}) => {
	if (isLoading) return <UpcomingSessionsSkeleton />;

	if (isError) {
		return (
			<div className="text-center py-8 text-danger">
				<p className="font-medium">Error al cargar las tutorías</p>
				<p className="text-sm mt-1">Intenta recargar la página</p>
			</div>
		);
	}

	if (!sessions || sessions.length === 0) return <EmptyState />;

	return (
		<div className="space-y-3">
			{sessions.map((session, index) => (
				<SessionItem
					key={`${session.date}-${session.startTime}-${index}`}
					session={session}
					onViewDetails={onViewDetails}
				/>
			))}
		</div>
	);
};

export function UpcomingTutoringsCard(): React.ReactNode {
	const { data: sessions, isLoading, isError } = useUpcomingSessions();
	const [selectedSession, setSelectedSession] = useState<StudentSession | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleViewDetails = (session: StudentSession) => {
		setSelectedSession(session);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedSession(null);
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader className="flex flex-col items-start gap-1 pb-4">
					<h3 className="font-heading text-xl font-bold text-default-900">
						Próximas Tutorías
					</h3>
					<p className="font-sans text-sm text-default-500">
						Tus sesiones de tutoría agendadas
					</p>
				</CardHeader>
				<CardBody className="pt-0">
					<ContentRenderer
						isLoading={isLoading}
						isError={isError}
						sessions={sessions}
						onViewDetails={handleViewDetails}
					/>
				</CardBody>
			</Card>

			{/* Modal de detalles */}
			<SessionDetailsModal
				session={selectedSession}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</>
	);
}
