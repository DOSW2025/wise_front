/**
 * Hook para obtener las sesiones pendientes del tutor
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '~/contexts/auth-context';
import { getPendingSessions } from '~/lib/services/tutoria.service';

export function usePendingSessions() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ['tutor-pending-sessions', user?.id],
		queryFn: () => {
			if (!user?.id) throw new Error('Usuario no autenticado');
			return getPendingSessions(user.id);
		},
		enabled: !!user?.id,
		staleTime: 30 * 1000, // 30 segundos
		refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
		refetchOnWindowFocus: true, // Actualizar al volver a la ventana
	});
}
