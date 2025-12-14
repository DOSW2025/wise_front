import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface TutorProfileData {
	name: string;
	email: string;
	phone: string;
	role?: string;
	description: string;
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
}

/**
 * Hook personalizado para el formulario de perfil de tutor
 * Utiliza el hook base compartido pero con la interfaz específica de tutor
 * que incluye el campo adicional de availability (disponibilidad semanal)
 */
export function useTutorProfileForm(initialProfile: TutorProfileData) {
	const baseHook = useProfileFormBase<TutorProfileData>(initialProfile);

	const toggleDay = (day: keyof TutorProfileData['availability']) => {
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
