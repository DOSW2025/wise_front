/**
 * Utilidad para limpiar mensajes de error del backend
 * Elimina códigos de estado HTTP y texto técnico
 */

/**
 * Limpia el mensaje de error eliminando prefijos técnicos
 * @param errorMessage - Mensaje de error crudo del backend
 * @returns Mensaje limpio y amigable para el usuario
 *
 * @example
 * Input: "Error del servidor (409): El tutor ya tiene una sesión..."
 * Output: "El tutor ya tiene una sesión..."
 *
 * Input: "LOCALHOST:5173¡Tutoría agendada exitosamente...!"
 * Output: "¡Tutoría agendada exitosamente...!"
 */
export function cleanErrorMessage(errorMessage: string): string {
	// Eliminar prefijos de dominio/puerto (ej: "LOCALHOST:5173")
	let cleaned = errorMessage.replace(/^[A-Z]+:\d+/i, '');

	// Eliminar "Error del servidor (XXX): "
	cleaned = cleaned.replace(/^Error del servidor \(\d+\):\s*/i, '');

	// Eliminar "Error: " al inicio
	cleaned = cleaned.replace(/^Error:\s*/i, '');

	// Eliminar "Error al agendar: " si existe
	cleaned = cleaned.replace(/^Error al agendar:\s*/i, '');

	// Limpiar espacios múltiples y trim
	cleaned = cleaned.replaceAll(/\s+/g, ' ').trim();

	return cleaned || 'Ha ocurrido un error inesperado';
}

/**
 * Extrae un mensaje amigable de diferentes tipos de errores
 * @param error - Error de cualquier tipo
 * @returns Mensaje limpio para mostrar al usuario
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return cleanErrorMessage(error.message);
	}

	if (typeof error === 'string') {
		return cleanErrorMessage(error);
	}

	return 'Ha ocurrido un error inesperado';
}
