import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface AdminProfileData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
	avatarUrl?: string;
}

/**
 * Hook personalizado para el formulario de perfil de administrador
 * Utiliza el hook base compartido pero con la interfaz específica de admin
 *
 * Este hook extiende BaseProfileData y es compatible con useProfileFormBase
 */
export function useAdminProfileForm(initialProfile: AdminProfileData) {
	return useProfileFormBase<AdminProfileData>(initialProfile);
}
