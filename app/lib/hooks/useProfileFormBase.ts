import { useState } from 'react';
import { EMAIL_REGEX, PHONE_REGEX } from '../utils/validation';

export interface FormErrors {
	name?: string;
	email?: string;
	phone?: string;
	role?: string;
	description?: string;
}

export interface BaseProfileData {
	name: string;
	email: string;
	phone: string;
	role: string;
	description: string;
	avatarUrl?: string;
}

export function useProfileFormBase<T extends BaseProfileData>(
	initialProfile: T,
) {
	const [profile, setProfile] = useState<T>(initialProfile);
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
		} else if (!EMAIL_REGEX.test(profile.email)) {
			errors.email = 'Email inválido';
		}

		if (profile.phone) {
			const phoneValue = profile.phone.trim();
			if (phoneValue.length > 10) {
				errors.phone = 'El teléfono no puede exceder 10 caracteres';
			} else if (!PHONE_REGEX.test(phoneValue)) {
				errors.phone = 'Teléfono inválido';
			}
		}

		if (profile.description && profile.description.length > 500) {
			errors.description = 'La descripción no puede exceder 500 caracteres';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return null;

		if (file.size > 2 * 1024 * 1024) {
			return { error: 'La imagen no puede ser mayor a 2MB' };
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string);
			setProfile({ ...profile, avatarUrl: reader.result as string });
		};
		reader.readAsDataURL(file);
		return null;
	};

	const resetForm = (userData: {
		name: string;
		email: string;
		avatarUrl?: string;
	}) => {
		setIsEditing(false);
		setFormErrors({});
		setAvatarPreview(null);
		setProfile((prev) => ({
			...prev,
			name: userData.name,
			email: userData.email,
			avatarUrl: userData.avatarUrl,
		}));
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
