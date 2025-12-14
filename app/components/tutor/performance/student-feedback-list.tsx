import { Avatar, Card, CardBody } from '@heroui/react';
import { MessageSquare, Star } from 'lucide-react';
import type { StudentFeedback } from '~/lib/types/tutor-performance.types';

interface StudentFeedbackListProps {
	feedback: StudentFeedback[];
}

export function StudentFeedbackList({ feedback }: StudentFeedbackListProps) {
	if (feedback.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<MessageSquare className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay comentarios aún</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card>
			<CardBody className="gap-4">
				<div>
					<h3 className="text-lg font-semibold text-foreground">
						Comentarios de Estudiantes
					</h3>
					<p className="text-sm text-default-500 mt-1">
						Feedback reciente de tus sesiones
					</p>
				</div>
				<div className="space-y-4">
					{feedback.map((item) => (
						<div
							key={item.id}
							className="p-4 bg-default-50 dark:bg-default-100/10 rounded-lg space-y-2"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<Avatar
										name={item.studentName}
										size="sm"
										className="flex-shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-foreground truncate">
											{item.studentName}
										</p>
										<p className="text-xs text-default-500">
											{item.subject} ·{' '}
											{new Date(item.date).toLocaleDateString('es-ES', {
												day: 'numeric',
												month: 'short',
											})}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1 bg-warning-100 dark:bg-warning-900/30 px-2 py-1 rounded-full flex-shrink-0">
									<Star className="w-3 h-3 text-warning fill-warning" />
									<span className="text-sm font-semibold text-warning">
										{item.rating.toFixed(1)}
									</span>
								</div>
							</div>
							<p className="text-sm text-default-600 italic pl-11">
								"{item.comment}"
							</p>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
