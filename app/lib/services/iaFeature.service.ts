// Fuente del API Gateway usada para consultar el estado del flag de IA.
// Este servicio comprueba si la funcionalidad de IA está habilitada
// a través del API Gateway (endpoint genérico de feature flags con key 'enable_ia_chat'),
// y expone un booleano para que el cliente oculte/muestre la UI y evite llamadas de IA.
const API_BASE_RAW = import.meta.env.VITE_API_GATEWAY_URL;
// Forzar HTTPS para evitar mixed content cuando la app está en HTTPS (e.g., Vercel)
const API_BASE = API_BASE_RAW?.startsWith('http://')
	? API_BASE_RAW.replace('http://', 'https://')
	: API_BASE_RAW;

let cachedIaEnabled: boolean | null = null;
let lastCheckTs = 0;
const CACHE_TTL_MS = 15000; // 15s de caché para evitar saturar el API Gateway

export async function isIaEnabled(): Promise<boolean> {
	const now = Date.now();
	if (cachedIaEnabled !== null && now - lastCheckTs < CACHE_TTL_MS) {
		return cachedIaEnabled;
	}

	if (!API_BASE) {
		// No API base configured → treat IA as disabled
		cachedIaEnabled = false;
		lastCheckTs = now;
		return false;
	}

	try {
		// Endpoint genérico del API Gateway de feature flags que devuelve { key: string, enabled: boolean }
		const res = await fetch(`${API_BASE}/wise/feature-flags/enable_ia_chat`, {
			method: 'GET',
			headers: { Accept: 'application/json' },
		});

		if (!res.ok) {
			cachedIaEnabled = false;
			lastCheckTs = now;
			return false;
		}

		const data = await res.json().catch(() => ({ enabled: false }));
		const enabled = !!data?.enabled;
		cachedIaEnabled = enabled;
		lastCheckTs = now;
		return enabled;
	} catch (e) {
		// Errores de red → por seguridad se asume deshabilitado
		cachedIaEnabled = false;
		lastCheckTs = now;
		return false;
	}
}
