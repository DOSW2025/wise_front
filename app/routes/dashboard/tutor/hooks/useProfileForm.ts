import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	avatar?: string;
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
	hourlyRate: string;
}
// maneja disponiblilidad y otros campos específicos de tutores
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
