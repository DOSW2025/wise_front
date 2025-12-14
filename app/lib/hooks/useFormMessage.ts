import { useCallback, useState } from 'react';

export function useFormMessage() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const clearMessages = useCallback(() => {
		setError(null);
		setSuccess(null);
	}, []);

	const showError = useCallback((message: string) => {
		setError(message);
	}, []);

	const showSuccess = useCallback((message: string) => {
		setSuccess(message);
		setTimeout(() => setSuccess(null), 3000);
	}, []);

	const resetMessages = useCallback(() => {
		clearMessages();
	}, [clearMessages]);

	return {
		error,
		success,
		setError,
		setSuccess,
		clearMessages,
		showError,
		showSuccess,
		resetMessages,
	};
}
