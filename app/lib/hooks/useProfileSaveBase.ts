import { useState } from 'react';

interface ProfileSaveConfig<T> {
	updateFn: (data: T) => Promise<any>;
	successMessage?: string;
	errorMessage?: string;
}

export function useProfileSaveBase<T>({
	updateFn,
	successMessage = 'Perfil actualizado exitosamente',
	errorMessage = 'Error al guardar el perfil',
}: ProfileSaveConfig<T>) {
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveProfile = async (profileData: T): Promise<boolean> => {
		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			await updateFn(profileData);
			setSuccess(successMessage);
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			let finalErrorMessage = errorMessage;

			if (err instanceof Error) {
				finalErrorMessage = err.message;

				if (
					finalErrorMessage.includes('Cannot PATCH') ||
					finalErrorMessage.includes('Cannot PUT') ||
					finalErrorMessage.includes('404') ||
					finalErrorMessage.includes('Not Found') ||
					finalErrorMessage.includes('no está disponible')
				) {
					finalErrorMessage =
						'El endpoint de actualización de perfil no está disponible en el backend. Por favor, contacta al equipo de desarrollo.';
				}
			}

			setError(finalErrorMessage);
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
