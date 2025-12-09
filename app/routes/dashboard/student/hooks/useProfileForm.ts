import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	avatar?: string;
	interests: string[];
	//career: string;
	semester: string;
}

export function useProfileForm(initialProfile: ProfileData) {
	return useProfileFormBase(initialProfile);
}
