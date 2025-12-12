// app/routes/dashboard/admin/profile.tsx
import { ProfilePage } from '~/components/profile';
import { useProfile } from '~/lib/hooks/useProfile';
import { getAdminProfile } from '~/lib/services/admin.service';
import { useAdminProfileForm } from './hooks/useAdminProfileForm';
import { useAdminProfileSave } from './hooks/useAdminProfileSave';

export default function AdminProfile() {
	const profileData = useProfile({
		role: 'admin',
		getProfileFn: getAdminProfile,
		useFormHook: useAdminProfileForm,
		useSaveHook: useAdminProfileSave,
		initialProfile: {
			name: '',
			email: '',
			phone: '',
			role: 'administrador',
			description: '',
			avatarUrl: undefined,
		},
	});

	return <ProfilePage {...profileData} roleReadOnly={true} />;
}
