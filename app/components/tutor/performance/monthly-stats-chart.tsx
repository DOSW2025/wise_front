import { Card, CardBody } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
import type { MonthlyStats } from '~/lib/types/tutor-performance.types';

interface MonthlyStatsChartProps {
	stats: MonthlyStats[];
}

export function MonthlyStatsChart({ stats }: MonthlyStatsChartProps) {
	if (stats.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<BarChart3 className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay estadísticas mensuales</p>
				</CardBody>
			</Card>
		);
	}

	const maxSessions = Math.max(...stats.map((s) => s.sessions));
	const maxHours = Math.max(...stats.map((s) => s.totalHours));

	return (
		<Card>
			<CardBody className="gap-4">
				<div>
					<h3 className="text-lg font-semibold text-foreground">
						Estadísticas Mensuales
					</h3>
					<p className="text-sm text-default-500 mt-1">
						Evolución de tu actividad en los últimos meses
					</p>
				</div>
				<div className="space-y-6">
					{stats.map((stat) => (
						<div key={stat.month} className="space-y-3">
							<div className="flex items-baseline justify-between">
								<h4 className="font-semibold text-foreground">{stat.month}</h4>
								<div className="flex items-center gap-4 text-sm">
									<span className="text-default-600">
										{stat.sessions} sesiones
									</span>
									<span className="text-default-600">{stat.totalHours}h</span>
									<span className="text-warning font-medium">
										★ {stat.averageRating.toFixed(1)}
									</span>
								</div>
							</div>
							<div className="space-y-2">
								{/* Sessions bar */}
								<div className="flex items-center gap-2">
									<span className="text-xs text-default-500 w-16">
										Sesiones
									</span>
									<div className="flex-1 bg-default-100 dark:bg-default-50 rounded-full h-2 overflow-hidden">
										<div
											className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500"
											style={{
												width: `${(stat.sessions / maxSessions) * 100}%`,
											}}
										/>
									</div>
									<span className="text-xs text-default-600 w-8 text-right">
										{stat.sessions}
									</span>
								</div>
								{/* Hours bar */}
								<div className="flex items-center gap-2">
									<span className="text-xs text-default-500 w-16">Horas</span>
									<div className="flex-1 bg-default-100 dark:bg-default-50 rounded-full h-2 overflow-hidden">
										<div
											className="bg-gradient-to-r from-secondary-400 to-secondary-600 h-full rounded-full transition-all duration-500"
											style={{
												width: `${(stat.totalHours / maxHours) * 100}%`,
											}}
										/>
									</div>
									<span className="text-xs text-default-600 w-8 text-right">
										{stat.totalHours}h
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
