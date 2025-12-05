import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/react';
import { Bell, Check, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
	timestamp: Date;
	read: boolean;
	avatar?: string;
}

const mockNotifications: Notification[] = [
	{
		id: '1',
		title: 'Nueva tutoría programada',
		message:
			'Tu tutoría de Cálculo con Dr. María García está programada para mañana a las 15:00',
		type: 'info',
		timestamp: new Date(Date.now() - 5 * 60 * 1000),
		read: false,
		avatar: 'MG',
	},
	{
		id: '2',
		title: 'Material disponible',
		message:
			'Nuevo material de Programación Orientada a Objetos disponible para descarga',
		type: 'success',
		timestamp: new Date(Date.now() - 30 * 60 * 1000),
		read: false,
	},
	{
		id: '3',
		title: 'Recordatorio',
		message: 'Tu sesión de tutoría comienza en 1 hora',
		type: 'warning',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
		read: true,
	},
];

const getNotificationStyles = (type: string, read: boolean) => {
	if (read) return 'data-[hover=true]:bg-transparent';

	switch (type) {
		case 'info':
			return 'bg-blue-50 border-l-4 border-blue-400 data-[hover=true]:bg-blue-50';
		case 'success':
			return 'bg-green-50 border-l-4 border-green-400 data-[hover=true]:bg-green-50';
		case 'warning':
			return 'bg-yellow-50 border-l-4 border-yellow-400 data-[hover=true]:bg-yellow-50';
		case 'error':
			return 'bg-red-50 border-l-4 border-red-400 data-[hover=true]:bg-red-50';
		default:
			return 'bg-default-50 data-[hover=true]:bg-default-50';
	}
};

export function NotificationsDropdown() {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const formatTime = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);

		if (minutes < 60) return `hace ${minutes}m`;
		if (hours < 24) return `hace ${hours}h`;
		return date.toLocaleDateString();
	};

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button isIconOnly variant="light" size="md" className="relative">
					<Bell className="w-6 h-6" />
					{unreadCount > 0 && (
						<span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></span>
					)}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Notificaciones"
				className="w-80"
				closeOnSelect={false}
			>
				<DropdownItem
					key="header"
					className="h-14 gap-2 data-[hover=true]:bg-transparent"
					textValue="header"
				>
					<div className="flex justify-between items-center w-full">
						<div>
							<p className="font-semibold">Notificaciones</p>
							<p className="text-tiny text-default-500">
								{unreadCount} sin leer
							</p>
						</div>
						{unreadCount > 0 && (
							<Button
								size="sm"
								variant="light"
								onPress={markAllAsRead}
								className="text-primary"
							>
								Marcar todas como leídas
							</Button>
						)}
					</div>
				</DropdownItem>

				{notifications.length === 0 ? (
					<DropdownItem key="empty" textValue="empty">
						<p className="text-center text-default-500 py-4">
							No hay notificaciones
						</p>
					</DropdownItem>
				) : (
					notifications.map((notification) => (
						<DropdownItem
							key={notification.id}
							className={`h-auto py-3 ${getNotificationStyles(notification.type, notification.read)}`}
							textValue={notification.title}
						>
							<div className="flex gap-3 w-full">
								{notification.avatar && (
									<Avatar
										name={notification.avatar}
										size="sm"
										color={
											notification.type === 'success'
												? 'success'
												: notification.type === 'warning'
													? 'warning'
													: notification.type === 'error'
														? 'danger'
														: 'primary'
										}
									/>
								)}
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start">
										<p className="font-semibold text-sm truncate">
											{notification.title}
										</p>
										<div className="flex gap-1 ml-2">
											{!notification.read && (
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onPress={() => markAsRead(notification.id)}
												>
													<Check className="w-3 h-3" />
												</Button>
											)}
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onPress={() => removeNotification(notification.id)}
											>
												<X className="w-3 h-3" />
											</Button>
										</div>
									</div>
									<p className="text-tiny text-default-600 mt-1">
										{notification.message}
									</p>
									<p className="text-tiny text-default-400 mt-1">
										{formatTime(notification.timestamp)}
									</p>
								</div>
							</div>
						</DropdownItem>
					))
				)}
			</DropdownMenu>
		</Dropdown>
	);
}
