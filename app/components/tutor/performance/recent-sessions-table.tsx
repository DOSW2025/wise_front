import { Card, CardBody, Chip } from '@heroui/react';
import { CheckCircle2, Clock, Star, XCircle } from 'lucide-react';
import type { SessionMetrics } from '~/lib/types/tutor-performance.types';

interface RecentSessionsTableProps {
	sessions: SessionMetrics[];
}

function getRatingColor(rating: number) {
	if (rating >= 4.5) return 'success';
	if (rating >= 3.5) return 'warning';
	return 'danger';
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
	if (sessions.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<Clock className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay sesiones recientes</p>
					<p className="text-sm text-default-400 mt-1">
						Las sesiones aparecerán aquí cuando las completes
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card>
			<CardBody className="gap-0 p-0">
				<div className="p-4 border-b border-divider">
					<h3 className="text-lg font-semibold text-foreground">
						Sesiones Recientes
					</h3>
					<p className="text-sm text-default-500 mt-1">
						Últimas {sessions.length} sesiones realizadas
					</p>
				</div>
				<div className="divide-y divide-divider">
					{sessions.map((session) => (
						<div
							key={session.sessionId}
							className="p-4 hover:bg-default-50 dark:hover:bg-default-100/10 transition-colors"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-semibold text-foreground truncate">
											{session.studentName}
										</h4>
										{session.attended ? (
											<CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
										) : (
											<XCircle className="w-4 h-4 text-danger flex-shrink-0" />
										)}
									</div>
									<p className="text-sm text-default-600 mb-1">
										{session.subject}
									</p>
									<div className="flex items-center gap-3 text-xs text-default-500">
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{session.duration} min
										</span>
										<span>
											{new Date(session.date).toLocaleDateString('es-ES', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</span>
									</div>
									{session.feedback && (
										<p className="text-sm text-default-500 mt-2 italic">
											"{session.feedback}"
										</p>
									)}
								</div>
								{session.attended && (
									<Chip
										size="sm"
										color={getRatingColor(session.rating)}
										variant="flat"
										startContent={<Star className="w-3 h-3" />}
									>
										{session.rating.toFixed(1)}
									</Chip>
								)}
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
