import {
	Button,
	Card,
	CardBody,
	Chip,
	Divider,
	Input,
	Switch,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	AlertMessage,
	PasswordChangeModal,
	ProfileAvatar,
	StatsCard,
} from '~/components';
import { useAuth } from '~/contexts/auth-context';
import { usePasswordManager } from '~/lib/hooks/usePasswordManager';
import { useProfileForm } from './hooks/useProfileForm';

export default function StudentProfile() {
	const { user } = useAuth();
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [emailNotifications, setEmailNotifications] = useState(true);

	// Custom hooks for managing complex state
	const {
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		setAvatarPreview,
		validateForm,
		handleImageUpload,
		resetForm,
	} = useProfileForm({
		name: user?.name || '',
		email: user?.email || '',
		phone: '',
		location: '',
		description: '',
		avatar: user?.avatar,
		interests: [],
		career: '',
		semester: '',
	});

	const {
		passwordData,
		setPasswordData,
		passwordErrors,
		validatePassword,
		resetPassword,
	} = usePasswordManager();

	const {
		isOpen: isPasswordModalOpen,
		onOpen: onPasswordModalOpen,
		onClose: onPasswordModalClose,
	} = useDisclosure();

	useEffect(() => {
		if (user) {
			setProfile((prev) => ({
				...prev,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
			}));
		}
	}, [user, setProfile]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const result = handleImageUpload(event);
		if (result?.error) {
			setError(result.error);
		}
	};

	const handlePasswordChange = async () => {
		if (!validatePassword()) return;

		try {
			// Simular llamada a API
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess('Contraseña actualizada exitosamente');
			onPasswordModalClose();
			resetPassword();
		} catch (_err) {
			setError('Error al cambiar la contraseña');
		}
	};

	const handleSave = async () => {
		if (!validateForm()) {
			setError('Por favor corrige los errores en el formulario');
			return;
		}

		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			// Simular llamada a API para guardar perfil
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setIsEditing(false);
			setSuccess('Perfil actualizado exitosamente');
			setAvatarPreview(null);

			// Limpiar mensaje de éxito después de 3 segundos
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Error al guardar el perfil';
			setError(errorMessage);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		if (user) {
			resetForm(user);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
				<p className="text-default-500">
					Gestiona tu información personal y configuración
				</p>
			</div>

			{/* Mensajes de error y éxito */}
			{error && <AlertMessage message={error} type="error" />}
			{success && <AlertMessage message={success} type="success" />}

			{/* Información Personal */}
			<Card>
				<CardBody className="gap-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Información Personal</h2>
						<div className="flex gap-2">
							{isEditing && (
								<Button
									color="default"
									variant="flat"
									onPress={handleCancel}
									isDisabled={isSaving}
								>
									Cancelar
								</Button>
							)}
							<Button
								color={isEditing ? 'success' : 'primary'}
								variant={isEditing ? 'solid' : 'bordered'}
								onPress={isEditing ? handleSave : () => setIsEditing(true)}
								isLoading={isSaving}
								isDisabled={isSaving}
							>
								{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
							</Button>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<ProfileAvatar
							src={profile.avatar}
							name={profile.name}
							isEditing={isEditing}
							onImageChange={handleImageChange}
							preview={avatarPreview}
						/>

						<div className="flex-1 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Nombre Completo"
									placeholder="Ingresa tu nombre completo"
									value={profile.name}
									isReadOnly={true}
									variant="flat"
									isRequired
									description="No se puede modificar"
								/>
								<Input
									label="Correo Electrónico"
									placeholder="tu@email.com"
									type="email"
									value={profile.email}
									isReadOnly={true}
									variant="flat"
									startContent={<Mail className="w-4 h-4 text-default-400" />}
									isRequired
									description="No se puede modificar"
								/>
								<Input
									label="Teléfono"
									placeholder="+57 300 123 4567"
									type="tel"
									value={profile.phone}
									onValueChange={(value) => {
										setProfile({ ...profile, phone: value });
										setFormErrors({ ...formErrors, phone: undefined });
									}}
									isReadOnly={!isEditing}
									variant={isEditing ? 'bordered' : 'flat'}
									isInvalid={!!formErrors.phone}
									errorMessage={formErrors.phone}
									startContent={<Phone className="w-4 h-4 text-default-400" />}
								/>
								<Input
									label="Ubicación"
									placeholder="Ciudad, País"
									value={profile.location}
									onValueChange={(value) => {
										setProfile({ ...profile, location: value });
										setFormErrors({ ...formErrors, location: undefined });
									}}
									isReadOnly={!isEditing}
									variant={isEditing ? 'bordered' : 'flat'}
									startContent={<MapPin className="w-4 h-4 text-default-400" />}
								/>
								<Input
									label="Carrera"
									placeholder="Ingeniería de Sistemas"
									value={profile.career}
									isReadOnly={true}
									variant="flat"
									description="No se puede modificar"
								/>
								<Input
									label="Semestre"
									placeholder="7"
									value={profile.semester}
									isReadOnly={true}
									variant="flat"
									description="No se puede modificar"
								/>
							</div>

							<Textarea
								label="Sobre Mí"
								placeholder="Cuéntanos sobre tus intereses y objetivos..."
								value={profile.description}
								onValueChange={(value) => {
									setProfile({ ...profile, description: value });
									setFormErrors({ ...formErrors, description: undefined });
								}}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
								minRows={3}
								maxRows={6}
								isInvalid={!!formErrors.description}
								errorMessage={formErrors.description}
								description={
									isEditing
										? `${profile.description.length}/500 caracteres`
										: undefined
								}
							/>

							<div className="space-y-2">
								<span className="text-sm font-medium block">
									Áreas de Interés
								</span>
								<div className="flex flex-wrap gap-2">
									{profile.interests.map((interest) => (
										<Chip
											key={interest}
											onClose={
												isEditing
													? () =>
															setProfile({
																...profile,
																interests: profile.interests.filter(
																	(i) => i !== interest,
																),
															})
													: undefined
											}
											variant="flat"
											color="primary"
										>
											{interest}
										</Chip>
									))}
									{isEditing && (
										<Chip
											variant="bordered"
											className="cursor-pointer"
											onClick={() => {
												const newInterest = prompt(
													'Ingresa un área de interés:',
												);
												if (newInterest) {
													setProfile({
														...profile,
														interests: [...profile.interests, newInterest],
													});
												}
											}}
										>
											+ Agregar
										</Chip>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Estadísticas */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Mis Estadísticas</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Tutorías Tomadas"
							value={-1}
							description="Total"
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
							title="Horas de Estudio"
							value={-1}
							description="Este mes"
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						/>
						<StatsCard
							title="Materias Cursando"
							value={-1}
							description="Activas"
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
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							}
						/>
						<StatsCard
							title="Progreso General"
							value="-1%"
							description="Avance"
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
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg hover:bg-default-100 transition-colors">
							<div className="flex-1">
								<p className="font-medium">Cambiar Contraseña</p>
								<p className="text-sm text-default-500">
									Actualiza tu contraseña de acceso
								</p>
							</div>
							<Button
								color="primary"
								variant="bordered"
								onPress={onPasswordModalOpen}
							>
								Cambiar
							</Button>
						</div>

						<Divider />

						<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg">
							<div className="flex-1">
								<p className="font-medium">Notificaciones por Email</p>
								<p className="text-sm text-default-500">
									Recibe notificaciones de nuevas tutorías y materiales
								</p>
							</div>
							<Switch
								isSelected={emailNotifications}
								onValueChange={setEmailNotifications}
								color="success"
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Modal de Cambio de Contraseña */}
			<PasswordChangeModal
				isOpen={isPasswordModalOpen}
				onClose={onPasswordModalClose}
				passwordData={passwordData}
				passwordErrors={passwordErrors}
				onPasswordDataChange={setPasswordData}
				onSave={handlePasswordChange}
			/>
		</div>
	);
}
