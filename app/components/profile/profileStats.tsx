// components/profile/ProfileStats.tsx
import { Card, CardBody } from '@heroui/react';
import { StatsCard } from '~/components';

interface StatItem {
	title: string;
	value: number | string;
	description: string;
	color: 'primary' | 'success' | 'warning' | 'default';
}

interface ProfileStatsProps {
	title: string;
	stats: StatItem[];
}

export function ProfileStats({ title, stats }: ProfileStatsProps) {
	return (
		<Card>
			<CardBody className="gap-4">
				<h2 className="text-xl font-semibold">{title}</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((stat, index) => (
						<StatsCard
							key={`${stat.title}-${index}`}
							title={stat.title}
							value={stat.value}
							description={stat.description}
							color={stat.color}
						/>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
