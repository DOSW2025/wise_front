import { Card, CardBody } from '@heroui/react';

interface AlertMessageProps {
	message: string;
	type: 'error' | 'success';
}

export function AlertMessage({ message, type }: AlertMessageProps) {
	const isError = type === 'error';

	return (
		<Card
			className={
				isError ? 'bg-danger-50 border-danger' : 'bg-success-50 border-success'
			}
		>
			<CardBody>
				<p
					className={
						isError ? 'text-danger font-medium' : 'text-success font-medium'
					}
				>
					{message}
				</p>
			</CardBody>
		</Card>
	);
}
