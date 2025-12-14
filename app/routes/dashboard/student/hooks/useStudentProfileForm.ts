import { useProfileFormBase } from '~/lib/hooks/useProfileFormBase';

interface StudentProfileData {
	name: string;
	email: string;
	phone: string;
	role?: string;
	description: string;
	avatarUrl?: string;
	interests?: string[];
	semester?: string;
}

/**
 * Hook personalizado para el formulario de perfil de estudiante
 * Utiliza el hook base compartido pero con la interfaz específica de estudiante
 * que incluye campos adicionales como interests y semester
 */
export function useStudentProfileForm(initialProfile: StudentProfileData) {
	return useProfileFormBase<StudentProfileData>(initialProfile);
}
