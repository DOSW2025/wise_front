import { Avatar, Card, CardBody, Chip, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import type { LeaderboardEntry } from '~/lib/types/gamification.types';

interface LeaderboardTableProps {
	entries: LeaderboardEntry[];
}

function getRankIcon(rank: number): string {
	switch (rank) {
		case 1:
			return '🥇';
		case 2:
			return '🥈';
		case 3:
			return '🥉';
		default:
			return '';
	}
}

function LeaderboardTable({ entries }: LeaderboardTableProps) {
	if (entries.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-4xl mb-2">🏆</p>
				<p className="text-default-500">No hay datos disponibles</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{entries.map((entry) => (
				<Card
					key={entry.userId}
					className={
						entry.isCurrentUser
							? 'border-2 border-primary bg-primary-50/50 dark:bg-primary-900/20'
							: ''
					}
				>
					<CardBody className="py-3">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 min-w-[60px]">
								<span className="text-2xl">{getRankIcon(entry.rank)}</span>
								<span className="text-xl font-bold text-default-700">
									#{entry.rank}
								</span>
							</div>

							<Avatar
								src={entry.avatarUrl}
								name={entry.userAlias}
								size="md"
								className="flex-shrink-0"
							/>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="font-semibold text-foreground truncate">
										{entry.userAlias}
									</p>
									{entry.isCurrentUser && (
										<Chip size="sm" color="primary" variant="flat">
											Tú
										</Chip>
									)}
								</div>
								<p className="text-sm text-default-500">
									{entry.badges} insignias
								</p>
							</div>

							<div className="text-right">
								<p className="text-xl font-bold text-primary">
									{entry.xpPeriodo.toLocaleString()}
								</p>
								<p className="text-xs text-default-500">XP</p>
							</div>
						</div>
					</CardBody>
				</Card>
			))}
		</div>
	);
}

interface LeaderboardProps {
	globalEntries: LeaderboardEntry[];
	global30dEntries: LeaderboardEntry[];
	categoryEntries?: LeaderboardEntry[];
	tutorEntries?: LeaderboardEntry[];
}

export function Leaderboard({
	globalEntries,
	global30dEntries,
	categoryEntries,
	tutorEntries,
}: LeaderboardProps) {
	const [selectedTab, setSelectedTab] = useState('global');

	return (
		<Card>
			<CardBody className="gap-4">
				<div className="flex items-center gap-2">
					<span className="text-2xl">🏆</span>
					<h3 className="text-xl font-bold text-foreground">Clasificaciones</h3>
				</div>

				<Tabs
					selectedKey={selectedTab}
					onSelectionChange={(key) => setSelectedTab(key as string)}
					color="primary"
					variant="underlined"
				>
					<Tab key="global" title="Global">
						<div className="mt-4">
							<LeaderboardTable entries={globalEntries} />
						</div>
					</Tab>
					<Tab key="30d" title="Últimos 30 días">
						<div className="mt-4">
							<LeaderboardTable entries={global30dEntries} />
						</div>
					</Tab>
					{categoryEntries && (
						<Tab key="category" title="Por Categoría">
							<div className="mt-4">
								<LeaderboardTable entries={categoryEntries} />
							</div>
						</Tab>
					)}
					{tutorEntries && (
						<Tab key="tutors" title="Tutores">
							<div className="mt-4">
								<LeaderboardTable entries={tutorEntries} />
							</div>
						</Tab>
					)}
				</Tabs>
			</CardBody>
		</Card>
	);
}
