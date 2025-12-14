import { Button, Card, CardBody, Chip } from '@heroui/react';
import {
	Award,
	Crown,
	FileCheck,
	Image,
	Lock,
	Palette,
	Sparkles,
	Star,
} from 'lucide-react';
import type { UserReward } from '~/lib/types/gamification.types';

interface TutorRewardsStoreProps {
	rewards: UserReward[];
	currentPoints: number;
	onRedeem?: (rewardId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
	Palette: Palette,
	Star: Star,
	Crown: Crown,
	Image: Image,
	Award: Award,
	FileCheck: FileCheck,
};

export function TutorRewardsStore({
	rewards,
	currentPoints,
	onRedeem,
}: TutorRewardsStoreProps) {
	if (rewards.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<Sparkles className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay recompensas disponibles</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
				<div>
					<p className="text-sm text-default-500">Puntos Disponibles</p>
					<p className="text-2xl font-bold text-warning">
						{currentPoints.toLocaleString()}
					</p>
				</div>
				<Sparkles className="w-8 h-8 text-warning" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{rewards.map((reward) => {
					const canAfford = currentPoints >= reward.pointsCost;
					const isLocked = !reward.unlocked;
					const IconComponent = iconMap[reward.icon] || Sparkles;

					return (
						<Card
							key={reward.id}
							className={`${
								reward.claimed
									? 'opacity-60'
									: isLocked
										? 'border-2 border-default-200'
										: canAfford
											? 'border-2 border-warning-200 dark:border-warning-800'
											: ''
							}`}
						>
							<CardBody className="gap-3 items-center text-center">
								<div className="relative">
									<div
										className={`p-3 rounded-full ${isLocked ? 'bg-default-100 dark:bg-default-900' : 'bg-warning-100 dark:bg-warning-900/30'}`}
									>
										<IconComponent
											className={`w-8 h-8 ${isLocked ? 'text-default-400' : 'text-warning'}`}
										/>
									</div>
									{isLocked && (
										<div className="absolute -top-1 -right-1">
											<Lock className="w-5 h-5 text-default-400" />
										</div>
									)}
								</div>

								<div className="space-y-1">
									<h4 className="font-bold text-foreground">{reward.title}</h4>
									<p className="text-sm text-default-500">
										{reward.description}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<Chip
										size="sm"
										color={canAfford ? 'warning' : 'default'}
										variant="flat"
									>
										{reward.pointsCost.toLocaleString()} pts
									</Chip>
									{reward.claimed && (
										<Chip size="sm" color="success" variant="flat">
											Canjeado
										</Chip>
									)}
								</div>

								{!reward.claimed && !isLocked && (
									<Button
										color={canAfford ? 'warning' : 'default'}
										variant={canAfford ? 'shadow' : 'flat'}
										size="sm"
										fullWidth
										isDisabled={!canAfford}
										onPress={() => canAfford && onRedeem?.(reward.id)}
									>
										{canAfford ? 'Canjear' : 'Puntos Insuficientes'}
									</Button>
								)}

								{isLocked && (
									<Chip size="sm" color="default" variant="flat">
										Bloqueado
									</Chip>
								)}
							</CardBody>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
