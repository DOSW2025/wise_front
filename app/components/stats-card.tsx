import { Card, CardBody } from '@heroui/react';
import type { ReactNode } from 'react';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon?: ReactNode;
	description?: string;
	color?:
		| 'primary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'secondary'
		| 'default';
	trend?: {
		value: string;
		isPositive: boolean;
	};
}

export function StatsCard({
	title,
	value,
	icon,
	description,
	color = 'default',
	trend,
}: StatsCardProps) {
	const colorClasses = {
		primary: 'bg-primary-50 text-primary',
		success: 'bg-success-50 text-success',
		warning: 'bg-warning-50 text-warning',
		danger: 'bg-danger-50 text-danger',
		secondary: 'bg-blue-100 text-blue-600',
		default: 'bg-default-100 text-default-700',
	};

	const trendColorClass = trend?.isPositive ? 'text-success' : 'text-danger';

	return (
		<Card className="border border-default-200 bg-white">
			<CardBody className="gap-4 p-6">
				{/* Fila 1: Icono y Tendencia */}
				<div className="flex items-start justify-between">
					{icon && (
						<div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
							{icon}
						</div>
					)}
					{trend && (
						<span className={`text-xs font-semibold ${trendColorClass}`}>
							{trend.isPositive ? '+' : '-'}
							{trend.value}
						</span>
					)}
				</div>

				{/* Fila 2: Valor principal */}
				<div className="flex flex-col gap-1">
					<p className="text-4xl font-bold text-foreground">{value}</p>
					<p className="text-sm font-medium text-default-600">{title}</p>
					{description && (
						<p className="text-xs text-default-500">{description}</p>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
