import { Card, CardBody, Progress } from '@heroui/react';
import { Flame } from 'lucide-react';
import {
	LEVEL_THRESHOLDS,
	type UserLevel,
} from '~/lib/types/gamification.types';

interface XPLevelWidgetProps {
	xpTotal: number;
	nivel: UserLevel;
	rachaSemanas: number;
}

function getNextLevel(currentLevel: UserLevel): UserLevel | null {
	const levels: UserLevel[] = [
		'Novato',
		'Aprendiz',
		'Colaborador',
		'Avanzado',
		'Mentor',
		'Embajador',
	];
	const currentIndex = levels.indexOf(currentLevel);
	return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

function getProgressToNextLevel(
	xpTotal: number,
	nivel: UserLevel,
): { percentage: number; xpNeeded: number; xpCurrent: number } {
	const nextLevel = getNextLevel(nivel);
	if (!nextLevel) {
		return { percentage: 100, xpNeeded: 0, xpCurrent: xpTotal };
	}

	const currentLevelXP = LEVEL_THRESHOLDS[nivel];
	const nextLevelXP = LEVEL_THRESHOLDS[nextLevel];
	const xpInCurrentLevel = xpTotal - currentLevelXP;
	const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
	const percentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

	return {
		percentage: Math.min(percentage, 100),
		xpNeeded: nextLevelXP - xpTotal,
		xpCurrent: xpInCurrentLevel,
	};
}

export function XPLevelWidget({
	xpTotal,
	nivel,
	rachaSemanas,
}: XPLevelWidgetProps) {
	const { percentage, xpNeeded, xpCurrent } = getProgressToNextLevel(
		xpTotal,
		nivel,
	);
	const nextLevel = getNextLevel(nivel);

	return (
		<Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
			<CardBody className="gap-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-default-500">Nivel Actual</p>
						<h3 className="text-2xl font-bold text-primary">{nivel}</h3>
					</div>
					<div className="flex items-center gap-2 bg-warning-100 dark:bg-warning-900/30 px-3 py-2 rounded-full">
						<Flame className="w-5 h-5 text-warning" />
						<div className="text-center">
							<p className="text-xs text-default-500">Racha</p>
							<p className="text-sm font-bold text-warning">
								{rachaSemanas} semanas
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-default-700 font-medium">
							{xpTotal.toLocaleString()} XP
						</span>
						{nextLevel && (
							<span className="text-default-500">
								{xpNeeded.toLocaleString()} XP para {nextLevel}
							</span>
						)}
					</div>
					<Progress
						value={percentage}
						color="primary"
						size="lg"
						classNames={{
							indicator: 'bg-gradient-to-r from-primary-500 to-secondary-500',
						}}
					/>
				</div>

				{nextLevel && (
					<div className="flex items-center justify-between text-xs text-default-500">
						<span>{nivel}</span>
						<span>{nextLevel}</span>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
