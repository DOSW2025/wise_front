import { useState } from 'react';

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
		_profileData: ProfileSaveData,
	): Promise<boolean> => {
		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			// Simular llamada a API para guardar perfil
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess('Perfil actualizado exitosamente');
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Error al guardar el perfil';
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
