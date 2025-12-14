import { Card, CardBody, Chip, Input } from '@heroui/react';
import { useState } from 'react';
import { StatsCard } from '~/components';
import { ProfileContainer } from '~/components/profile';
import { useProfileManager } from '~/lib/hooks/useProfileManager';
import { getProfile } from '~/lib/services/student.service';
import { useStudentProfileForm } from './hooks/useStudentProfileForm';
import { useStudentProfileSave } from './hooks/useStudentProfileSave';

export default function StudentProfile() {
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
			interests: [],
			semester: '',
		},
		getProfileFn: getProfile,
		saveProfileFn: async (data) => data,
		useFormHook: useStudentProfileForm,
		useSaveHook: useStudentProfileSave,
	});

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
				descriptionLabel="Sobre Mí"
				descriptionPlaceholder="Cuéntanos sobre tus intereses y objetivos..."
				showRoleField={true}
				emailNotifications={emailNotifications}
				onEmailNotificationsChange={setEmailNotifications}
				additionalFields={
					<Input
						label="Semestre"
						placeholder="7"
						value={profile.semester}
						isReadOnly={true}
						variant="flat"
						description="No se puede modificar"
					/>
				}
				additionalSections={
					<div className="space-y-2">
						<span className="text-sm font-medium block">Áreas de Interés</span>
						<div className="flex flex-wrap gap-2">
							{profile.interests && profile.interests.length > 0 ? (
								profile.interests.map((interest: string) => (
									<Chip
										key={interest}
										onClose={
											isEditing
												? () =>
														setProfile({
															...profile,
															interests:
																profile.interests?.filter(
																	(i: string) => i !== interest,
																) || [],
														})
												: undefined
										}
										variant="flat"
										color="primary"
									>
										{interest}
									</Chip>
								))
							) : (
								<p className="text-sm text-default-500">
									No has agregado áreas de interés
								</p>
							)}
							{isEditing && (
								<Chip
									variant="bordered"
									className="cursor-pointer"
									onClick={() => {
										const newInterest = prompt('Ingresa un área de interés:');
										if (newInterest) {
											setProfile({
												...profile,
												interests: [...(profile.interests || []), newInterest],
											});
										}
									}}
								>
									+ Agregar
								</Chip>
							)}
						</div>
					</div>
				}
			/>

			{/* Estadísticas */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Mis Estadísticas</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Tutorías Tomadas"
							value={0}
							description="Total"
							color="primary"
						/>
						<StatsCard
							title="Horas de Estudio"
							value={0}
							description="Este mes"
							color="success"
						/>
						<StatsCard
							title="Materias Cursando"
							value={0}
							description="Activas"
							color="warning"
						/>
						<StatsCard
							title="Progreso General"
							value="0%"
							description="Avance"
							color="default"
						/>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
