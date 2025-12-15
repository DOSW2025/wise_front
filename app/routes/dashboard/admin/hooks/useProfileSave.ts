import { updateAdminProfile } from '~/lib/services/admin.service';
import { useProfileSaveBase } from '../../hooks/useProfileSaveBase';

export interface AdminProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
}

/**
 * Hook para manejar el guardado del perfil de administrador
 */
export function useAdminProfileSave() {
	const baseHook = useProfileSaveBase();

	const saveProfile = async (
		profileData: AdminProfileSaveData,
	): Promise<boolean> => {
		return baseHook.saveProfile(updateAdminProfile, profileData);
	};

	return {
		...baseHook,
		saveProfile,
	};
}
