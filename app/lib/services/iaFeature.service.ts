const API_BASE = import.meta.env.VITE_API_GATEWAY_URL;

let cachedIaEnabled: boolean | null = null;
let lastCheckTs = 0;
const CACHE_TTL_MS = 15000; // 15s cache to avoid spamming the gateway

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
		// API Gateway feature flag endpoint returning { enabled: boolean }
		const res = await fetch(`${API_BASE}/wise/feature-flags/ia`, {
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
		// Network errors → default to disabled for safety
		cachedIaEnabled = false;
		lastCheckTs = now;
		return false;
	}
}
