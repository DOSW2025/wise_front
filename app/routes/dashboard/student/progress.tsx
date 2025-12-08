import { Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import {
	ActivityTimeline,
	BadgesGrid,
	CategoryProgressList,
	ChallengesList,
	Leaderboard,
	WeeklyGoalProgress,
	XPLevelWidget,
} from '~/components/gamification';
import {
	mockActivityEvents,
	mockCategoryProgress,
	mockChallenges,
	mockLeaderboard30d,
	mockLeaderboardGlobal,
	mockUserGamification,
} from '~/lib/mocks/gamification.mock';

export default function StudentProgress() {
	const [challenges, setChallenges] = useState(mockChallenges);

	const handleClaimChallenge = (challengeId: string) => {
		setChallenges((prev) =>
			prev.map((challenge) =>
				challenge.id === challengeId
					? { ...challenge, estadoUsuario: 'completado' as const }
					: challenge,
			),
		);
		// Aquí se haría la petición al backend para reclamar la recompensa
		// y actualizar el XP del usuario
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Mi Progreso y Gamificación
				</h1>
				<p className="text-default-500">
					Seguimiento de tu rendimiento, logros y actividad en la plataforma
				</p>
			</div>

			{/* XP and Level Widget */}
			<XPLevelWidget
				xpTotal={mockUserGamification.xpTotal}
				nivel={mockUserGamification.nivel}
				rachaSemanas={mockUserGamification.rachaSemanas}
			/>

			{/* Weekly Goal */}
			<WeeklyGoalProgress
				currentXP={mockUserGamification.metaSemanalProgreso}
				goalXP={mockUserGamification.metaSemanalObjetivo}
			/>

			{/* Tabs for different sections */}
			<Tabs color="primary" variant="underlined" size="lg">
				<Tab key="challenges" title="Desafíos Activos">
					<div className="">
						<ChallengesList
							challenges={challenges}
							onClaim={handleClaimChallenge}
						/>
					</div>
				</Tab>

				<Tab key="badges" title="Mis Insignias">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-bold text-foreground">
									Insignias Ganadas
								</h3>
								<p className="text-sm text-default-500">
									Has desbloqueado {mockUserGamification.badges.length}{' '}
									insignias
								</p>
							</div>
						</div>
						<BadgesGrid badges={mockUserGamification.badges} />
					</div>
				</Tab>

				<Tab key="progress" title="Progreso por Categorías">
					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-bold text-foreground">
								Avance en Categorías
							</h3>
							<p className="text-sm text-default-500 mt-1">
								Tu progreso en diferentes áreas de conocimiento
							</p>
						</div>
						<CategoryProgressList categories={mockCategoryProgress} />
					</div>
				</Tab>

				<Tab key="leaderboard" title="Clasificaciones">
					<div className="">
						<Leaderboard
							globalEntries={mockLeaderboardGlobal}
							global30dEntries={mockLeaderboard30d}
						/>
					</div>
				</Tab>

				<Tab key="activity" title="Actividad Reciente">
					<div className="">
						<ActivityTimeline activities={mockActivityEvents} />
					</div>
				</Tab>
			</Tabs>

			{/* Info Card */}
			<div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
				<h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
					<span>💡</span>
					¿Cómo ganar XP?
				</h4>
				<ul className="text-sm text-default-600 space-y-1">
					<li>• Completa materiales educativos (+40-60 XP)</li>
					<li>• Asiste a tutorías (+60-70 XP)</li>
					<li>• Imparte tutorías (+120-140 XP)</li>
					<li>• Obtén respuestas aceptadas (+80 XP)</li>
					<li>• Comparte recursos valiosos (+70-100 XP)</li>
					<li>• Participa en eventos (+30 XP)</li>
					<li>• Mantén una racha semanal (hasta +20% bonus)</li>
				</ul>
			</div>
		</div>
	);
}
