import { Card, CardBody } from '@heroui/react';
import { useState } from 'react';
import { StatsCard } from '~/components';
import { ProfileContainer } from '~/components/profile/ProfileContainer';
import { useProfileManager } from '~/lib/hooks/useProfileManager';
import { getAdminProfile } from '~/lib/services/admin.service';
import { useAdminProfileForm } from './hooks/useAdminProfileForm';
import { useAdminProfileSave } from './hooks/useProfileSave';

export default function AdminProfile() {
	const [emailNotifications, setEmailNotifications] = useState(true);

	const {
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		isSaving,
		error,
		success,
		isLoadingProfile,
		handleSave,
		handleImageChange,
		handleCancel,
	} = useProfileManager({
		initialProfile: {
			name: '',
			email: '',
			phone: '',
			role: '',
			description: '',
			avatarUrl: undefined,
		},
		getProfileFn: getAdminProfile,
		saveProfileFn: async (data) => data,
		useFormHook: useAdminProfileForm,
		useSaveHook: useAdminProfileSave,
	});

	return (
		<>
			<ProfileContainer
				title="Mi Perfil de Administrador"
				description="Gestiona tu información personal y configuración de administrador"
				profile={profile}
				setProfile={setProfile}
				formErrors={formErrors}
				setFormErrors={setFormErrors}
				isEditing={isEditing}
				isSaving={isSaving}
				error={error}
				success={success}
				avatarPreview={avatarPreview}
				isLoadingProfile={isLoadingProfile}
				onEdit={() => setIsEditing(true)}
				onSave={handleSave}
				onCancel={handleCancel}
				onImageChange={handleImageChange}
				descriptionLabel="Biografía"
				descriptionPlaceholder="Describe tu rol y responsabilidades como administrador..."
				showRoleField={true}
				emailNotifications={emailNotifications}
				onEmailNotificationsChange={setEmailNotifications}
			/>

			{/* Estadísticas del Sistema */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Estadísticas del Sistema</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Usuarios Activos"
							value={0}
							description="Total"
							color="primary"
						/>
						<StatsCard
							title="Tutorías Realizadas"
							value={0}
							description="Este mes"
							color="success"
						/>
						<StatsCard
							title="Materiales Publicados"
							value={0}
							description="Total"
							color="warning"
						/>
						<StatsCard
							title="Tasa de Aprobación"
							value="0%"
							description="General"
							color="default"
						/>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
