import { Card, CardBody } from '@heroui/react';
import { AlertMessage, ProfileAvatar } from '~/components';
import {
	ProfileConfigurationSection,
	ProfileEditButtons,
	ProfileFormFields,
	ProfileHeader,
} from '~/components/profile';
import type { BaseProfileData } from '~/lib/hooks/useProfileFormBase';

interface ProfileContainerProps<T extends BaseProfileData> {
	title: string;
	description: string;
	profile: T;
	setProfile: (profile: T) => void;
	formErrors: any;
	setFormErrors: (errors: any) => void;
	isEditing: boolean;
	isSaving: boolean;
	error: string | null;
	success: string | null;
	avatarPreview: string | null;
	isLoadingProfile: boolean;
	onEdit: () => void;
	onSave: () => void;
	onCancel: () => void;
	onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	descriptionLabel?: string;
	descriptionPlaceholder?: string;
	showRoleField?: boolean;
	roleReadOnly?: boolean;
	additionalFields?: React.ReactNode;
	additionalSections?: React.ReactNode;
	emailNotifications?: boolean;
	onEmailNotificationsChange?: (value: boolean) => void;
}

/**
 * Componente contenedor genérico para perfiles
 * Reduce duplicación de código entre diferentes tipos de perfil
 */
function ProfileContainer<T extends BaseProfileData>({
	title,
	description,
	profile,
	setProfile,
	formErrors,
	setFormErrors,
	isEditing,
	isSaving,
	error,
	success,
	avatarPreview,
	isLoadingProfile,
	onEdit,
	onSave,
	onCancel,
	onImageChange,
	descriptionLabel = 'Sobre Mí',
	descriptionPlaceholder = 'Cuéntanos sobre ti...',
	showRoleField = true,
	roleReadOnly,
	additionalFields,
	additionalSections,
	emailNotifications = true,
	onEmailNotificationsChange,
}: ProfileContainerProps<T>) {
	// Mostrar loading mientras carga el perfil
	if (isLoadingProfile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-lg">Cargando perfil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<ProfileHeader title={title} description={description} />

			{/* Mensajes de error y éxito */}
			{error && <AlertMessage message={error} type="error" />}
			{success && <AlertMessage message={success} type="success" />}

			{/* Información Personal */}
			<Card>
				<CardBody className="gap-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Información Personal</h2>
						<ProfileEditButtons
							isEditing={isEditing}
							isSaving={isSaving}
							onEdit={onEdit}
							onSave={onSave}
							onCancel={onCancel}
						/>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<ProfileAvatar
							src={profile.avatarUrl}
							name={profile.name}
							isEditing={isEditing}
							onImageChange={onImageChange}
							preview={avatarPreview}
						/>
						<ProfileFormFields
							profile={profile}
							isEditing={isEditing}
							formErrors={formErrors}
							onProfileChange={setProfile}
							onErrorClear={(field) =>
								setFormErrors({ ...formErrors, [field]: undefined })
							}
							nameReadOnly={true}
							emailReadOnly={true}
							showRoleField={showRoleField}
							roleReadOnly={roleReadOnly}
							roleDescription="No se puede modificar"
							descriptionLabel={descriptionLabel}
							descriptionPlaceholder={descriptionPlaceholder}
						>
							{additionalFields}
						</ProfileFormFields>
					</div>

					{additionalSections}
				</CardBody>
			</Card>

			{/* Configuración */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Configuración de Cuenta</h2>
					<ProfileConfigurationSection
						emailNotifications={emailNotifications}
						onEmailNotificationsChange={
							onEmailNotificationsChange || (() => {})
						}
						emailNotificationsDescription="Recibe notificaciones importantes del sistema"
					/>
				</CardBody>
			</Card>
		</div>
	);
}

// Named export al final del archivo
export { ProfileContainer };
