/**
 * UpcomingTutoringsCard Component
 * Componente para mostrar las próximas tutorías agendadas del estudiante
 */

import { Card, CardBody, CardHeader, Chip, Skeleton } from '@heroui/react';
import { Calendar, Clock } from 'lucide-react';
import { useUpcomingSessions } from '../lib/hooks/useUpcomingSessions';
import type { UpcomingSession } from '../lib/types/tutoria.types';

interface UpcomingTutoringsCardProps {
	userId: string;
}

/**
 * Formatea la fecha y hora de una sesión
 */
function formatSessionDateTime(date: string, startTime: string): string {
	const sessionDate = new Date(date);

	// Días de la semana en español
	const weekDays = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	];

	// Meses en español
	const months = [
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

	const dayName = weekDays[sessionDate.getDay()];
	const day = sessionDate.getDate();
	const month = months[sessionDate.getMonth()];

	// Convertir hora de 24h a 12h
	const [hours, minutes] = startTime.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;

	return `${dayName}, ${day} ${month} - ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Item de sesión individual
 */
function SessionItem({ session }: { session: UpcomingSession }) {
	return (
		<div className="flex flex-col gap-2 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1">
					<h4 className="font-semibold text-default-900 mb-1">
						{session.subjectName}
					</h4>
					<p className="text-sm text-default-600">Tutor: {session.tutorName}</p>
				</div>
			</div>

			<div className="flex items-center gap-3 mt-2">
				<Chip
					variant="flat"
					color="primary"
					size="sm"
					startContent={<Calendar className="w-3 h-3" />}
				>
					{formatSessionDateTime(session.date, session.startTime)}
				</Chip>
				<Chip
					variant="flat"
					color="secondary"
					size="sm"
					startContent={<Clock className="w-3 h-3" />}
				>
					{session.startTime}
				</Chip>
			</div>
		</div>
	);
}

/**
 * Skeleton de carga
 */
function UpcomingSessionsSkeleton() {
	return (
		<div className="space-y-3">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex flex-col gap-2 p-4 rounded-lg bg-default-50"
				>
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
 * Componente principal
 */
export function UpcomingTutoringsCard({ userId }: UpcomingTutoringsCardProps) {
	const { data: sessions, isLoading, isError } = useUpcomingSessions(userId);

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-col items-start gap-1 pb-4">
				<h3 className="text-xl font-bold text-default-900">
					Próximas Tutorías
				</h3>
				<p className="text-sm text-default-500">
					Tus sesiones de tutoría agendadas
				</p>
			</CardHeader>
			<CardBody className="pt-0">
				{isLoading && <UpcomingSessionsSkeleton />}

				{isError && (
					<div className="text-center py-8 text-danger">
						<p className="font-medium">Error al cargar las tutorías</p>
						<p className="text-sm mt-1">Intenta recargar la página</p>
					</div>
				)}

				{!isLoading && !isError && sessions?.length === 0 && <EmptyState />}

				{!isLoading && !isError && sessions && sessions.length > 0 && (
					<div className="space-y-3">
						{sessions.map((session, index) => (
							<SessionItem
								key={`${session.date}-${session.startTime}-${index}`}
								session={session}
							/>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
}
