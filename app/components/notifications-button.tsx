import {
	Badge,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollShadow,
} from '@heroui/react';
import { Bell, BookOpen, CheckCircle2, Megaphone } from 'lucide-react';
import { useState } from 'react';

interface Notification {
	id: string;
	title: string;
	description: string;
	timestamp: string;
	type: 'assignment' | 'announcement' | 'grade';
	icon: 'book' | 'megaphone' | 'check';
}

const mockNotifications: Notification[] = [
	{
		id: '1',
		title: 'Entrega de Proyecto – Ingeniería de Sistemas',
		description: 'Tu profesor ha publicado una nueva entrega.',
		timestamp: 'Hace 2 h',
		type: 'assignment',
		icon: 'book',
	},
	{
		id: '2',
		title: 'Nuevo anuncio del curso',
		description: 'El profesor ha publicado un comunicado.',
		timestamp: 'Hace 6 h',
		type: 'announcement',
		icon: 'megaphone',
	},
	{
		id: '3',
		title: 'Actualización de calificaciones',
		description: 'Se han actualizado tus notas.',
		timestamp: 'Ayer',
		type: 'grade',
		icon: 'check',
	},
];

export function NotificationsButton() {
	const [isOpen, setIsOpen] = useState(false);

	const getIcon = (iconType: string) => {
		switch (iconType) {
			case 'book':
				return <BookOpen className="w-5 h-5 text-green-400" />;
			case 'megaphone':
				return <Megaphone className="w-5 h-5 text-yellow-400" />;
			case 'check':
				return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
			default:
				return <Bell className="w-5 h-5" />;
		}
	};

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
			<PopoverTrigger>
				<Button
					isIconOnly
					className="bg-transparent hover:bg-default-100"
					aria-label="Notificaciones"
				>
					<Badge
						content={mockNotifications.length}
						color="danger"
						shape="circle"
						size="sm"
					>
						<Bell className="w-6 h-6 text-default-600" />
					</Badge>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-96 p-0">
				<div className="flex flex-col max-h-96">
					{/* Header */}
					<div className="px-4 py-3 border-b border-default-200">
						<p className="text-sm font-semibold text-default-700">
							Notificaciones
						</p>
					</div>

					{/* Notifications list */}
					<ScrollShadow className="flex-1 overflow-y-auto">
						<div className="divide-y divide-default-100">
							{mockNotifications.map((notification) => (
								<div
									key={notification.id}
									className="px-4 py-3 hover:bg-default-50 transition-colors cursor-pointer"
								>
									<div className="flex gap-3">
										<div className="flex-shrink-0 mt-1">
											{getIcon(notification.icon)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-small text-default-900 line-clamp-2">
												{notification.title}
											</p>
											<p className="text-xs text-default-500 line-clamp-2 mt-1">
												{notification.description}
											</p>
											<p className="text-xs text-default-400 mt-1">
												{notification.timestamp}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollShadow>

					{/* Footer */}
					<div className="px-4 py-3 border-t border-default-200 text-center">
						<button
							type="button"
							className="text-sm font-medium text-red-600 hover:text-red-700"
						>
							Ver todas las notificaciones →
						</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
