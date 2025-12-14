import { Card, CardBody, Progress } from '@heroui/react';
import { CheckCircle2, Target } from 'lucide-react';

interface WeeklyGoalProgressProps {
	currentXP: number;
	goalXP: number;
}

export function WeeklyGoalProgress({
	currentXP,
	goalXP,
}: WeeklyGoalProgressProps) {
	const percentage = Math.min((currentXP / goalXP) * 100, 100);
	const isComplete = currentXP >= goalXP;

	return (
		<Card className={isComplete ? 'border-2 border-success' : ''}>
			<CardBody className="gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-bold text-foreground flex items-center gap-2">
							<Target className="w-5 h-5 text-primary" />
							Meta Semanal
						</h3>
						<p className="text-sm text-default-500">
							{currentXP.toLocaleString()} / {goalXP.toLocaleString()} XP
						</p>
					</div>
					{isComplete && (
						<div className="flex items-center gap-2 bg-success-100 dark:bg-success-900/30 px-3 py-2 rounded-full">
							<CheckCircle2 className="w-5 h-5 text-success" />
							<span className="text-sm font-bold text-success">
								¡Completado!
							</span>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Progress
						value={percentage}
						color={isComplete ? 'success' : 'primary'}
						size="lg"
						classNames={{
							indicator: isComplete
								? 'bg-gradient-to-r from-success-400 to-success-600'
								: 'bg-gradient-to-r from-primary-500 to-secondary-500',
						}}
					/>
					<div className="flex justify-between text-xs text-default-500">
						<span>{Math.round(percentage)}% completado</span>
						{!isComplete && (
							<span>{(goalXP - currentXP).toLocaleString()} XP restantes</span>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
