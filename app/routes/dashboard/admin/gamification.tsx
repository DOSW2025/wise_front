import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import {
	AchievementsManagement,
	BadgesManagement,
	ChallengesManagement,
	RewardsManagement,
} from '~/components/admin/gamification';
import {
	mockChallenges,
	mockUserGamification,
} from '~/lib/mocks/gamification.mock';
import {
	mockTutorAchievements,
	mockTutorGamification,
	mockTutorRewards,
} from '~/lib/mocks/tutor-gamification.mock';
import type { Challenge } from '~/lib/types/gamification.types';
import type {
	TutorAchievement,
	TutorReward,
} from '~/lib/types/tutor-gamification.types';

export default function AdminGamification() {
	const [challenges, setChallenges] = useState(mockChallenges);
	const [badges, setBadges] = useState(mockUserGamification.badges);
	const [achievements, setAchievements] = useState(mockTutorAchievements);
	const [rewards, setRewards] = useState(mockTutorRewards);

	const handleAddChallenge = (
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => {
		const newChallenge: Challenge = {
			id: `challenge-${Date.now()}`,
			...challenge,
			estadoUsuario: 'no_iniciado',
			progreso: 0,
		};
		setChallenges([...challenges, newChallenge]);
	};

	const handleUpdateChallenge = (
		id: string,
		challenge: Omit<Challenge, 'id' | 'estadoUsuario' | 'progreso'>,
	) => {
		setChallenges(
			challenges.map((c) => (c.id === id ? { ...c, ...challenge } : c)),
		);
	};

	const handleDeleteChallenge = (id: string) => {
		setChallenges(challenges.filter((c) => c.id !== id));
	};

	const handleAddBadge = (badge: any) => {
		const newBadge = {
			id: `badge-${Date.now()}`,
			...badge,
			earnedAt: new Date().toISOString(),
		};
		setBadges([...badges, newBadge]);
	};

	const handleUpdateBadge = (id: string, badge: any) => {
		setBadges(badges.map((b) => (b.id === id ? { ...b, ...badge } : b)));
	};

	const handleDeleteBadge = (id: string) => {
		setBadges(badges.filter((b) => b.id !== id));
	};

	const handleAddAchievement = (
		achievement: Omit<TutorAchievement, 'id' | 'progress' | 'completed'>,
	) => {
		const newAchievement: TutorAchievement = {
			id: `achievement-${Date.now()}`,
			...achievement,
			progress: 0,
			completed: false,
		};
		setAchievements([...achievements, newAchievement]);
	};

	const handleUpdateAchievement = (
		id: string,
		achievement: Omit<TutorAchievement, 'id' | 'progress' | 'completed'>,
	) => {
		setAchievements(
			achievements.map((a) => (a.id === id ? { ...a, ...achievement } : a)),
		);
	};

	const handleDeleteAchievement = (id: string) => {
		setAchievements(achievements.filter((a) => a.id !== id));
	};

	const handleAddReward = (
		reward: Omit<TutorReward, 'id' | 'unlocked' | 'claimed'>,
	) => {
		const newReward: TutorReward = {
			id: `reward-${Date.now()}`,
			...reward,
			unlocked: true,
			claimed: false,
		};
		setRewards([...rewards, newReward]);
	};

	const handleUpdateReward = (
		id: string,
		reward: Omit<TutorReward, 'id' | 'unlocked' | 'claimed'>,
	) => {
		setRewards(rewards.map((r) => (r.id === id ? { ...r, ...reward } : r)));
	};

	const handleDeleteReward = (id: string) => {
		setRewards(rewards.filter((r) => r.id !== id));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Gestión de Gamificación
				</h1>
				<p className="text-default-500">
					Administra desafíos, insignias, objetivos y beneficios para
					estudiantes y tutores
				</p>
			</div>

			{/* Info Card */}
			<Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
				<CardBody className="p-4">
					<h4 className="font-semibold text-primary mb-2">
						📋 Gestión de Gamificación
					</h4>
					<p className="text-sm text-default-600">
						Desde esta sección puedes crear, editar y eliminar todos los
						elementos de gamificación del sistema. Los cambios se aplicarán
						automáticamente a estudiantes y tutores.
					</p>
				</CardBody>
			</Card>

			{/* Tabs */}
			<Tabs color="primary" variant="underlined" size="lg">
				<Tab key="challenges" title="Desafíos">
					<ChallengesManagement
						challenges={challenges}
						onAdd={handleAddChallenge}
						onUpdate={handleUpdateChallenge}
						onDelete={handleDeleteChallenge}
					/>
				</Tab>

				<Tab key="badges" title="Insignias">
					<BadgesManagement
						badges={badges}
						onAdd={handleAddBadge}
						onUpdate={handleUpdateBadge}
						onDelete={handleDeleteBadge}
					/>
				</Tab>

				<Tab key="achievements" title="Objetivos de Tutores">
					<AchievementsManagement
						achievements={achievements}
						onAdd={handleAddAchievement}
						onUpdate={handleUpdateAchievement}
						onDelete={handleDeleteAchievement}
					/>
				</Tab>

				<Tab key="rewards" title="Beneficios para Tutores">
					<RewardsManagement
						rewards={rewards}
						onAdd={handleAddReward}
						onUpdate={handleUpdateReward}
						onDelete={handleDeleteReward}
					/>
				</Tab>
			</Tabs>
		</div>
	);
}
