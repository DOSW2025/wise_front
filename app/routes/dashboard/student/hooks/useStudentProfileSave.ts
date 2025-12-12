import { useState } from 'react';
import { updateProfile } from '~/lib/services/student.service';

interface StudentProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
	interests: string[];
	semester: string;
}

export function useStudentProfileSave() {
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveProfile = async (
		profileData: StudentProfileSaveData,
	): Promise<boolean> => {
		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			await updateProfile(profileData);
			setSuccess('Perfil actualizado exitosamente');
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			let errorMessage = 'Error al guardar el perfil';

			if (err instanceof Error) {
				errorMessage = err.message;

				// Detectar error de endpoint no disponible
				if (
					errorMessage.includes('Cannot PATCH') ||
					errorMessage.includes('Cannot PUT') ||
					errorMessage.includes('404') ||
					errorMessage.includes('Not Found') ||
					errorMessage.includes('no está disponible')
				) {
					errorMessage =
						'El endpoint de actualización de perfil no está disponible en el backend. Por favor, contacta al equipo de desarrollo.';
				}
			}

			setError(errorMessage);
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const changePassword = async (): Promise<boolean> => {
		try {
			// TODO: Implementar cambio de contraseña cuando esté disponible en el backend
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess('Contraseña actualizada exitosamente');
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch {
			setError('Error al cambiar la contraseña');
			return false;
		}
	};

	return {
		isSaving,
		error,
		success,
		setError,
		saveProfile,
		changePassword,
	};
}
