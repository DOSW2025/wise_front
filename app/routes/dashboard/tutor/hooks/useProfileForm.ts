import { useState } from 'react';

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	location: string;
	description: string;
	avatar?: string;
	availability: {
		monday: boolean;
		tuesday: boolean;
		wednesday: boolean;
		thursday: boolean;
		friday: boolean;
		saturday: boolean;
		sunday: boolean;
	};
	subjects: string[];
	hourlyRate: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	phone?: string;
	location?: string;
	description?: string;
}

export function useProfileForm(initialProfile: ProfileData) {
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

		const phoneRegex =
			/^\+?[0-9]{1,4}?[\s-]?(?:\(?[0-9]{1,4}\)?[\s-]?)?[0-9]{1,4}[\s-]?[0-9]{1,4}[\s-]?[0-9]{0,9}$/;
		if (profile.phone && !phoneRegex.test(profile.phone.trim())) {
			errors.phone = 'Teléfono inválido';
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
			setProfile({ ...profile, avatar: reader.result as string });
		};
		reader.readAsDataURL(file);
		return null;
	};

	const toggleDay = (day: keyof ProfileData['availability']) => {
		setProfile({
			...profile,
			availability: {
				...profile.availability,
				[day]: !profile.availability[day],
			},
		});
	};

	const resetForm = (userData: {
		name: string;
		email: string;
		avatar?: string;
	}) => {
		setIsEditing(false);
		setFormErrors({});
		setAvatarPreview(null);
		setProfile((prev) => ({
			...prev,
			name: userData.name,
			email: userData.email,
			avatar: userData.avatar,
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
		toggleDay,
		resetForm,
	};
}
