import { Card, CardBody, Progress } from '@heroui/react';
import { BookOpen, Clock, Star } from 'lucide-react';
import type { SubjectExpertise } from '~/lib/types/tutor-performance.types';

interface SubjectExpertiseListProps {
	subjects: SubjectExpertise[];
}

export function SubjectExpertiseList({ subjects }: SubjectExpertiseListProps) {
	if (subjects.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<BookOpen className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay datos de materias</p>
				</CardBody>
			</Card>
		);
	}

	const maxSessions = Math.max(...subjects.map((s) => s.sessionCount));

	return (
		<Card>
			<CardBody className="gap-4">
				<div>
					<h3 className="text-lg font-semibold text-foreground">
						Materias Impartidas
					</h3>
					<p className="text-sm text-default-500 mt-1">
						Tu experiencia en diferentes áreas
					</p>
				</div>
				<div className="space-y-4">
					{subjects.map((subject) => (
						<div key={subject.subject} className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<h4 className="font-medium text-foreground">
										{subject.subject}
									</h4>
									<div className="flex items-center gap-3 text-xs text-default-500 mt-1">
										<span className="flex items-center gap-1">
											<BookOpen className="w-3 h-3" />
											{subject.sessionCount} sesiones
										</span>
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{subject.totalHours}h
										</span>
										<span className="flex items-center gap-1">
											<Star className="w-3 h-3" />
											{subject.averageRating.toFixed(1)}
										</span>
									</div>
								</div>
							</div>
							<Progress
								value={(subject.sessionCount / maxSessions) * 100}
								color="primary"
								size="sm"
								classNames={{
									indicator: 'bg-gradient-to-r from-primary-400 to-primary-600',
								}}
							/>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
