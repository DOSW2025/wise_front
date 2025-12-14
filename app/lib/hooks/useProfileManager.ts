import { useEffect, useState } from 'react';
import { useAuth } from '~/contexts/auth-context';

interface ProfileManagerConfig<T> {
	initialProfile: T;
	getProfileFn: () => Promise<T>;
	saveProfileFn: (data: any) => Promise<T>;
	useFormHook: (initial: T) => any;
	useSaveHook: () => any;
}

/**
 * Hook genérico para manejar la lógica común de perfiles
 * Elimina duplicación de código entre AdminProfile y StudentProfile
 */
export function useProfileManager<T extends Record<string, any>>({
	initialProfile,
	getProfileFn,
	saveProfileFn,
	useFormHook,
	useSaveHook,
}: ProfileManagerConfig<T>) {
	const { user } = useAuth();
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);

	// Usar los hooks personalizados
	const formHook = useFormHook(initialProfile);
	const saveHook = useSaveHook();

	const {
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		setAvatarPreview,
		validateForm,
		handleImageUpload,
		resetForm,
	} = formHook;

	const { isSaving, error, success, setError, saveProfile } = saveHook;

	// Cargar el perfil completo cuando el componente se monta
	useEffect(() => {
		const loadProfile = async () => {
			if (!user) return;

			try {
				setIsLoadingProfile(true);
				const profileData = await getProfileFn();

				// Actualizar el estado del perfil con los datos cargados
				setProfile({
					...profileData,
					avatarUrl: user.avatarUrl,
					name: user.name,
					email: user.email,
				});
			} catch (err) {
				console.error('Error cargando perfil:', err);
				setError('Error al cargar tu perfil');
			} finally {
				setIsLoadingProfile(false);
			}
		};

		loadProfile();
	}, [user, setProfile, setError, getProfileFn]);

	// Actualizar datos básicos del usuario desde el contexto
	useEffect(() => {
		if (user) {
			setProfile((prev: T) => ({
				...prev,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
			}));
		}
	}, [user, setProfile]);

	const handleSave = async () => {
		if (!validateForm()) {
			setError('Por favor corrige los errores en el formulario');
			return;
		}

		const saved = await saveProfile(profile);

		if (saved) {
			setIsEditing(false);
			setAvatarPreview(null);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const result = handleImageUpload(event);
		if (result?.error) {
			setError(result.error);
		}
	};

	const handleCancel = () => {
		if (user) {
			resetForm(user);
		}
	};

	return {
		user,
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		isSaving,
		error,
		success,
		isLoadingProfile,
		handleSave,
		handleImageChange,
		handleCancel,
	};
}
