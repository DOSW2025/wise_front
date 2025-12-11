import { Input, Textarea } from '@heroui/react';
import { Mail, Phone } from 'lucide-react';
import type { FormErrors } from '~/lib/hooks/useProfileFormBase';

interface BaseProfileData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
}

interface ProfileFormFieldsProps<T extends BaseProfileData> {
	profile: T;
	isEditing: boolean;
	formErrors: FormErrors;
	onProfileChange: (profile: T) => void;
	onErrorClear: (field: keyof FormErrors) => void;
	nameReadOnly?: boolean;
	emailReadOnly?: boolean;
	nameDescription?: string;
	emailDescription?: string;
	descriptionLabel?: string;
	descriptionPlaceholder?: string;
	children?: React.ReactNode;
}

export function ProfileFormFields<T extends BaseProfileData>({
	profile,
	isEditing,
	formErrors,
	onProfileChange,
	onErrorClear,
	nameReadOnly = true,
	emailReadOnly = true,
	nameDescription = 'No se puede modificar',
	emailDescription = 'No se puede modificar',
	descriptionLabel = 'Sobre Mí',
	descriptionPlaceholder = 'Cuéntanos sobre tus intereses y objetivos...',
	children,
}: ProfileFormFieldsProps<T>) {
	return (
		<div className="flex-1 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Nombre Completo"
					placeholder="Ingresa tu nombre completo"
					value={profile.name}
					onValueChange={(value) => {
						onProfileChange({ ...profile, name: value });
						onErrorClear('name');
					}}
					isReadOnly={nameReadOnly || !isEditing}
					variant={isEditing && !nameReadOnly ? 'bordered' : 'flat'}
					isInvalid={!!formErrors.name}
					errorMessage={formErrors.name}
					isRequired
					description={nameReadOnly ? nameDescription : undefined}
				/>
				<Input
					label="Correo Electrónico"
					placeholder="tu@email.com"
					type="email"
					value={profile.email}
					onValueChange={(value) => {
						onProfileChange({ ...profile, email: value });
						onErrorClear('email');
					}}
					isReadOnly={emailReadOnly || !isEditing}
					variant={isEditing && !emailReadOnly ? 'bordered' : 'flat'}
					isInvalid={!!formErrors.email}
					errorMessage={formErrors.email}
					startContent={<Mail className="w-4 h-4 text-default-400" />}
					isRequired
					description={emailReadOnly ? emailDescription : undefined}
				/>
				<Input
					label="Teléfono"
					placeholder="+57 300 123 4567"
					type="tel"
					value={profile.phone}
					onValueChange={(value) => {
						onProfileChange({ ...profile, phone: value });
						onErrorClear('phone');
					}}
					isReadOnly={!isEditing}
					variant={isEditing ? 'bordered' : 'flat'}
					isInvalid={!!formErrors.phone}
					errorMessage={formErrors.phone}
					startContent={<Phone className="w-4 h-4 text-default-400" />}
				/>
				{/*
				<Input
					label="Role"
					placeholder="Tu rol en la plataforma"
					value={profile.role}
					onValueChange={(value) => {
						onProfileChange({ ...profile, role: value });
						onErrorClear('role');
					}}
					isReadOnly={!isEditing}
					variant={isEditing ? 'bordered' : 'flat'}
					startContent={<MapPin className="w-4 h-4 text-default-400" />}
				/>
	*/}
				{children}
			</div>

			<Textarea
				label={descriptionLabel}
				placeholder={descriptionPlaceholder}
				value={profile.description}
				onValueChange={(value) => {
					onProfileChange({ ...profile, description: value });
					onErrorClear('description');
				}}
				isReadOnly={!isEditing}
				variant={isEditing ? 'bordered' : 'flat'}
				minRows={3}
				maxRows={6}
				isInvalid={!!formErrors.description}
				errorMessage={formErrors.description}
				description={
					isEditing ? `${profile.description.length}/500 caracteres` : undefined
				}
			/>
		</div>
	);
}
