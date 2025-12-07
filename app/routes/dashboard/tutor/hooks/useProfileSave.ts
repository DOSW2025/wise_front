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
						'El endpoint de actualización de perfil no está disponible en el backend. Por favor, contacta al equipo de desarrollo.';
				}
			}

			setError(errorMessage);
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	return {
		isSaving,
		error,
		success,
		setError,
		saveProfile,
	};
}
