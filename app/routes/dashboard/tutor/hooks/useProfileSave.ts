import { useState } from 'react';
import { updateProfile } from '~/lib/services/tutor.service';

interface ProfileSaveData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
}

export function useProfileSave() {
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveProfile = async (
		profileData: ProfileSaveData,
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
					errorMessage.includes('Cannot PUT') ||
					errorMessage.includes('404') ||
					errorMessage.includes('Not Found')
				) {
					errorMessage =
						'El servicio no está disponible temporalmente. Por favor, intenta más tarde.';
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
			// TODO: Implementar el cambio de contraseña cuando el endpoint de backend esté disponible
			// Simular llamada a API
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess('Contraseña actualizada exitosamente');
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			// En este mock no usamos el error específico, pero mantenemos consistencia con saveProfile
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
