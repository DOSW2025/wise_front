import { Card, CardBody, Progress } from '@heroui/react';
import { Flame, TrendingUp, Trophy } from 'lucide-react';
import { TUTOR_LEVELS } from '~/lib/types/tutor-gamification.types';

interface TutorLevelCardProps {
	totalPoints: number;
	level: number;
	levelName: string;
	nextLevelPoints: number;
	currentLevelPoints: number;
	streak: number;
}

export function TutorLevelCard({
	totalPoints,
	level,
	levelName,
	nextLevelPoints,
	currentLevelPoints,
	streak,
}: TutorLevelCardProps) {
	const pointsInCurrentLevel = totalPoints - currentLevelPoints;
	const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
	const percentage = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
	const pointsToNext = nextLevelPoints - totalPoints;

	const nextLevel = TUTOR_LEVELS.find((l) => l.level === level + 1);

	return (
		<Card className="bg-gradient-to-br from-warning-50 to-primary-50 dark:from-warning-900/20 dark:to-primary-900/20 border-2 border-warning-200 dark:border-warning-800">
			<CardBody className="gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-full">
							<Trophy className="w-6 h-6 text-warning" />
						</div>
						<div>
							<p className="text-sm text-default-500">Nivel Actual</p>
							<h3 className="text-2xl font-bold text-warning">{levelName}</h3>
							<p className="text-sm text-default-600">Nivel {level}</p>
						</div>
					</div>
					<div className="text-center bg-white dark:bg-default-50 rounded-lg px-4 py-2">
						<p className="text-xs text-default-500">Puntos Totales</p>
						<p className="text-2xl font-bold text-primary">
							{totalPoints.toLocaleString()}
						</p>
					</div>
				</div>

				{streak > 0 && (
					<div className="flex items-center gap-2 bg-danger-100 dark:bg-danger-900/30 px-3 py-2 rounded-lg">
						<Flame className="w-6 h-6 text-danger" />
						<div>
							<p className="text-xs text-default-500">Racha Activa</p>
							<p className="text-sm font-bold text-danger">
								{streak} semanas consecutivas
							</p>
						</div>
					</div>
				)}

				{nextLevel && (
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-default-700 font-medium">
								Progreso al siguiente nivel
							</span>
							<span className="text-default-500">
								{pointsToNext.toLocaleString()} puntos restantes
							</span>
						</div>
						<Progress
							value={percentage}
							color="warning"
							size="lg"
							classNames={{
								indicator: 'bg-gradient-to-r from-warning-400 to-primary-500',
							}}
						/>
						<div className="flex items-center justify-between text-xs text-default-500">
							<span>{levelName}</span>
							<div className="flex items-center gap-1">
								<TrendingUp className="w-3 h-3" />
								<span>{nextLevel.name}</span>
							</div>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
