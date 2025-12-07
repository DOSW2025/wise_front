import { useState } from 'react';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	avatar?: string;
	department: string;
	role: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	phone?: string;
	location?: string;
	description?: string;
}

interface UseProfileFormReturn {
	profile: ProfileData;
	setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
	formErrors: FormErrors;
	setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	avatarPreview: string | null;
	setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>;
	validateForm: () => boolean;
	handleImageUpload: (
		event: React.ChangeEvent<HTMLInputElement>,
	) => { error?: string } | null;
	resetForm: (user: any) => void;
}

export function useProfileForm(
	initialProfile: ProfileData,
): UseProfileFormReturn {
	const [profile, setProfile] = useState<ProfileData>(initialProfile);
	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const [isEditing, setIsEditing] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const validateForm = (): boolean => {
		const errors: FormErrors = {};

		if (!profile.name.trim()) {
			errors.name = 'El nombre es requerido';
		}

		if (!profile.email.trim()) {
			errors.email = 'El email es requerido';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
			errors.email = 'Email inválido';
		}

		if (profile.phone && !/^\+?[\d\s-()]+$/.test(profile.phone)) {
			errors.phone = 'Teléfono inválido';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleImageUpload = (
		event: React.ChangeEvent<HTMLInputElement>,
	): { error?: string } | null => {
		const file = event.target.files?.[0];
		if (!file) return null;

		// Validar tipo de archivo
		if (!file.type.startsWith('image/')) {
			return { error: 'Por favor selecciona una imagen válida' };
		}

		// Validar tamaño (máx 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return { error: 'La imagen no debe superar los 5MB' };
		}

		// Crear preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		return null;
	};

	const resetForm = (user: any) => {
		setProfile({
			name: user?.name || '',
			email: user?.email || '',
			phone: '',
			location: '',
			description: '',
			avatar: user?.avatarUrl,
			department: '',
			role: '',
		});
		setFormErrors({});
		setIsEditing(false);
		setAvatarPreview(null);
	};

	return {
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
	};
}
