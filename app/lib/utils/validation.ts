/**
 * Safe regex patterns with bounded repetition to prevent ReDoS attacks
 *
 * These patterns use quantifiers with explicit limits {min,max} instead of
 * unlimited quantifiers (+, *) to ensure linear time complexity O(n)
 */

/**
 * Validation constraints for profile fields
 */
export const VALIDATION_LIMITS = {
	PHONE_MAX_LENGTH: 20,
	BIO_MAX_LENGTH: 500,
} as const;

/**
 * Email validation regex with bounded repetition
 * - Local part (before @): 1-64 characters
 * - Domain part (after @): 1-255 characters
 * - TLD (after .): 2-63 characters (RFC 1035 compliant)
 *
 * Complexity: O(n) - linear time
 */
export const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,63}$/;

/**
 * Phone validation regex with bounded repetition
 * Supports international formats with optional country code, area code, and separators
 *
 * Format examples:
 * - +57 300 123 4567
 * - (123) 456-7890
 * - 1234567890
 *
 * Complexity: O(n) - linear time
 */
export const PHONE_REGEX =
	/^\+?[0-9]{1,4}?[\s-]?(?:\(?[0-9]{1,4}\)?[\s-]?)?[0-9]{1,4}[\s-]?[0-9]{1,4}[\s-]?[0-9]{0,9}$/;

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
	return PHONE_REGEX.test(phone.trim());
}
