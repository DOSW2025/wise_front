import { Card, CardBody } from '@heroui/react';
import { useAuth } from '~/contexts/auth-context';
import { authService } from '~/lib/api/auth';

/**
 * Componente temporal para diagnosticar problemas con el avatar
 * Muestra toda la información relevante del usuario y avatar
 */
export function AvatarDebug() {
	const { user } = useAuth();
	const storedUser = authService.getUser();

	// Leer directamente del localStorage
	const rawStorage = localStorage.getItem('user');
	let parsedStorage = null;
	try {
		parsedStorage = rawStorage ? JSON.parse(rawStorage) : null;
	} catch (e) {
		console.error('Error parsing storage', e);
	}

	return (
		<Card className="bg-warning-50 border-2 border-warning">
			<CardBody className="gap-4">
				<h3 className="text-lg font-bold text-warning-700">
					Debug de Avatar - Información del Usuario
				</h3>

				<div className="space-y-3 text-sm">
					<div>
						<p className="font-semibold text-warning-700">
							1. Usuario desde Context (useAuth):
						</p>
						<pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-32 text-xs">
							{JSON.stringify(user, null, 2)}
						</pre>
						<p className="text-warning-600 mt-1">
							Avatar: <strong>{user?.avatarUrl || 'NO DISPONIBLE'}</strong>
						</p>
					</div>

					<div>
						<p className="font-semibold text-warning-700">
							2. Usuario desde authService.getUser():
						</p>
						<pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-32 text-xs">
							{JSON.stringify(storedUser, null, 2)}
						</pre>
						<p className="text-warning-600 mt-1">
							Avatar URL:{' '}
							<strong>{storedUser?.avatarUrl || 'NO DISPONIBLE'}</strong>
						</p>
					</div>

					<div>
						<p className="font-semibold text-warning-700">
							3. Raw localStorage 'user':
						</p>
						<pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-32 text-xs">
							{rawStorage || 'NO HAY DATOS'}
						</pre>
						<p className="text-warning-600 mt-1">
							Avatar URL:{' '}
							<strong>{parsedStorage?.avatarUrl || 'NO DISPONIBLE'}</strong>
						</p>
					</div>

					<div>
						<p className="font-semibold text-warning-700">
							4. Todos los campos disponibles en storage:
						</p>
						<ul className="list-disc list-inside bg-white p-2 rounded mt-1 text-xs">
							{parsedStorage &&
								Object.keys(parsedStorage).map((key) => (
									<li key={key}>
										<strong>{key}:</strong>{' '}
										{typeof parsedStorage[key] === 'string'
											? parsedStorage[key]
											: JSON.stringify(parsedStorage[key])}
									</li>
								))}
						</ul>
					</div>
				</div>

				<div className="bg-warning-100 p-3 rounded">
					<p className="text-sm text-warning-700">
						<strong>Nota:</strong> Si no ves un campo 'avatarUrl', 'avatar', o
						'picture' en los datos, significa que el backend no está enviando la
						foto de perfil de Google. Verifica la configuración del backend y
						los scopes de Google OAuth.
					</p>
				</div>
			</CardBody>
		</Card>
	);
}
