// components/profile/ProfilePage.tsx

import { ProfileStats } from 'app/components/profile/ProfileStats';
import type { BaseProfileData } from '~/lib/hooks/useProfileFormBase';
import { ProfileContainer } from './ProfileContainer';

interface ProfilePageProps<T extends BaseProfileData> {
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
	emailNotifications: boolean;
	onEmailNotificationsChange: (value: boolean) => void;
	config: {
		title: string;
		description: string;
		descriptionLabel: string;
		descriptionPlaceholder: string;
		statsTitle: string;
		stats: Array<{
			title: string;
			value: number | string;
			description: string;
			color: 'primary' | 'success' | 'warning' | 'default';
		}>;
	};
	additionalFields?: React.ReactNode;
	additionalSections?: React.ReactNode;
	showRoleField?: boolean;
	roleReadOnly?: boolean;
}

export function ProfilePage<T extends BaseProfileData>({
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
	emailNotifications,
	onEmailNotificationsChange,
	config,
	additionalFields,
	additionalSections,
	showRoleField = true,
	roleReadOnly = true,
}: ProfilePageProps<T>) {
	return (
		<>
			<ProfileContainer
				title={config.title}
				description={config.description}
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
				onEdit={onEdit}
				onSave={onSave}
				onCancel={onCancel}
				onImageChange={onImageChange}
				descriptionLabel={config.descriptionLabel}
				descriptionPlaceholder={config.descriptionPlaceholder}
				showRoleField={showRoleField}
				roleReadOnly={roleReadOnly}
				emailNotifications={emailNotifications}
				onEmailNotificationsChange={onEmailNotificationsChange}
				additionalFields={additionalFields}
				additionalSections={additionalSections}
			/>

			<ProfileStats title={config.statsTitle} stats={config.stats} />
		</>
	);
}
