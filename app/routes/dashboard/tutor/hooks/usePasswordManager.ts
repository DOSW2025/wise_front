import { useState } from 'react';

interface PasswordData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface PasswordErrors {
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
}

export function usePasswordManager() {
	const [passwordData, setPasswordData] = useState<PasswordData>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

	const validatePassword = (): boolean => {
		const errors: PasswordErrors = {};

		if (!passwordData.currentPassword) {
			errors.currentPassword = 'Contraseña actual requerida';
		}

		if (!passwordData.newPassword) {
			errors.newPassword = 'Nueva contraseña requerida';
		} else if (passwordData.newPassword.length < 8) {
			errors.newPassword = 'Mínimo 8 caracteres';
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			errors.confirmPassword = 'Las contraseñas no coinciden';
		}

		setPasswordErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const resetPassword = () => {
		setPasswordData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
		setPasswordErrors({});
	};

	return {
		passwordData,
		setPasswordData,
		passwordErrors,
		validatePassword,
		resetPassword,
	};
}
