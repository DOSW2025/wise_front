import { Avatar, Button, Card, CardBody, CardHeader } from '@heroui/react';

interface TutoringCardProps {
	id: string;
	subject: string;
	tutor: string;
	tutorAvatar?: string;
	date: string;
	time: string;
	type: 'virtual' | 'presencial';
	status?: 'scheduled' | 'completed' | 'cancelled';
	onAction?: () => void;
	actionLabel?: string;
}

const typeColors: Record<'virtual' | 'presencial', 'primary' | 'success'> = {
	virtual: 'primary',
	presencial: 'success',
};

const statusColors: Record<
	'scheduled' | 'completed' | 'cancelled',
	'primary' | 'success' | 'danger'
> = {
	scheduled: 'primary',
	completed: 'success',
	cancelled: 'danger',
};

const statusLabels: Record<'scheduled' | 'completed' | 'cancelled', string> = {
	scheduled: 'Programada',
	completed: 'Completada',
	cancelled: 'Cancelada',
};

export function TutoringCard({
	subject,
	tutor,
	tutorAvatar,
	date,
	time,
	type,
	status = 'scheduled',
	onAction,
	actionLabel = 'Ver detalles',
}: TutoringCardProps) {
	const statusLabel = statusLabels[status];
	const statusCol = statusColors[status];
	const avatarColor = typeColors[type];

	return (
		<Card className="w-full">
			<CardHeader className="flex gap-3">
				<Avatar
					isBordered
					radius="full"
					size="md"
					src={tutorAvatar}
					name={tutor}
					color={avatarColor}
				/>
				<div className="flex flex-col flex-1">
					<p className="text-md font-semibold">{subject}</p>
					<p className="text-small text-default-500">{tutor}</p>
				</div>
				<div className="flex gap-2">
					<span
						className={`px-2 py-1 text-tiny rounded-full bg-${typeColors[type]}-50 text-${typeColors[type]}`}
					>
						{type === 'virtual' ? '🌐 Virtual' : '📍 Presencial'}
					</span>
					<span
						className={`px-2 py-1 text-tiny rounded-full bg-${statusCol}-50 text-${statusCol}`}
					>
						{statusLabel}
					</span>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<svg
								className="w-4 h-4 text-default-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Calendar"
							>
								<title>Calendar</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span className="text-small text-default-600">{date}</span>
						</div>
						<div className="flex items-center gap-2">
							<svg
								className="w-4 h-4 text-default-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Clock"
							>
								<title>Clock</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span className="text-small text-default-600">{time}</span>
						</div>
					</div>
					{onAction && (
						<Button size="sm" color="primary" variant="flat" onClick={onAction}>
							{actionLabel}
						</Button>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
