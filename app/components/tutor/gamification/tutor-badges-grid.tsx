import { Card, CardBody, Chip } from '@heroui/react';
import {
	BookOpen,
	Clock,
	Flame,
	GraduationCap,
	Heart,
	MessageCircle,
	Sparkles,
	Star,
	Target,
	Trophy,
} from 'lucide-react';
import {
	type BadgeTier,
	TUTOR_BADGE_DEFINITIONS,
	type TutorBadge,
} from '~/lib/types/tutor-gamification.types';

interface TutorBadgeCardProps {
	badge: TutorBadge;
}

const iconMap: Record<string, React.ElementType> = {
	Target: Target,
	Clock: Clock,
	Star: Star,
	BookOpen: BookOpen,
	GraduationCap: GraduationCap,
	Flame: Flame,
	Trophy: Trophy,
	Sparkles: Sparkles,
	MessageCircle: MessageCircle,
	Heart: Heart,
};

function getBadgeTierColor(tier: BadgeTier) {
	switch (tier) {
		case 'bronze':
			return 'warning';
		case 'silver':
			return 'default';
		case 'gold':
			return 'secondary';
	}
}

export function TutorBadgeCard({ badge }: TutorBadgeCardProps) {
	const definition = TUTOR_BADGE_DEFINITIONS[badge.code];
	const tierColor = getBadgeTierColor(badge.tier);
	const IconComponent = iconMap[definition.icon] || Trophy;

	return (
		<Card className="hover:scale-105 transition-transform">
			<CardBody className="items-center text-center gap-2 p-4">
				<div
					className={`p-3 rounded-full bg-${tierColor}-100 dark:bg-${tierColor}-900/30`}
				>
					<IconComponent className={`w-8 h-8 text-${tierColor}`} />
				</div>
				<h4 className="font-bold text-sm">{badge.nombre}</h4>
				<Chip size="sm" color={tierColor} variant="flat" className="capitalize">
					{badge.tier}
				</Chip>
				<p className="text-xs text-default-500">
					{definition.descripcion[badge.tier]}
				</p>
				<p className="text-xs text-default-400">
					{new Date(badge.earnedAt).toLocaleDateString('es-ES', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})}
				</p>
			</CardBody>
		</Card>
	);
}

interface TutorBadgesGridProps {
	badges: TutorBadge[];
}

export function TutorBadgesGrid({ badges }: TutorBadgesGridProps) {
	if (badges.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<Trophy className="w-16 h-16 mx-auto mb-2 text-warning" />
					<p className="text-default-500">Aún no has ganado insignias</p>
					<p className="text-sm text-default-400 mt-1">
						Completa logros para desbloquear insignias
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-4">
			{badges.map((badge) => (
				<TutorBadgeCard key={badge.id} badge={badge} />
			))}
		</div>
	);
}
