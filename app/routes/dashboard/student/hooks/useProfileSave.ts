import { useSaveProfileAction } from '~/lib/hooks/useSaveProfileAction';
import { updateProfile } from '~/lib/services/student.service';

interface ProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role?: string;
	description: string;
}

const handleStudentError = (message: string): string => {
	if (
		message.includes('Cannot PATCH') ||
		message.includes('Cannot PUT') ||
		message.includes('404') ||
		message.includes('Not Found') ||
		message.includes('no está disponible')
	) {
		return 'El servicio no está disponible temporalmente. Por favor, intenta más tarde';
	}
	return message;
};

export function useProfileSave() {
	return useSaveProfileAction<ProfileSaveData>(updateProfile, {
		onSaveError: handleStudentError,
	});
}
