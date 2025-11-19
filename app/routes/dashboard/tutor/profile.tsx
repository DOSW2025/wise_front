import {
	Avatar,
	Button,
	Card,
	CardBody,
	Divider,
	Input,
	Textarea,
} from '@heroui/react';
import { useState } from 'react';
import { StatsCard } from '~/components/stats-card';

export default function TutorProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState({
		name: 'Dr. María González',
		email: 'maria.gonzalez@eci.edu.co',
		phone: '+57 300 123 4567',
		location: 'Bogotá, Colombia',
		description:
			'Profesora de Programación Orientada a Objetos con 8 años de experiencia. Especialista en Java, Python y metodologías ágiles.',
	});

	const handleSave = () => {
		setIsEditing(false);
		// TODO: Guardar cambios
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
				<p className="text-default-500">
					Gestiona tu información personal y configuración
				</p>
			</div>

			{/* Información Personal */}
			<Card>
				<CardBody className="gap-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Información Personal</h2>
						<Button
							color={isEditing ? 'success' : 'primary'}
							variant={isEditing ? 'solid' : 'bordered'}
							onPress={isEditing ? handleSave : () => setIsEditing(true)}
						>
							{isEditing ? 'Guardar' : 'Editar Perfil'}
						</Button>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<div className="flex flex-col items-center gap-4">
							<Avatar
								name={profile.name}
								size="lg"
								color="primary"
								isBordered
								className="w-24 h-24"
							/>
							{isEditing && (
								<Button size="sm" variant="flat">
									Cambiar Foto
								</Button>
							)}
						</div>

						<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Nombre Completo"
								value={profile.name}
								onValueChange={(value) =>
									setProfile({ ...profile, name: value })
								}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
							/>
							<Input
								label="Correo Electrónico"
								value={profile.email}
								onValueChange={(value) =>
									setProfile({ ...profile, email: value })
								}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
							/>
							<Input
								label="Teléfono"
								value={profile.phone}
								onValueChange={(value) =>
									setProfile({ ...profile, phone: value })
								}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
							/>
							<Input
								label="Ubicación"
								value={profile.location}
								onValueChange={(value) =>
									setProfile({ ...profile, location: value })
								}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
							/>
						</div>
					</div>

					<Textarea
						label="Descripción Profesional"
						value={profile.description}
						onValueChange={(value) =>
							setProfile({ ...profile, description: value })
						}
						isReadOnly={!isEditing}
						variant={isEditing ? 'bordered' : 'flat'}
						rows={3}
					/>
				</CardBody>
			</Card>

			{/* Estadísticas */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Estadísticas</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Tutorías Completadas"
							value={156}
							description="Total"
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						/>
						<StatsCard
							title="Calificación Promedio"
							value="4.8"
							description="de 5.0"
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
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							}
						/>
						<StatsCard
							title="Estudiantes Ayudados"
							value={89}
							description="Únicos"
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
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							}
						/>
						<StatsCard
							title="Horas de Tutoría"
							value={234}
							description="Total"
							color="default"
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						/>
					</div>
				</CardBody>
			</Card>

			{/* Configuración */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Configuración de Cuenta</h2>
					<div className="space-y-4">
						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg">
							<div>
								<p className="font-medium">Cambiar Contraseña</p>
								<p className="text-sm text-default-500">
									Actualiza tu contraseña de acceso
								</p>
							</div>
							<Button color="primary" variant="bordered">
								Cambiar
							</Button>
						</div>

						<Divider />

						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg">
							<div>
								<p className="font-medium">Notificaciones por Email</p>
								<p className="text-sm text-default-500">
									Recibe notificaciones de nuevas solicitudes
								</p>
							</div>
							<Button color="success" variant="bordered">
								Activado
							</Button>
						</div>

						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg">
							<div>
								<p className="font-medium">Disponibilidad</p>
								<p className="text-sm text-default-500">
									Configura tus horarios disponibles
								</p>
							</div>
							<Button color="primary" variant="bordered">
								Configurar
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
