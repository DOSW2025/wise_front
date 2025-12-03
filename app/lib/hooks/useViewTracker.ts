/**
 * View Tracker Hook
 * Hook para registrar vistas de materiales evitando duplicados
 */

import { useCallback, useRef } from 'react';
import { useViewMaterial } from './useMaterials';

export function useViewTracker() {
	const viewedMaterials = useRef(new Set<string>());
	const viewMaterial = useViewMaterial();

	const trackView = useCallback(
		(materialId: string) => {
			// Evitar múltiples registros del mismo material en la sesión
			if (viewedMaterials.current.has(materialId)) {
				return;
			}

			// Marcar como visto
			viewedMaterials.current.add(materialId);

			// Registrar vista
			viewMaterial.mutate(materialId);
		},
		[viewMaterial],
	);

	return { trackView, isTracking: viewMaterial.isPending };
}
