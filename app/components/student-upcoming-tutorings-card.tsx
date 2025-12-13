/**
 * StudentUpcomingTutoringsCard Component
 * Componente simple para mostrar las 2 próximas tutorías del estudiante
 */

import { Card, CardBody, CardHeader, Chip, Skeleton } from '@heroui/react';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '~/contexts/auth-context';
import { useUpcomingTutorings } from '~/lib/hooks/useUpcomingTutorings';
import type { UpcomingSession } from '~/lib/types/tutoria.types';

/**
 * Formatea la fecha a formato legible
 */
const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-ES', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});
};

/**
 * Obtiene el label del día en español
 */
const getDayLabel = (day: string): string => {
	const days: Record<string, string> = {
		monday: 'Lunes',
		tuesday: 'Martes',
		wednesday: 'Miércoles',
		thursday: 'Jueves',
		friday: 'Viernes',
		saturday: 'Sábado',
		sunday: 'Domingo',
	};
	return days[day.toLowerCase()] ?? day;
};

/**
 * Obtiene las iniciales del nombre
 */
const getInitials = (name: string): string => {
	const parts = name.split(' ').filter(Boolean);
	const first = parts[0]?.[0] ?? '';
	const last = parts.at(-1)?.[0] ?? '';
	return `${first}${last || parts[0]?.[1] || ''}`.toUpperCase();
};

/**
 * Componente de item de tutoría
 */
interface TutoringItemProps {
	readonly tutoring: UpcomingSession;
}

function TutoringItem({ tutoring }: TutoringItemProps) {
	const initials = getInitials(tutoring.tutorName);
	const formattedDate = formatDate(tutoring.date);
	const dayLabel = getDayLabel(tutoring.day);

	return (
		<div className="flex items-start gap-3 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
			{/* Avatar del tutor */}
			<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
				{initials}
			</div>

			{/* Información de la tutoría */}
			<div className="flex-1 space-y-2">
				{/* Header */}
				<div>
					<h4 className="font-semibold text-default-900">
						{tutoring.tutorName}
					</h4>
					<Chip size="sm" color="primary" variant="flat" className="mt-1">
						{tutoring.subjectName}
					</Chip>
				</div>

				{/* Metadatos */}
				<div className="flex flex-col gap-1.5 text-sm text-default-600">
					<div className="flex items-center gap-1.5">
						<Calendar className="w-4 h-4" />
						<span>
							{dayLabel}, {formattedDate}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Clock className="w-4 h-4" />
						<span>{tutoring.startTime}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton para estado de carga
 */
function TutoringsSkeletonList() {
	return (
		<div className="space-y-3">
			{[1, 2].map((i) => (
				<div key={i} className="flex items-start gap-3 p-4 rounded-lg">
					<Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-32 rounded-lg" />
						<Skeleton className="h-6 w-24 rounded-lg" />
						<Skeleton className="h-4 w-48 rounded-lg" />
						<Skeleton className="h-4 w-32 rounded-lg" />
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
		<div className="text-center py-8">
			<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-default-100 flex items-center justify-center">
				<Calendar className="w-8 h-8 text-default-400" />
			</div>
			<h4 className="font-semibold text-default-700 mb-1">
				No tienes tutorías próximas
			</h4>
			<p className="text-sm text-default-500">
				Agenda una tutoría para verla aquí
			</p>
		</div>
	);
}

/**
 * Componente principal
 */
export function StudentUpcomingTutoringsCard() {
	const { user } = useAuth();
	const {
		data: tutorings,
		isLoading,
		isError,
	} = useUpcomingTutorings({
		userId: user?.id ?? '',
		enabled: !!user?.id,
	});

	// Mostrar solo las 2 primeras
	const upcomingTutorings = tutorings?.slice(0, 2) ?? [];

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-col items-start gap-1 pb-4">
				<h3 className="text-xl font-bold text-default-900">
					Próximas Tutorías
				</h3>
				<p className="text-sm text-default-500">
					Tus sesiones de tutoría confirmadas
				</p>
			</CardHeader>
			<CardBody className="pt-0">
				{isLoading && <TutoringsSkeletonList />}

				{isError && (
					<div className="text-center py-8">
						<p className="font-medium text-danger">
							Error al cargar las tutorías
						</p>
						<p className="text-sm text-default-500 mt-1">
							Intenta recargar la página
						</p>
					</div>
				)}

				{!isLoading && !isError && upcomingTutorings.length === 0 && (
					<EmptyState />
				)}

				{!isLoading && !isError && upcomingTutorings.length > 0 && (
					<div className="space-y-3">
						{upcomingTutorings.map((tutoring, index) => (
							<TutoringItem
								key={`${tutoring.date}-${tutoring.startTime}-${index}`}
								tutoring={tutoring}
							/>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
}
