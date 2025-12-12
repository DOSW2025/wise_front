import { useProfileSaveBase } from '~/lib/hooks/useProfileSaveBase';
import { updateProfile } from '~/lib/services/student.service';

interface StudentProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role?: string;
	description: string;
	interests?: string[];
	semester?: string;
}

/**
 * Hook para manejar el guardado del perfil de estudiante
 */
export function useStudentProfileSave() {
	return useProfileSaveBase<StudentProfileSaveData>({
		updateFn: updateProfile,
	});
}
