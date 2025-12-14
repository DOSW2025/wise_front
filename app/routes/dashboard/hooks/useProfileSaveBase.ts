import { useState } from 'react';

/**
 * Hook genérico para guardar perfil
 * Proporciona la lógica común de guardado de perfil para diferentes tipos de usuarios
 */
export function useProfileSaveBase() {
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const clearMessages = () => {
		setError(null);
		setSuccess(null);
	};

	const handleSuccess = (
		message: string = 'Perfil actualizado exitosamente',
	) => {
		setSuccess(message);
		setTimeout(() => setSuccess(null), 3000);
	};

	const handleError = (
		err: unknown,
		defaultMessage: string = 'Error al guardar el perfil',
	) => {
		let errorMessage = defaultMessage;

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
	};

	const saveProfile = async <T>(
		saveFunction: (data: T) => Promise<void>,
		profileData: T,
	): Promise<boolean> => {
		clearMessages();
		setIsSaving(true);

		try {
			await saveFunction(profileData);
			handleSuccess();
			return true;
		} catch (err) {
			handleError(err);
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const changePassword = async (): Promise<boolean> => {
		try {
			// TODO: Implementar cambio de contraseña cuando esté disponible en el backend
			await new Promise((resolve) => setTimeout(resolve, 1000));
			handleSuccess('Contraseña actualizada exitosamente');
			return true;
		} catch {
			handleError(undefined, 'Error al cambiar la contraseña');
			return false;
		}
	};

	return {
		isSaving,
		error,
		success,
		setError,
		clearMessages,
		saveProfile,
		changePassword,
	};
}
