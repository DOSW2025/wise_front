import { Button, Card, CardBody, Chip } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '~/components/page-header';
import { getUsers } from '~/lib/services/user.service';
import type { AdminUserDto } from '~/lib/types/api.types';

export default function AdminUserDetail() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [user, setUser] = useState<AdminUserDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		if (userId == null) {
			setError('ID de usuario no válido');
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			// Fetch all users and find the one matching the ID
			// In a real app, you'd have a dedicated endpoint like /users/:id
			const response = await getUsers({ page: 1, limit: 100 });
			const foundUser = response.data?.find((u) => u.id === userId);

			if (!foundUser) {
				setError('Usuario no encontrado');
				setUser(null);
			} else {
				setUser(foundUser);
			}
		} catch (err: any) {
			console.error('Error fetching user:', err);
			setError('Error al cargar la información del usuario');
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const roleColors: Record<string, any> = {
		estudiante: 'primary',
		tutor: 'success',
		admin: 'warning',
	};

	const statusColors: Record<string, any> = {
		activo: 'success',
		suspendido: 'danger',
		pendiente: 'warning',
		inactivo: 'default',
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<PageHeader
					title="Cargando detalles del usuario..."
					description="Por favor espera"
				/>
				<Card>
					<CardBody className="flex items-center justify-center min-h-[300px]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
							<p className="mt-4 text-default-600">Cargando...</p>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	}

	if (error || user == null) {
		return (
			<div className="space-y-6">
				<PageHeader
					title="Error al cargar el usuario"
					description={error || 'Usuario no encontrado'}
				/>
				<Card>
					<CardBody>
						<Button
							onClick={() => navigate('/dashboard/admin/users')}
							color="primary"
						>
							Volver a la lista de usuarios
						</Button>
					</CardBody>
				</Card>
			</div>
		);
	}

	const fullName = `${user.nombre} ${user.apellido}`.trim();
	const roleName = user.rol?.nombre || '—';
	const statusName = user.estado?.nombre || '—';
	const createdDate = user.createdAt
		? new Date(user.createdAt).toLocaleDateString('es-CO', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: '—';
	const updatedDate = user.updatedAt
		? new Date(user.updatedAt).toLocaleDateString('es-CO', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: '—';

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button
					onClick={() => navigate('/dashboard/admin/users')}
					variant="light"
				>
					← Volver a usuarios
				</Button>
				<PageHeader title={fullName} description={user.email} />
			</div>

			{/* User Details Card */}
			<Card>
				<CardBody className="gap-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Basic Info */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Información Básica</h3>

							<div>
								<p className="text-sm text-default-600">Nombre Completo</p>
								<p className="text-base font-semibold">{fullName}</p>
							</div>

							<div>
								<p className="text-sm text-default-600">Email</p>
								<p className="text-base">{user.email}</p>
							</div>

							<div>
								<p className="text-sm text-default-600">ID</p>
								<p className="text-xs font-mono text-default-500">{user.id}</p>
							</div>
						</div>

						{/* Role & Status */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Estado y Rol</h3>

							<div>
								<p className="text-sm text-default-600 mb-2">Rol</p>
								<Chip
									size="lg"
									color={
										roleColors[String(roleName).toLowerCase()] || 'default'
									}
									variant="flat"
								>
									{roleName}
								</Chip>
							</div>

							<div>
								<p className="text-sm text-default-600 mb-2">Estado</p>
								<Chip
									size="lg"
									color={
										statusColors[String(statusName).toLowerCase()] || 'default'
									}
									variant="flat"
								>
									{statusName}
								</Chip>
							</div>
						</div>
					</div>

					{/* Dates */}
					<div className="border-t border-default-200 pt-4">
						<h3 className="text-lg font-semibold mb-4">Historial</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-default-600">Fecha de Registro</p>
								<p className="text-base">{createdDate}</p>
							</div>
							<div>
								<p className="text-sm text-default-600">Última Actualización</p>
								<p className="text-base">{updatedDate}</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Actions */}
			<Card>
				<CardBody className="gap-4">
					<h3 className="text-lg font-semibold">Acciones</h3>
					<div className="flex flex-wrap gap-2">
						<Button color="primary" variant="bordered">
							Editar Usuario
						</Button>
						<Button color="warning" variant="bordered">
							Cambiar Rol
						</Button>
						<Button color="danger" variant="bordered">
							{statusName === 'Activo' ? 'Suspender' : 'Activar'}
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
