import { useSaveProfileAction } from '~/lib/hooks/useSaveProfileAction';
import { updateProfile } from '~/lib/services/tutor.service';

interface ProfileSaveData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
}

const handleTutorError = (message: string): string => {
	if (
		message.includes('Cannot PUT') ||
		message.includes('404') ||
		message.includes('Not Found')
	) {
		return 'El servicio no está disponible temporalmente. Por favor, intenta más tarde';
	}
	return message;
};

export function useProfileSave() {
	return useSaveProfileAction<ProfileSaveData>(updateProfile, {
		onSaveError: handleTutorError,
	});
}
