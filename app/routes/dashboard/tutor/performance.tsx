import {
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Progress,
	Tab,
	Tabs,
} from '@heroui/react';
import {
	Award,
	Gift,
	Star,
	Target,
	TrendingUp,
	Users,
	Zap,
} from 'lucide-react';
import { useState } from 'react';
import {
	TutorAchievementsList,
	TutorBadgesGrid,
	TutorLevelCard,
	TutorRewardsStore,
} from '~/components/tutor';
import {
	mockTutorAchievements,
	mockTutorGamification,
	mockTutorRewards,
} from '~/lib/mocks/tutor-gamification.mock';

export default function TutorPerformance() {
	const [achievements, setAchievements] = useState(mockTutorAchievements);
	const [rewards, setRewards] = useState(mockTutorRewards);
	const [points, setPoints] = useState(mockTutorGamification.totalPoints);

	const handleClaimAchievement = (achievementId: string) => {
		const achievement = achievements.find((a) => a.id === achievementId);
		if (achievement && !achievement.completed) {
			setAchievements((prev) =>
				prev.map((a) =>
					a.id === achievementId ? { ...a, completed: true } : a,
				),
			);
			setPoints((prev) => prev + achievement.reward);
			// Aquí se haría la petición al backend
		}
	};

	const handleRedeemReward = (rewardId: string) => {
		const reward = rewards.find((r) => r.id === rewardId);
		if (reward && !reward.claimed && points >= reward.pointsCost) {
			setRewards((prev) =>
				prev.map((r) => (r.id === rewardId ? { ...r, claimed: true } : r)),
			);
			setPoints((prev) => prev - reward.pointsCost);
			// Aquí se haría la petición al backend
		}
	};

	const completedAchievements = achievements.filter((a) => a.completed).length;
	const achievementProgress =
		(completedAchievements / achievements.length) * 100;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Desempeño Profesional
				</h1>
				<p className="text-default-500 mt-1">
					Sistema de reconocimiento y desarrollo continuo
				</p>
			</div>

			{/* Level Card */}
			<TutorLevelCard
				totalPoints={points}
				level={mockTutorGamification.level}
				levelName={mockTutorGamification.levelName}
				nextLevelPoints={mockTutorGamification.nextLevelPoints}
				currentLevelPoints={mockTutorGamification.currentLevelPoints}
				streak={mockTutorGamification.streak}
			/>

			{/* Metrics Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card shadow="sm" className="border border-divider">
					<CardBody className="p-5">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm text-default-500 mb-1">
									Sesiones Impartidas
								</p>
								<p className="text-2xl font-bold text-foreground">
									{mockTutorGamification.totalSessions}
								</p>
							</div>
							<div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 rounded-lg">
								<TrendingUp className="w-5 h-5 text-primary" />
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1 text-xs">
							<Chip size="sm" color="success" variant="flat" className="h-5">
								+12% este mes
							</Chip>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className="border border-divider">
					<CardBody className="p-5">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm text-default-500 mb-1">
									Estudiantes Únicos
								</p>
								<p className="text-2xl font-bold text-foreground">
									{mockTutorGamification.totalStudents}
								</p>
							</div>
							<div className="bg-success-100 dark:bg-success-900/30 p-2.5 rounded-lg">
								<Users className="w-5 h-5 text-success" />
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1 text-xs">
							<Chip size="sm" color="success" variant="flat" className="h-5">
								+8 nuevos
							</Chip>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className="border border-divider">
					<CardBody className="p-5">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm text-default-500 mb-1">Calificación</p>
								<p className="text-2xl font-bold text-foreground">
									{mockTutorGamification.averageRating.toFixed(1)}
								</p>
							</div>
							<div className="bg-warning-100 dark:bg-warning-900/30 p-2.5 rounded-lg">
								<Star className="w-5 h-5 text-warning" />
							</div>
						</div>
						<div className="mt-3">
							<Progress
								value={(mockTutorGamification.averageRating / 5) * 100}
								color="warning"
								size="sm"
								className="max-w-full"
							/>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className="border border-divider">
					<CardBody className="p-5">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm text-default-500 mb-1">
									Insignias Ganadas
								</p>
								<p className="text-2xl font-bold text-foreground">
									{mockTutorGamification.badges.length}
								</p>
							</div>
							<div className="bg-secondary-100 dark:bg-secondary-900/30 p-2.5 rounded-lg">
								<Award className="w-5 h-5 text-secondary" />
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1 text-xs">
							<Chip size="sm" color="secondary" variant="flat" className="h-5">
								2 por desbloquear
							</Chip>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Achievement Progress Summary */}
			<Card shadow="sm" className="border border-divider">
				<CardBody className="p-5">
					<div className="flex items-center justify-between mb-3">
						<div>
							<h3 className="text-base font-semibold text-foreground">
								Progreso de Logros
							</h3>
							<p className="text-sm text-default-500 mt-0.5">
								{completedAchievements} de {achievements.length} logros
								completados
							</p>
						</div>
						<Chip color="primary" variant="flat">
							{achievementProgress.toFixed(0)}%
						</Chip>
					</div>
					<Progress
						value={achievementProgress}
						color="primary"
						size="md"
						className="max-w-full"
					/>
				</CardBody>
			</Card>

			<Divider className="my-2" />

			{/* Tabs */}
			<Tabs color="primary" variant="underlined" size="lg" className="w-full">
				<Tab
					key="badges"
					title={
						<div className="flex items-center gap-2">
							<Award className="w-4 h-4" />
							<span>Insignias</span>
						</div>
					}
				>
					<Card shadow="none" className="mt-6 bg-transparent">
						<CardHeader className="px-0 pt-0 pb-4">
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									Insignias Profesionales
								</h3>
								<p className="text-sm text-default-500 mt-1">
									{mockTutorGamification.badges.length} insignias desbloqueadas
								</p>
							</div>
						</CardHeader>
						<CardBody className="px-0">
							<TutorBadgesGrid badges={mockTutorGamification.badges} />
						</CardBody>
					</Card>
				</Tab>{' '}
				<Tab
					key="achievements"
					title={
						<div className="flex items-center gap-2">
							<Target className="w-4 h-4" />
							<span>Objetivos</span>
						</div>
					}
				>
					<Card shadow="none" className="mt-6 bg-transparent">
						<CardHeader className="px-0 pt-0 pb-4">
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									Objetivos y Logros
								</h3>
								<p className="text-sm text-default-500 mt-1">
									Completa objetivos para ganar puntos adicionales
								</p>
							</div>
						</CardHeader>
						<CardBody className="px-0">
							<TutorAchievementsList
								achievements={achievements}
								onClaim={handleClaimAchievement}
							/>
						</CardBody>
					</Card>
				</Tab>
				<Tab
					key="rewards"
					title={
						<div className="flex items-center gap-2">
							<Gift className="w-4 h-4" />
							<span>Beneficios</span>
						</div>
					}
				>
					<Card shadow="none" className="mt-6 bg-transparent">
						<CardHeader className="px-0 pt-0 pb-4">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="text-lg font-semibold text-foreground">
										Beneficios Disponibles
									</h3>
									<p className="text-sm text-default-500 mt-1">
										Canje tus puntos por beneficios exclusivos
									</p>
								</div>
								<Chip
									startContent={<Zap className="w-4 h-4" />}
									color="warning"
									variant="flat"
									size="lg"
								>
									{points.toLocaleString()} puntos
								</Chip>
							</div>
						</CardHeader>
						<CardBody className="px-0">
							<TutorRewardsStore
								rewards={rewards}
								currentPoints={points}
								onRedeem={handleRedeemReward}
							/>
						</CardBody>
					</Card>
				</Tab>
			</Tabs>
		</div>
	);
}
