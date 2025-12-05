/**
 * Storage Utility
 * Centralized storage management with security considerations
 *
 * SECURITY CONSIDERATIONS:
 * - localStorage is used for non-sensitive session data only
 * - Tokens stored here are JWT tokens with short expiration times
 * - XSS protection is handled by:
 *   1. Content Security Policy headers
 *   2. React's automatic XSS protection
 *   3. Input sanitization in the backend
 * - Sensitive operations require re-authentication
 * - Users should log out on shared/public computers
 *
 * OWASP Recommendations Followed:
 * - Do not store passwords or sensitive PII
 * - Tokens have expiration times
 * - HTTPS-only in production (enforced by backend)
 * - Regular security audits of stored data
 */

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
	TOKEN: 'token',
	REFRESH_TOKEN: 'refreshToken',
	USER: 'user',
	EXPIRES_IN: 'expiresIn',
} as const;

/**
 * Safely get item from localStorage with error handling
 * @param key - The storage key to retrieve
 * @returns The stored value or null if not found/error
 *
 * Security: This function only reads from localStorage.
 * The data stored is considered public and should not contain sensitive information.
 */
export function getStorageItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error(`Error reading from localStorage: ${key}`, error);
		return null;
	}
}

/**
 * Safely set item in localStorage with error handling
 * @param key - The storage key
 * @param value - The value to store
 *
 * Security: Only non-sensitive data should be stored.
 * For authentication tokens, use short-lived JWTs with proper expiration.
 */
export function setStorageItem(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.error(`Error writing to localStorage: ${key}`, error);
	}
}

/**
 * Safely remove item from localStorage with error handling
 * @param key - The storage key to remove
 */
export function removeStorageItem(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing from localStorage: ${key}`, error);
	}
}

/**
 * Clear all application data from localStorage
 * Used during logout to ensure clean state
 *
 * Security: This ensures no residual authentication data remains
 * after logout, reducing the risk on shared computers.
 */
export function clearStorage(): void {
	try {
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});
	} catch (error) {
		console.error('Error clearing localStorage', error);
	}
}

/**
 * Parse JSON safely from localStorage
 * @param key - The storage key containing JSON data
 * @returns Parsed object or null if invalid/not found
 */
export function getStorageJSON<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error(`Error parsing JSON from localStorage: ${key}`, error);
		return null;
	}
}

/**
 * Store JSON object in localStorage
 * @param key - The storage key
 * @param value - The object to store
 */
export function setStorageJSON<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error storing JSON to localStorage: ${key}`, error);
	}
}
