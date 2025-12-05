/**
 * Toast Hook
 * Hook simple para mostrar notificaciones
 */

import { useCallback, useState } from 'react';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
}

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback(
		(message: string, type: Toast['type'] = 'info') => {
			const id = Date.now().toString();
			const toast: Toast = { id, message, type };

			setToasts((prev) => [...prev, toast]);

			// Auto remove after 3 seconds
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 3000);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, showToast, removeToast };
}
