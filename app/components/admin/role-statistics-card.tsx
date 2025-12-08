import { Card, CardBody } from '@heroui/react';
import { useEffect, useState } from 'react';
import { getRoleStatistics } from '~/lib/services/user.service';
import type { RoleStatisticsResponse } from '~/lib/types/api.types';

const ROLE_COLORS = {
	estudiante: { bg: 'bg-primary', text: 'text-primary' },
	tutor: { bg: 'bg-success', text: 'text-success' },
	admin: { bg: 'bg-warning', text: 'text-warning' },
} as const;

export function RoleStatisticsCard() {
	const [statistics, setStatistics] = useState<RoleStatisticsResponse | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				setIsLoading(true);
				const data = await getRoleStatistics();
				setStatistics(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching role statistics:', err);
				setError('Error al cargar estadísticas de roles');
			} finally {
				setIsLoading(false);
			}
		};

		fetchStatistics();
	}, []);

	if (isLoading) {
		return (
			<Card>
				<CardBody className="gap-4">
					<h3 className="text-lg font-semibold">Usuarios por Rol</h3>
					<div className="space-y-3">
						<p className="text-sm text-default-500">Cargando...</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (error || !statistics) {
		return (
			<Card>
				<CardBody className="gap-4">
					<h3 className="text-lg font-semibold">Usuarios por Rol</h3>
					<div className="space-y-3">
						<p className="text-sm text-danger">{error || 'Error al cargar'}</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card>
			<CardBody className="gap-4">
				<h3 className="text-lg font-semibold">Usuarios por Rol</h3>
				<div className="space-y-3">
					{statistics.roles.map((role) => {
						const roleKey = role.rol.toLowerCase() as keyof typeof ROLE_COLORS;
						const colors = ROLE_COLORS[roleKey] || {
							bg: 'bg-default',
							text: 'text-default',
						};

						const displayName =
							role.rol === 'estudiante'
								? 'Estudiantes'
								: role.rol === 'tutor'
									? 'Tutores'
									: role.rol === 'admin'
										? 'Administradores'
										: role.rol;

						return (
							<div key={role.rolId}>
								<div className="flex items-center justify-between mb-1">
									<span className="text-sm text-default-600">
										{displayName}
									</span>
									<div className="flex items-center gap-2">
										<span className="font-semibold">{role.conteo}</span>
										<span className={`text-xs ${colors.text}`}>
											{role.porcentaje}%
										</span>
									</div>
								</div>
								<div className="w-full bg-default-200 rounded-full h-2">
									<div
										className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
										style={{ width: `${role.porcentaje}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
				<div className="pt-3 border-t border-default-200">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-default-700">
							Total de Usuarios
						</span>
						<span className="text-lg font-bold text-default-900">
							{statistics.totalUsuarios}
						</span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
