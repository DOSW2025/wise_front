import { Card, CardBody, Chip } from '@heroui/react';
import type { Badge, BadgeTier } from '~/lib/types/gamification.types';

interface BadgeCardProps {
	badge: Badge;
}

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

export function BadgeCard({ badge }: BadgeCardProps) {
	const tierColor = getBadgeTierColor(badge.tier);

	return (
		<Card className="hover:scale-105 transition-transform">
			<CardBody className="items-center text-center gap-2 p-4">
				<div className="text-4xl">{badge.icon}</div>
				<h4 className="font-bold text-sm">{badge.nombre}</h4>
				<Chip size="sm" color={tierColor} variant="flat" className="capitalize">
					{badge.tier}
				</Chip>
				<p className="text-xs text-default-500">{badge.descripcion}</p>
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

interface BadgesGridProps {
	badges: Badge[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
	if (badges.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<p className="text-4xl mb-2">🏆</p>
					<p className="text-default-500">Aún no has ganado insignias</p>
					<p className="text-sm text-default-400 mt-1">
						Completa actividades para desbloquear logros
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
			{badges.map((badge) => (
				<BadgeCard key={badge.id} badge={badge} />
			))}
		</div>
	);
}
