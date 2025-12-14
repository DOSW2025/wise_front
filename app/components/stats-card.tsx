import { Card, CardBody } from '@heroui/react';
import type { ReactNode } from 'react';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon?: ReactNode;
	description?: string;
	color?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export function StatsCard({
	title,
	value,
	icon,
	description,
	color = 'default',
}: StatsCardProps) {
	const colorClasses = {
		primary: 'bg-primary-50 text-primary',
		success: 'bg-success-50 text-success',
		warning: 'bg-warning-50 text-warning',
		danger: 'bg-danger-50 text-danger',
		default: 'bg-default-100 text-default-700',
	};

	return (
		<Card>
			<CardBody className="gap-4">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-1">
						<p className="text-small text-default-500">{title}</p>
						<p className="text-2xl font-bold">{value}</p>
						{description && (
							<p className="text-tiny text-default-400">{description}</p>
						)}
					</div>
					{icon && (
						<div className={`p-3 rounded-lg ${colorClasses[color]}`}>
							{icon}
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
