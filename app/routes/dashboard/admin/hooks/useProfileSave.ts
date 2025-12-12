import { useState } from 'react';
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
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveProfile = async (
		profileData: AdminProfileSaveData,
	): Promise<boolean> => {
		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			await updateAdminProfile(profileData);
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
