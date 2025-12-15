import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	role: string;
	avatarUrl?: string;
	availability: {
		monday: boolean;
		tuesday: boolean;
		wednesday: boolean;
		thursday: boolean;
		friday: boolean;
		saturday: boolean;
		sunday: boolean;
	};
	subjects: string[];
}

export function useProfileForm(initialProfile: ProfileData) {
	const baseHook = useProfileFormBase(initialProfile);

	const toggleDay = (day: keyof ProfileData['availability']) => {
		baseHook.setProfile({
			...baseHook.profile,
			availability: {
				...baseHook.profile.availability,
				[day]: !baseHook.profile.availability[day],
			},
		});
	};

	return {
		...baseHook,
		toggleDay,
	};
}
