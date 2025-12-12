import { useProfileSaveBase } from '~/lib/hooks/useProfileSaveBase';
import { updateAdminProfile } from '~/lib/services/admin.service';

interface AdminProfileSaveData {
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
	return useProfileSaveBase<AdminProfileSaveData>({
		updateFn: updateAdminProfile,
	});
}
