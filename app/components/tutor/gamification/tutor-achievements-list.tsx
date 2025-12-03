import { Button, Card, CardBody, Progress } from '@heroui/react';
import { Clock, Flame, Star, Target, Users, Zap } from 'lucide-react';
import type { TutorAchievement } from '~/lib/types/tutor-gamification.types';

interface TutorAchievementsListProps {
	achievements: TutorAchievement[];
	onClaim?: (achievementId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
	Target: Target,
	Users: Users,
	Star: Star,
	Clock: Clock,
	Zap: Zap,
	Flame: Flame,
};

export function TutorAchievementsList({
	achievements,
	onClaim,
}: TutorAchievementsListProps) {
	if (achievements.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<Target className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay logros disponibles</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{achievements.map((achievement) => {
				const percentage = Math.min(
					(achievement.progress / achievement.target) * 100,
					100,
				);
				const isComplete = achievement.progress >= achievement.target;
				const IconComponent = iconMap[achievement.icon] || Target;

				return (
					<Card
						key={achievement.id}
						className={isComplete ? 'border-2 border-success' : ''}
					>
						<CardBody className="gap-3">
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-3 flex-1">
									<div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
										<IconComponent className="w-6 h-6 text-primary" />
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-foreground">
											{achievement.title}
										</h4>
										<p className="text-sm text-default-500 mt-1">
											{achievement.description}
										</p>
									</div>
								</div>
								<div className="text-right flex-shrink-0">
									<p className="text-lg font-bold text-warning">
										+{achievement.reward}
									</p>
									<p className="text-xs text-default-500">puntos</p>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-default-600">
										{achievement.progress} / {achievement.target}
									</span>
									<span className="font-medium text-primary">
										{Math.round(percentage)}%
									</span>
								</div>
								<Progress
									value={percentage}
									color={isComplete ? 'success' : 'primary'}
									size="sm"
									classNames={{
										indicator: isComplete
											? 'bg-gradient-to-r from-success-400 to-success-600'
											: 'bg-gradient-to-r from-primary-400 to-primary-600',
									}}
								/>
							</div>

							{isComplete && !achievement.completed && (
								<Button
									color="success"
									variant="flat"
									size="sm"
									onPress={() => onClaim?.(achievement.id)}
									className="w-full"
								>
									Reclamar Recompensa
								</Button>
							)}
						</CardBody>
					</Card>
				);
			})}
		</div>
	);
}
