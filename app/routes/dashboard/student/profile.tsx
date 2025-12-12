// app/routes/dashboard/student/profile.tsx
import { Chip, Input } from '@heroui/react';
import { ProfilePage } from '~/components/profile';
import { useProfile } from '~/lib/hooks/useProfile';
import { getProfile } from '~/lib/services/student.service';
import { useStudentProfileForm } from './hooks/useStudentProfileForm';
import { useStudentProfileSave } from './hooks/useStudentProfileSave';

export default function StudentProfile() {
	const profileData = useProfile({
		role: 'student',
		getProfileFn: getProfile,
		useFormHook: useStudentProfileForm,
		useSaveHook: useStudentProfileSave,
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
	});

	const { profile, setProfile, isEditing } = profileData;

	return (
		<ProfilePage
			{...profileData}
			roleReadOnly={true}
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
	);
}
