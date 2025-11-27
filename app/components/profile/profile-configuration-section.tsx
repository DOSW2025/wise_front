import { Button, Divider, Switch } from '@heroui/react';

interface ConfigurationSectionProps {
	onPasswordChange: () => void;
	emailNotifications: boolean;
	onEmailNotificationsChange: (value: boolean) => void;
	emailNotificationsDescription?: string;
	children?: React.ReactNode;
}

export function ProfileConfigurationSection({
	onPasswordChange,
	emailNotifications,
	onEmailNotificationsChange,
	emailNotificationsDescription = 'Recibe notificaciones de nuevas tutorías y materiales',
	children,
}: ConfigurationSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg hover:bg-default-100 transition-colors">
				<div className="flex-1">
					<p className="font-medium">Cambiar Contraseña</p>
					<p className="text-sm text-default-500">
						Actualiza tu contraseña de acceso
					</p>
				</div>
				<Button color="primary" variant="bordered" onPress={onPasswordChange}>
					Cambiar
				</Button>
			</div>

			<Divider />

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
