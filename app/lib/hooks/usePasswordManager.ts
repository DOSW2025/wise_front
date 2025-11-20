import { useState } from 'react';

interface PasswordData {
	current: string;
	new: string;
	confirm: string;
}

interface PasswordErrors {
	current?: string;
	new?: string;
	confirm?: string;
}

export function usePasswordManager() {
	const [passwordData, setPasswordData] = useState<PasswordData>({
		current: '',
		new: '',
		confirm: '',
	});

	const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

	const validatePassword = (): boolean => {
		const errors: PasswordErrors = {};

		if (!passwordData.current) {
			errors.current = 'Contraseña actual requerida';
		}

		if (!passwordData.new) {
			errors.new = 'Nueva contraseña requerida';
		} else if (passwordData.new.length < 8) {
			errors.new = 'Mínimo 8 caracteres';
		}

		if (passwordData.new !== passwordData.confirm) {
			errors.confirm = 'Las contraseñas no coinciden';
		}

		setPasswordErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const resetPassword = () => {
		setPasswordData({
			current: '',
			new: '',
			confirm: '',
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
