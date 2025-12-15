import { useEffect, useState } from 'react';
import { isIaEnabled } from '~/lib/services/iaFeature.service';

/**
 * Hook que consulta el estado de la IA vía API Gateway y lo refresca periódicamente.
 * - Primer consulta al montar
 * - Intervalo de refresco configurable mediante `refreshMs` (por defecto 5000 ms)
 */
export function useIaFeature(refreshMs: number = 5000) {
	const [enabled, setEnabled] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;
		let timer: number | undefined;

		const check = async () => {
			try {
				const ok = await isIaEnabled();
				if (mounted) setEnabled(ok);
			} catch {
				if (mounted) setEnabled(false);
			}
		};

		// primera consulta
		check();
		// intervalos
		timer = window.setInterval(check, refreshMs);

		return () => {
			mounted = false;
			if (timer) window.clearInterval(timer);
		};
	}, [refreshMs]);

	return enabled;
}
