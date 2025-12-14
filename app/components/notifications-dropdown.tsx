import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Spinner,
} from '@heroui/react';
import {
	AlertTriangle,
	Award,
	Bell,
	Calendar,
	CheckCircle,
	FileText,
	Trash2,
} from 'lucide-react';
import { useNotifications } from '~/lib/hooks/useNotifications';

const getNotificationIcon = (type: string) => {
	switch (type) {
		case 'info':
			return <Calendar className="w-5 h-5 text-blue-500" />;
		case 'success':
			return <CheckCircle className="w-5 h-5 text-green-500" />;
		case 'warning':
			return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
		case 'error':
			return <AlertTriangle className="w-5 h-5 text-red-500" />;
		case 'achievement':
			return <Award className="w-5 h-5 text-purple-500" />;
		default:
			return <FileText className="w-5 h-5 text-gray-500" />;
	}
};

export function NotificationsDropdown() {
	const {
		notifications,
		unreadCount,
		isLoading,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		isMarkingAsRead,
		isMarkingAllAsRead,
		isDeleting,
	} = useNotifications();

	const formatTime = (dateString: string): string => {
		try {
			if (!dateString || typeof dateString !== 'string') {
				return 'fecha inválida';
			}
			const date = new Date(dateString);
			if (Number.isNaN(date.getTime())) {
				return 'fecha inválida';
			}
			const now = new Date();
			const diff = now.getTime() - date.getTime();
			const minutes = Math.floor(diff / 60000);
			const hours = Math.floor(minutes / 60);

			if (minutes < 60) return `hace ${minutes}m`;
			if (hours < 24) return `hace ${hours}h`;
			return date.toLocaleDateString('es-ES');
		} catch {
			return 'fecha inválida';
		}
	};

	const handleMarkAsRead = (
		notificationId: string | number,
		e: React.MouseEvent,
	): void => {
		e.preventDefault();
		e.stopPropagation();
		const id = String(notificationId);
		if (!id || id === 'undefined') {
			return;
		}
		markAsRead(id);
	};

	const handleDeleteNotification = (
		notificationId: string | number,
		e: React.MouseEvent,
	): void => {
		e.preventDefault();
		e.stopPropagation();
		const id = String(notificationId);
		if (!id || id === 'undefined') {
			return;
		}
		deleteNotification(id);
	};

	// Crear items del dropdown
	const dropdownItems = [
		{
			key: 'header',
			content: (
				<div className="flex justify-between items-center w-full">
					<div>
						<p className="font-semibold">Notificaciones</p>
						<p className="text-tiny text-default-500">{unreadCount} sin leer</p>
					</div>
					{unreadCount > 0 && (
						<Button
							size="sm"
							variant="light"
							onPress={() => markAllAsRead()}
							className="text-primary"
							isLoading={isMarkingAllAsRead}
						>
							Marcar todas como leídas
						</Button>
					)}
				</div>
			),
		},
		...(notifications.length === 0
			? [
					{
						key: 'empty',
						content: (
							<p className="text-center text-default-500 py-4">
								No hay notificaciones
							</p>
						),
					},
				]
			: []),
		...notifications.map((notification) => {
			const truncatedResumen = truncateText(notification.resumen ?? '');
			const notificationId = notification.id ?? '';

			return {
				key: notificationId || 'unknown',
				textValue: notificationId,
				content: (
					<div className="flex gap-3 w-full">
						<div className="flex-shrink-0 mt-0.5">
							{getNotificationIcon(notification.type ?? 'info')}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-start gap-2">
								<p
									className={`text-sm truncate ${notification.visto ? 'font-medium' : 'font-semibold'}`}
									title={notification.asunto ?? ''}
								>
									{notification.asunto ?? 'Sin asunto'}
								</p>
								{!notification.visto && (
									<span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
								)}
							</div>
							<p
								className="text-tiny text-default-600 mt-1 line-clamp-2"
								title={notification.resumen ?? ''}
							>
								{truncatedResumen}
							</p>
							<div className="flex justify-between items-center mt-2">
								<p className="text-tiny text-default-400">
									{formatTime(notification.fechaCreacion ?? '')}
								</p>
								<div className="flex gap-2">
									{!notification.visto && (
										<button
											type="button"
											onClick={(e) => handleMarkAsRead(notificationId, e)}
											className="text-sm text-primary hover:underline disabled:opacity-50 cursor-pointer px-3 py-1.5 rounded hover:bg-default-200"
											disabled={isMarkingAsRead}
											aria-label="Marcar como leída"
										>
											{isMarkingAsRead ? 'Marcando...' : 'Marcar como leída'}
										</button>
									)}
									<button
										type="button"
										onClick={(e) => handleDeleteNotification(notificationId, e)}
										className="text-sm text-primary hover:underline flex items-center gap-1.5 disabled:opacity-50 cursor-pointer px-3 py-1.5 rounded hover:bg-default-200"
										disabled={isDeleting}
										title="Eliminar notificación"
										aria-label="Eliminar notificación"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				),
			};
		}),
	];

	if (isLoading) {
		return (
			<Button isIconOnly variant="light" size="md" className="relative">
				<Spinner size="sm" />
			</Button>
		);
	}

	return (
		<Dropdown placement="bottom-end" closeOnSelect={false}>
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
				className="w-80 max-h-96 overflow-y-auto scrollbar-hide"
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
								onPress={() => markAllAsRead()}
								className="text-primary"
								isLoading={isMarkingAllAsRead}
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
				) : null}
				{notifications.map((notification) => (
					<DropdownItem
						key={item.key}
						textValue={item.key === 'header' ? 'header' : item.key}
						className={
							item.key === 'header'
								? 'h-14 gap-2 data-[hover=true]:bg-transparent cursor-default'
								: 'h-auto py-3 data-[hover=true]:bg-default-100 cursor-default'
						}
						isReadOnly
					>
						<div className="flex gap-3 w-full relative">
							<div className="flex-shrink-0 mt-0.5">
								{getNotificationIcon(notification.type)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-start gap-2">
									<p
										className={`text-sm truncate ${notification.visto === false ? 'font-semibold' : 'font-medium'}`}
									>
										{notification.asunto}
									</p>
									{notification.visto === false && (
										<span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
									)}
								</div>
								<p className="text-tiny text-default-600 mt-1">
									{notification.resumen}
								</p>
								<div className="flex justify-between items-center mt-2">
									<p className="text-tiny text-default-400">
										{formatTime(notification.fechaCreacion)}
									</p>
									<div className="flex gap-1">
										{notification.visto === false && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													markAsRead(notification.id);
												}}
												className="text-xs text-primary hover:underline"
												disabled={isMarkingAsRead}
											>
												{isMarkingAsRead ? 'Marcando...' : 'Marcar como leída'}
											</button>
										)}
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												deleteNotification(notification.id);
											}}
											className="text-xs text-primary hover:underline flex items-center gap-1"
											disabled={isDeleting}
											title="Eliminar notificación"
										>
											<Trash2 className="w-3 h-3" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
