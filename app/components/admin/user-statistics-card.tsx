import { Card, CardBody } from '@heroui/react';
import { useEffect, useState } from 'react';
import { getUserStatistics } from '~/lib/services/user.service';
import type { UserStatisticsResponse } from '~/lib/types/api.types';

export function UserStatisticsCard() {
	const [statistics, setStatistics] = useState<UserStatisticsResponse | null>(
		null,
	);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				setIsLoading(true);
				const data = await getUserStatistics();
				setStatistics(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching user statistics:', err);
				setError('Error al cargar estadísticas');
			} finally {
				setIsLoading(false);
			}
		};

		fetchStatistics();
	}, []);

	const handleCardClick = () => {
		setIsExpanded(!isExpanded);
	};

	if (isLoading) {
		return (
			<Card className="cursor-pointer hover:shadow-lg transition-shadow">
				<CardBody className="gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-success-100">
								<svg
									className="w-6 h-6 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm text-default-500">Usuarios Activos</p>
								<p className="text-2xl font-bold">Cargando...</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (error || !statistics) {
		return (
			<Card className="cursor-pointer hover:shadow-lg transition-shadow">
				<CardBody className="gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-danger-100">
								<svg
									className="w-6 h-6 text-danger"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm text-default-500">Usuarios Activos</p>
								<p className="text-lg font-semibold text-danger">
									{error || 'Error'}
								</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	const { resumen } = statistics;

	return (
		<div className="relative">
			<Card
				className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
					isExpanded ? 'shadow-2xl z-50' : ''
				}`}
				isPressable
				onPress={handleCardClick}
			>
				<CardBody className="gap-4">
					{/* Header - Always Visible */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-success-100">
								<svg
									className="w-6 h-6 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm text-default-500">Usuarios Activos</p>
								<div className="flex items-baseline gap-2">
									<p className="text-2xl font-bold">{resumen.activos.conteo}</p>
									<p className="text-sm text-default-400">
										de {resumen.total} usuarios
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="text-right">
								<p className="text-sm font-semibold text-success">
									{resumen.activos.porcentaje}%
								</p>
							</div>
							<svg
								className={`w-5 h-5 text-default-400 transition-transform duration-300 ${
									isExpanded ? 'rotate-180' : ''
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Expanded Content - Overlay */}
			{isExpanded && (
				<Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-2xl border-2 border-success-200 animate-in slide-in-from-top duration-300">
					<CardBody className="gap-4">
						<h3 className="text-sm font-semibold text-default-700">
							Resumen de Usuarios
						</h3>

						{/* Usuarios Activos */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-success" />
									<span className="text-sm text-default-600">Activos</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">
										{resumen.activos.conteo}
									</span>
									<span className="text-xs text-success font-medium">
										{resumen.activos.porcentaje}%
									</span>
								</div>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-success h-2 rounded-full transition-all duration-500"
									style={{ width: `${resumen.activos.porcentaje}%` }}
								/>
							</div>
						</div>

						{/* Usuarios Suspendidos */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-warning" />
									<span className="text-sm text-default-600">Suspendidos</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">
										{resumen.suspendidos.conteo}
									</span>
									<span className="text-xs text-warning font-medium">
										{resumen.suspendidos.porcentaje}%
									</span>
								</div>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-warning h-2 rounded-full transition-all duration-500"
									style={{ width: `${resumen.suspendidos.porcentaje}%` }}
								/>
							</div>
						</div>

						{/* Usuarios Inactivos */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-default-400" />
									<span className="text-sm text-default-600">Inactivos</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">
										{resumen.inactivos.conteo}
									</span>
									<span className="text-xs text-default-500 font-medium">
										{resumen.inactivos.porcentaje}%
									</span>
								</div>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-default-400 h-2 rounded-full transition-all duration-500"
									style={{ width: `${resumen.inactivos.porcentaje}%` }}
								/>
							</div>
						</div>

						{/* Total */}
						<div className="pt-3 border-t border-default-200">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold text-default-700">
									Total de Usuarios
								</span>
								<span className="text-lg font-bold text-default-900">
									{resumen.total}
								</span>
							</div>
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
