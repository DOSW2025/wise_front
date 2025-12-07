import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	avatar?: string;
	department: string;
	role: string;
}

export function useProfileForm(initialProfile: ProfileData) {
	return useProfileFormBase(initialProfile);
}
