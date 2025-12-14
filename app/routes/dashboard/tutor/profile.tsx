import { Button, Chip } from '@heroui/react';
import { useTutorProfileSave } from 'app/routes/dashboard/tutor/hooks/useTutorProfileSave';
import { useTutorProfileForm } from 'app/routes/dashboard/tutor/hooks/usetutorprofileForm';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProfileContainer } from '~/components/profile';
import { useProfileManager } from '~/lib/hooks/useProfileManager';
import { getProfile } from '~/lib/services/tutor.service';

export default function TutorProfile() {
	const navigate = useNavigate();
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
			availability: {
				monday: false,
				tuesday: false,
				wednesday: false,
				thursday: false,
				friday: false,
				saturday: false,
				sunday: false,
			},
		},
		getProfileFn: getProfile,
		saveProfileFn: async (data) => data,
		useFormHook: useTutorProfileForm,
		useSaveHook: useTutorProfileSave,
	});

	const daysOfWeek = [
		{ key: 'monday', label: 'Lunes' },
		{ key: 'tuesday', label: 'Martes' },
		{ key: 'wednesday', label: 'Miércoles' },
		{ key: 'thursday', label: 'Jueves' },
		{ key: 'friday', label: 'Viernes' },
		{ key: 'saturday', label: 'Sábado' },
		{ key: 'sunday', label: 'Domingo' },
	] as const;

	return (
		<>
			<ProfileContainer
				title="Mi Perfil"
				description="Gestiona tu información personal y configuración"
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
				descriptionLabel="Descripción Profesional"
				descriptionPlaceholder="Cuéntanos sobre tu experiencia y especialidades..."
				showRoleField={true}
				emailNotifications={emailNotifications}
				onEmailNotificationsChange={setEmailNotifications}
				additionalSections={
					<>
						{/* Disponibilidad Semanal */}
						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg hover:bg-default-100 transition-colors">
							<div className="flex-1">
								<p className="font-medium">Disponibilidad Semanal</p>
								<p className="text-sm text-default-500">
									Configura los días en que estás disponible
								</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{daysOfWeek.map(
										({ key, label }) =>
											profile.availability[key] && (
												<Chip
													key={key}
													size="sm"
													color="success"
													variant="flat"
												>
													{label}
												</Chip>
											),
									)}
								</div>
							</div>
							<Button
								color="primary"
								variant="bordered"
								onPress={() =>
									navigate('/dashboard/tutor/scheduled?tab=availability')
								}
							>
								Configurar
							</Button>
						</div>
					</>
				}
			/>
		</>
	);
}
