import { Card, CardBody } from '@heroui/react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface PerformanceMetricCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	trend?: 'up' | 'down' | 'stable';
	trendValue?: string;
	icon: React.ReactNode;
	color?: 'primary' | 'success' | 'warning' | 'secondary';
}

export function PerformanceMetricCard({
	title,
	value,
	subtitle,
	trend,
	trendValue,
	icon,
	color = 'primary',
}: PerformanceMetricCardProps) {
	const colorClasses = {
		primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary',
		success: 'bg-success-50 dark:bg-success-900/20 text-success',
		warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning',
		secondary: 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary',
	};

	const getTrendIcon = () => {
		switch (trend) {
			case 'up':
				return <TrendingUp className="w-4 h-4 text-success" />;
			case 'down':
				return <TrendingDown className="w-4 h-4 text-danger" />;
			case 'stable':
				return <Minus className="w-4 h-4 text-default-400" />;
			default:
				return null;
		}
	};

	const getTrendColor = () => {
		switch (trend) {
			case 'up':
				return 'text-success';
			case 'down':
				return 'text-danger';
			case 'stable':
				return 'text-default-400';
			default:
				return 'text-default-500';
		}
	};

	return (
		<Card>
			<CardBody className="gap-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<p className="text-sm text-default-500">{title}</p>
						<p className="text-2xl font-bold text-foreground mt-1">{value}</p>
						{subtitle && (
							<p className="text-xs text-default-400 mt-1">{subtitle}</p>
						)}
					</div>
					<div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
				</div>
				{trend && trendValue && (
					<div className="flex items-center gap-1">
						{getTrendIcon()}
						<span className={`text-sm font-medium ${getTrendColor()}`}>
							{trendValue}
						</span>
						<span className="text-xs text-default-400 ml-1">
							vs mes anterior
						</span>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
