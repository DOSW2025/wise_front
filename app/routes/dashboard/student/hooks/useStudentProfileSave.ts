import { updateProfile } from '~/lib/services/student.service';
import { useProfileSaveBase } from '../../hooks/useProfileSaveBase';

export interface StudentProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
	interests: string[];
	semester: string;
}

export function useStudentProfileSave() {
	const baseHook = useProfileSaveBase();

	const saveProfile = async (
		profileData: StudentProfileSaveData,
	): Promise<boolean> => {
		return baseHook.saveProfile(updateProfile, profileData);
	};

	return {
		...baseHook,
		saveProfile,
	};
}
