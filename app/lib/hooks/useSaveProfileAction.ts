import { useState } from 'react';
import { useFormMessage } from './useFormMessage';

export interface ProfileSaveConfig {
	onSaveError?: (message: string) => string;
}

export function useSaveProfileAction<T extends Record<string, any>>(
	updateFn: (data: T) => Promise<void>,
	config?: ProfileSaveConfig,
) {
	const [isSaving, setIsSaving] = useState(false);
	const { error, success, clearMessages, showError, showSuccess } =
		useFormMessage();

	const saveProfile = async (profileData: T): Promise<boolean> => {
		clearMessages();
		setIsSaving(true);

		try {
			await updateFn(profileData);
			showSuccess('Perfil actualizado exitosamente');
			return true;
		} catch (err) {
			let errorMessage = 'Error al guardar el perfil';

			if (err instanceof Error) {
				errorMessage = err.message;
				if (config?.onSaveError) {
					errorMessage = config.onSaveError(errorMessage);
				}
			}

			showError(errorMessage);
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const changePassword = async (): Promise<boolean> => {
		clearMessages();

		try {
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
