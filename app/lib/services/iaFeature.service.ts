// Fuente del API Gateway usada para consultar el estado del flag de IA.
// Este servicio comprueba si la funcionalidad de IA está habilitada
// a través del API Gateway (endpoint genérico de feature flags con key 'enable_ia_chat'),
// y expone un booleano para que el cliente oculte/muestre la UI y evite llamadas de IA.
const API_BASE = import.meta.env.VITE_API_GATEWAY_URL;

console.log('[iaFeature] API_BASE:', API_BASE);

let cachedIaEnabled: boolean | null = null;
let lastCheckTs = 0;
const CACHE_TTL_MS = 15000; // 15s de caché para evitar saturar el API Gateway

export async function isIaEnabled(): Promise<boolean> {
	const now = Date.now();
	if (cachedIaEnabled !== null && now - lastCheckTs < CACHE_TTL_MS) {
		console.log('[iaFeature] Returning cached value:', cachedIaEnabled);
		return cachedIaEnabled;
	}

	if (!API_BASE) {
		console.warn('[iaFeature] API_BASE not configured');
		cachedIaEnabled = false;
		lastCheckTs = now;
		return false;
	}

	const url = `${API_BASE}/wise/feature-flags/enable_ia_chat`;
	console.log('[iaFeature] Fetching:', url);

	try {
		// Endpoint genérico del API Gateway de feature flags que devuelve { key: string, enabled: boolean }
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
		});

		console.log('[iaFeature] Response status:', res.status);

		if (!res.ok) {
			console.warn('[iaFeature] Response not OK, status:', res.status);
			cachedIaEnabled = false;
			lastCheckTs = now;
			return false;
		}

		const data = await res.json().catch((e) => {
			console.error('[iaFeature] JSON parse error:', e);
			return { enabled: false };
		});

		console.log('[iaFeature] Response data:', data);

		const enabled = !!data?.enabled;
		console.log('[iaFeature] Enabled:', enabled);

		cachedIaEnabled = enabled;
		lastCheckTs = now;
		return enabled;
	} catch (e) {
		console.error('[iaFeature] Fetch error:', e);
		// Errores de red → por seguridad se asume deshabilitado
		cachedIaEnabled = false;
		lastCheckTs = now;
		return false;
	}
}
