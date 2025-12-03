import { Badge, Button } from '@heroui/react';
import { Bell, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface TopNavbarProps {
	onOpenChats?: () => void;
	onOpenNotifications?: () => void;
}

export function TopNavbar({
	onOpenChats,
	onOpenNotifications,
}: TopNavbarProps) {
	const [unreadChats] = useState(3);
	const [unreadNotifications] = useState(5);

	return (
		<div className="absolute top-0 right-0 left-0 lg:left-64 z-30 bg-background border-b border-divider shadow-sm">
			<div className="flex justify-end items-center h-16 px-4 lg:px-8">
				<div className="flex items-center gap-2">
					{/* Chat Button */}
					<div className="relative">
						<Button
							isIconOnly
							variant="light"
							size="lg"
							onPress={onOpenChats}
							className="relative"
						>
							<MessageSquare className="w-5 h-5" />
							{unreadChats > 0 && (
								<Badge
									content=""
									color="danger"
									size="md"
									className="absolute -top-1 -right-1"
								/>
							)}
						</Button>
					</div>

					{/* Notifications Button */}
					<div className="relative">
						<Button
							isIconOnly
							variant="light"
							size="lg"
							onPress={onOpenNotifications}
							className="relative"
						>
							<Bell className="w-5 h-5" />
							{unreadNotifications > 0 && (
								<Badge
									content=""
									color="danger"
									size="md"
									className="absolute -top-1 -right-1"
								/>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
