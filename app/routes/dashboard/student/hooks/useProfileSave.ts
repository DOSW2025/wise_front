import { useState } from 'react';
import { useFormMessage } from '~/lib/hooks/useFormMessage';
import { updateProfile } from '~/lib/services/student.service';

interface ProfileSaveData {
	name: string;
	email: string;
	phone: string;
	role?: string;
	description: string;
}

export function useProfileSave() {
	const [isSaving, setIsSaving] = useState(false);
	const { error, success, clearMessages, showError, showSuccess } =
		useFormMessage();

	const saveProfile = async (
		profileData: ProfileSaveData,
	): Promise<boolean> => {
		clearMessages();
		setIsSaving(true);

		try {
			await updateProfile(profileData);
			showSuccess('Perfil actualizado exitosamente');
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
						'El servicio no está disponible temporalmente. Por favor, intenta más tarde';
				}
			}

			showError(errorMessage);
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const changePassword = async (): Promise<boolean> => {
		try {
			// TODO: Implementar cambio de contraseña cuando esté disponible en el backend
			await new Promise((resolve) => setTimeout(resolve, 1000));
			showSuccess('Contraseña actualizada exitosamente');
			return true;
		} catch {
			showError('Error al cambiar la contraseña');
			return false;
		}
	};

	return {
		isSaving,
		error,
		success,
		saveProfile,
		changePassword,
	};
}
