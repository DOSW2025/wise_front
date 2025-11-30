import { Button, Divider, Switch } from '@heroui/react';

interface ConfigurationSectionProps {
	emailNotifications: boolean;
	onEmailNotificationsChange: (value: boolean) => void;
	emailNotificationsDescription?: string;
	children?: React.ReactNode;
}

export function ProfileConfigurationSection({
	emailNotifications,
	onEmailNotificationsChange,
	emailNotificationsDescription = 'Recibe notificaciones de nuevas tutorías y materiales',
	children,
}: ConfigurationSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg">
				<div className="flex-1">
					<p className="font-medium">Notificaciones por Email</p>
					<p className="text-sm text-default-500">
						{emailNotificationsDescription}
					</p>
				</div>
				<Switch
					isSelected={emailNotifications}
					onValueChange={onEmailNotificationsChange}
					color="success"
				/>
			</div>

			{children}
		</div>
	);
}
