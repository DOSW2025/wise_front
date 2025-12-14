import { Card, CardBody } from '@heroui/react';
import {
	BarChart3,
	BookOpen,
	CheckCircle2,
	Gift,
	GraduationCap,
	MessageCircle,
	PartyPopper,
	Shield,
	ThumbsUp,
	Users,
} from 'lucide-react';
import type { ActivityEvent } from '~/lib/types/gamification.types';

interface ActivityTimelineProps {
	activities: ActivityEvent[];
}

function getActivityIcon(tipo: ActivityEvent['tipo']): React.ReactElement {
	const className = 'w-5 h-5';
	switch (tipo) {
		case 'MATERIAL_COMPLETED':
			return <BookOpen className={className} />;
		case 'TUTORING_ATTENDED':
			return <Users className={className} />;
		case 'TUTORING_HOSTED':
			return <GraduationCap className={className} />;
		case 'ANSWER_ACCEPTED':
			return <CheckCircle2 className={className} />;
		case 'ANSWER_UPVOTE_MILESTONES':
			return <ThumbsUp className={className} />;
		case 'RESOURCE_SHARED_APPROVED':
			return <Gift className={className} />;
		case 'COMMENT_HELPFUL':
			return <MessageCircle className={className} />;
		case 'ISSUE_REPORT_VALIDATED':
			return <Shield className={className} />;
		case 'EVENT_ATTENDED':
			return <PartyPopper className={className} />;
	}
}

function getActivityText(tipo: ActivityEvent['tipo']): string {
	switch (tipo) {
		case 'MATERIAL_COMPLETED':
			return 'Material completado';
		case 'TUTORING_ATTENDED':
			return 'Tutoría asistida';
		case 'TUTORING_HOSTED':
			return 'Tutoría impartida';
		case 'ANSWER_ACCEPTED':
			return 'Respuesta aceptada';
		case 'ANSWER_UPVOTE_MILESTONES':
			return 'Hito de votos alcanzado';
		case 'RESOURCE_SHARED_APPROVED':
			return 'Recurso compartido aprobado';
		case 'COMMENT_HELPFUL':
			return 'Comentario útil';
		case 'ISSUE_REPORT_VALIDATED':
			return 'Reporte validado';
		case 'EVENT_ATTENDED':
			return 'Evento asistido';
	}
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
	if (activities.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<BarChart3 className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay actividad reciente</p>
					<p className="text-sm text-default-400 mt-1">
						Tu actividad aparecerá aquí
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card>
			<CardBody className="gap-0">
				<h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 pl-3 pt-3">
					<BarChart3 className="w-5 h-5" />
					Actividad Reciente
				</h3>
				<div className="space-y-0 px-5">
					{activities.map((activity, index) => (
						<div
							key={activity.id}
							className={`flex items-center gap-4 py-3 ${index !== activities.length - 1 ? 'border-b border-divider' : ''}`}
						>
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary">
								{getActivityIcon(activity.tipo)}
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-foreground">
									{getActivityText(activity.tipo)}
								</p>
								<p className="text-xs text-default-500">
									{new Date(activity.occurredAt).toLocaleDateString('es-ES', {
										day: 'numeric',
										month: 'short',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold text-success">
									+{activity.pointsAwarded} XP
								</p>
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
