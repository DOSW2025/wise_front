import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { BookOpen, Calendar, MessageSquare, Star, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
	id: string;
	type: 'message' | 'session' | 'material' | 'rating';
	title: string;
	description: string;
	timestamp: string;
	unread: boolean;
	avatar?: string;
}

interface NotificationsPanelProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
}

export function NotificationsPanel({
	isOpen,
	onClose,
}: NotificationsPanelProps) {
	const [notifications] = useState<Notification[]>([
		{
			id: '1',
			type: 'message',
			title: 'Nuevo mensaje de Dr. María García',
			description: 'Te ha enviado un mensaje sobre la sesión de mañana',
			timestamp: '5 min',
			unread: true,
		},
		{
			id: '2',
			type: 'session',
			title: 'Sesión programada',
			description: 'Tienes una tutoría de Cálculo en 1 hora',
			timestamp: '1 hora',
			unread: true,
		},
		{
			id: '3',
			type: 'material',
			title: 'Nuevo material disponible',
			description: 'Se ha subido material de React Hooks',
			timestamp: '2 horas',
			unread: true,
		},
		{
			id: '4',
			type: 'rating',
			title: 'Califica tu sesión',
			description: 'Califica tu última sesión con Ing. Carlos',
			timestamp: '1 día',
			unread: false,
		},
	]);

	const getIcon = (type: string) => {
		switch (type) {
			case 'message':
				return <MessageSquare className="w-5 h-5 text-blue-500" />;
			case 'session':
				return <Calendar className="w-5 h-5 text-green-500" />;
			case 'material':
				return <BookOpen className="w-5 h-5 text-purple-500" />;
			case 'rating':
				return <Star className="w-5 h-5 text-yellow-500" />;
			default:
				return <MessageSquare className="w-5 h-5 text-default-500" />;
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 lg:inset-auto lg:top-16 lg:right-4 lg:w-80">
			{/* Overlay for mobile */}
			<button
				type="button"
				className="lg:hidden fixed inset-0 bg-black/50 border-none cursor-default"
				onClick={onClose}
				onKeyDown={(e) => e.key === 'Escape' && onClose()}
				aria-label="Close panel"
			/>

			<Card className="h-full lg:h-[500px] lg:shadow-xl">
				<CardHeader className="flex justify-between items-center">
					<h3 className="text-lg font-semibold">Notificaciones</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1 hover:bg-default-100 rounded"
					>
						<X className="w-5 h-5" />
					</button>
				</CardHeader>
				<Divider />
				<CardBody className="p-0">
					<div className="space-y-1">
						{notifications.map((notification) => (
							<div
								key={notification.id}
								className={`p-4 hover:bg-default-50 cursor-pointer border-l-4 ${
									notification.unread
										? 'border-l-primary bg-primary-50/50'
										: 'border-l-transparent'
								}`}
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 mt-1">
										{getIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start">
											<p
												className={`font-medium text-sm ${notification.unread ? 'text-foreground' : 'text-default-600'}`}
											>
												{notification.title}
											</p>
											<span className="text-xs text-default-400">
												{notification.timestamp}
											</span>
										</div>
										<p
											className={`text-sm mt-1 ${notification.unread ? 'text-default-700' : 'text-default-500'}`}
										>
											{notification.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
