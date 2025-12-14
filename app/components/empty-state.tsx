import { Card, CardBody } from '@heroui/react';

interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<Card className="w-full">
			<CardBody className="items-center justify-center py-12">
				{icon && <div className="mb-4 text-default-300">{icon}</div>}
				<h3 className="text-lg font-semibold text-default-700 mb-2">{title}</h3>
				{description && (
					<p className="text-default-500 text-center max-w-md mb-4">
						{description}
					</p>
				)}
				{action && <div className="mt-4">{action}</div>}
			</CardBody>
		</Card>
	);
}
