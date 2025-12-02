import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Link } from 'react-router';
import { StatsCard } from '~/components/stats-card';

export default function AdminDashboardIndex() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Panel de Administración
				</h1>
				<p className="text-default-500">
					Supervisa y gestiona toda la plataforma ECIWISE+.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Usuarios Activos"
					value={1248}
					description="+12% este mes"
					color="success"
					icon={
						<svg
							className="w-6 h-6"
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
					}
				/>
				<StatsCard
					title="Tutorías Activas"
					value={342}
					description="En curso"
					color="primary"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Materiales Publicados"
					value={2156}
					description="Total en plataforma"
					color="warning"
					icon={
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					}
				/>
				<StatsCard
					title="Reportes Pendientes"
					value={7}
					description="Requieren atención"
					color="danger"
					icon={
						<svg
							className="w-6 h-6"
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
					}
				/>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Acciones Rápidas</h2>
						<div className="flex flex-col gap-2">
							<Button as={Link} to="/dashboard/users" color="primary" fullWidth>
								Gestionar Usuarios
							</Button>
							<Button
								as={Link}
								to="/dashboard/materials-management"
								color="default"
								variant="bordered"
								fullWidth
							>
								Validar Materiales
							</Button>
							<Button
								as={Link}
								to="/dashboard/admin/reports"
								color="default"
								variant="bordered"
								fullWidth
							>
								Ver Reportes
							</Button>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="gap-4">
						<h2 className="text-xl font-semibold">Alertas del Sistema</h2>
						<div className="space-y-3">
							<div className="flex items-start gap-3 p-3 bg-danger-50 rounded-lg">
								<svg
									className="w-5 h-5 text-danger flex-shrink-0 mt-0.5"
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
								<div className="flex-1">
									<p className="font-semibold text-sm text-danger">
										Reportes sin revisar
									</p>
									<p className="text-tiny text-danger-600">
										7 reportes requieren tu atención
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-3 bg-warning-50 rounded-lg">
								<svg
									className="w-5 h-5 text-warning flex-shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<div className="flex-1">
									<p className="font-semibold text-sm text-warning">
										Materiales pendientes
									</p>
									<p className="text-tiny text-warning-600">
										15 materiales esperan validación
									</p>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* System Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card>
					<CardBody className="gap-4">
						<h3 className="text-lg font-semibold">Usuarios por Rol</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-default-600">Estudiantes</span>
								<span className="font-semibold">1,024</span>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-primary h-2 rounded-full"
									style={{ width: '82%' }}
								/>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-default-600">Tutores</span>
								<span className="font-semibold">196</span>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-success h-2 rounded-full"
									style={{ width: '16%' }}
								/>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-default-600">
									Administradores
								</span>
								<span className="font-semibold">28</span>
							</div>
							<div className="w-full bg-default-200 rounded-full h-2">
								<div
									className="bg-warning h-2 rounded-full"
									style={{ width: '2%' }}
								/>
							</div>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="gap-4">
						<h3 className="text-lg font-semibold">Materias Más Demandadas</h3>
						<div className="space-y-3">
							{[
								{ name: 'Cálculo Diferencial', count: 89 },
								{ name: 'Programación', count: 76 },
								{ name: 'Física I', count: 64 },
								{ name: 'Álgebra Lineal', count: 58 },
							].map((subject, index) => (
								<div key={index} className="flex items-center justify-between">
									<span className="text-sm">{subject.name}</span>
									<Chip size="sm" color="primary" variant="flat">
										{subject.count}
									</Chip>
								</div>
							))}
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="gap-4">
						<h3 className="text-lg font-semibold">Actividad Reciente</h3>
						<div className="space-y-3">
							{[
								{
									action: 'Nuevo usuario registrado',
									time: 'Hace 5 min',
									type: 'success',
								},
								{
									action: 'Material validado',
									time: 'Hace 12 min',
									type: 'primary',
								},
								{
									action: 'Reporte recibido',
									time: 'Hace 23 min',
									type: 'danger',
								},
								{
									action: 'Tutoría completada',
									time: 'Hace 1 hora',
									type: 'success',
								},
							].map((activity, index) => (
								<div key={index} className="flex items-start gap-3">
									<div
										className={`w-2 h-2 rounded-full mt-2 ${
											activity.type === 'success'
												? 'bg-success'
												: activity.type === 'danger'
													? 'bg-danger'
													: 'bg-primary'
										}`}
									/>
									<div className="flex-1">
										<p className="text-sm">{activity.action}</p>
										<p className="text-tiny text-default-400">
											{activity.time}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Recent Users */}
			<Card>
				<CardBody className="gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Usuarios Recientes</h2>
						<Button
							as={Link}
							to="/dashboard/users"
							size="sm"
							variant="light"
							color="primary"
						>
							Ver todos
						</Button>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-default-200">
									<th className="text-left py-3 px-4 text-sm font-semibold">
										Usuario
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">
										Rol
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">
										Estado
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">
										Registro
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody>
								{[
									{
										name: 'Carlos Mendoza',
										email: 'carlos.mendoza@mail.escuelaing.edu.co',
										role: 'Estudiante',
										status: 'Activo',
										date: '10/11/2025',
									},
									{
										name: 'Diana Torres',
										email: 'diana.torres@mail.escuelaing.edu.co',
										role: 'Tutor',
										status: 'Pendiente',
										date: '09/11/2025',
									},
									{
										name: 'Roberto Gómez',
										email: 'roberto.gomez@mail.escuelaing.edu.co',
										role: 'Estudiante',
										status: 'Activo',
										date: '08/11/2025',
									},
								].map((user, index) => (
									<tr key={index} className="border-b border-default-100">
										<td className="py-3 px-4">
											<div className="flex flex-col">
												<p className="text-sm font-semibold">{user.name}</p>
												<p className="text-tiny text-default-400">
													{user.email}
												</p>
											</div>
										</td>
										<td className="py-3 px-4">
											<Chip size="sm" variant="flat">
												{user.role}
											</Chip>
										</td>
										<td className="py-3 px-4">
											<Chip
												size="sm"
												color={user.status === 'Activo' ? 'success' : 'warning'}
												variant="flat"
											>
												{user.status}
											</Chip>
										</td>
										<td className="py-3 px-4 text-sm">{user.date}</td>
										<td className="py-3 px-4">
											<Button size="sm" variant="light" color="primary">
												Ver detalles
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
