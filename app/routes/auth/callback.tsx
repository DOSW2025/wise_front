import { Card, CardBody, Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { AuthResponse, UserResponse } from '../../lib/api/auth';
import { authService } from '../../lib/api/auth';

export function meta() {
	return [
		{ title: 'Autenticando... - ECIWISE+' },
		{ name: 'description', content: 'Procesando autenticación' },
	];
}

/**
 * Validar que el objeto user tenga la estructura esperada
 */
function isValidUserResponse(user: unknown): user is UserResponse {
	if (!user || typeof user !== 'object') return false;

	const u = user as Record<string, unknown>;
	return (
		typeof u.id === 'string' &&
		typeof u.email === 'string' &&
		typeof u.nombre === 'string' &&
		typeof u.apellido === 'string' &&
		typeof u.rol === 'string'
	);
}

export default function AuthCallback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;

		const handleCallback = async () => {
			try {
				// Obtener el token del query parameter
				const token = searchParams.get('token');
				const userParam = searchParams.get('user');

				if (!token || !userParam) {
					setError('No se recibieron las credenciales de autenticación');
					timeoutId = setTimeout(() => {
						navigate('/login', { replace: true });
					}, 3000);
					return;
				}

				// Decodificar y parsear la información del usuario con validación
				let user: unknown;
				try {
					user = JSON.parse(decodeURIComponent(userParam));
				} catch (parseError) {
					console.error('Error al parsear datos del usuario:', parseError);
					setError('Datos de usuario inválidos');
					timeoutId = setTimeout(() => {
						navigate('/login', { replace: true });
					}, 3000);
					return;
				}

				// Validar estructura del usuario
				if (!isValidUserResponse(user)) {
					console.error('Estructura de usuario inválida:', user);
					setError('Datos de usuario inválidos');
					timeoutId = setTimeout(() => {
						navigate('/login', { replace: true });
					}, 3000);
					return;
				}

				// Crear el objeto de respuesta de autenticación
				const authResponse: AuthResponse = {
					access_token: token,
					user: user,
				};

				// Guardar los datos de autenticación
				authService.saveAuthData(authResponse);

				// Redirigir al dashboard usando navigate
				navigate('/dashboard', { replace: true });
			} catch (err) {
				console.error('Error en callback de autenticación:', err);
				setError('Error al procesar la autenticación. Redirigiendo...');
				timeoutId = setTimeout(() => {
					navigate('/login', { replace: true });
				}, 3000);
			}
		};

		handleCallback();

		// Cleanup para limpiar timeout si el componente se desmonta
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [searchParams, navigate]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-content1 to-content3 p-4">
			<Card className="w-full max-w-md shadow-lg bg-content1">
				<CardBody className="flex flex-col items-center justify-center py-12 px-8 space-y-6">
					{error ? (
						<>
							<div className="p-4 rounded-full bg-danger-100">
								<svg
									className="w-12 h-12 text-danger"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Error</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
							<h2 className="text-xl font-semibold text-foreground text-center">
								Error de Autenticación
							</h2>
							<p className="text-default-600 text-center">{error}</p>
						</>
					) : (
						<>
							<Spinner size="lg" color="primary" />
							<h2 className="text-xl font-semibold text-foreground text-center">
								Autenticando...
							</h2>
							<p className="text-default-600 text-center">
								Estamos verificando tus credenciales y preparando tu cuenta
							</p>
						</>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
