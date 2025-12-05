import {
	Button,
	Card,
	CardBody,
	Chip,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
	useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { AlertMessage, ProfileAvatar, StatsCard } from '~/components';
import {
	ProfileConfigurationSection,
	ProfileEditButtons,
	ProfileFormFields,
	ProfileHeader,
} from '~/components/profile';
import { useAuth } from '~/contexts/auth-context';
import { useProfileForm } from './hooks/useProfileForm';
import { useProfileSave } from './hooks/useProfileSave';

export default function TutorProfile() {
	const { user } = useAuth();
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
		validateForm,
		handleImageUpload,
		toggleDay,
		resetForm,
	} = useProfileForm({
		name: user?.name || '',
		email: user?.email || '',
		phone: '',
		location: '',
		description: '',
		avatar: user?.avatarUrl,
		availability: {
			monday: false,
			tuesday: false,
			wednesday: false,
			thursday: false,
			friday: false,
			saturday: false,
			sunday: false,
		},
		subjects: [],
		hourlyRate: '',
	});

	const { isSaving, error, success, setError, saveProfile } = useProfileSave();

	const {
		isOpen: isAvailabilityModalOpen,
		onOpen: onAvailabilityModalOpen,
		onClose: onAvailabilityModalClose,
	} = useDisclosure();

	useEffect(() => {
		if (user) {
			setProfile((prev) => ({
				...prev,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
			}));
		}
	}, [user, setProfile]);

	const handleSave = async () => {
		if (!validateForm()) {
			setError('Por favor corrige los errores en el formulario');
			return;
		}

		const saved = await saveProfile({
			name: profile.name,
			email: profile.email,
			phone: profile.phone,
			location: profile.location,
			description: profile.description,
		});

		if (saved) {
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		if (user) {
			resetForm(user);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const result = handleImageUpload(event);
		if (result?.error) {
			setError(result.error);
		}
	};

	const daysOfWeek = [
		{ key: 'monday', label: 'Lunes' },
		{ key: 'tuesday', label: 'Martes' },
		{ key: 'wednesday', label: 'Miércoles' },
		{ key: 'thursday', label: 'Jueves' },
		{ key: 'friday', label: 'Viernes' },
		{ key: 'saturday', label: 'Sábado' },
		{ key: 'sunday', label: 'Domingo' },
	] as const;

	return (
		<div className="space-y-6">
			<ProfileHeader
				title="Mi Perfil"
				description="Gestiona tu información personal y configuración"
			/>

			{/* Mensajes de error y éxito */}
			{error && <AlertMessage message={error} type="error" />}
			{success && <AlertMessage message={success} type="success" />}

			{/* Información Personal */}
			<Card>
				<CardBody className="gap-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Información Personal</h2>
						<ProfileEditButtons
							isEditing={isEditing}
							isSaving={isSaving}
							onEdit={() => setIsEditing(true)}
							onSave={handleSave}
							onCancel={handleCancel}
						/>
					</div>

					<div className="flex flex-col md:flex-row gap-6">
						<ProfileAvatar
							src={profile.avatar}
							name={profile.name}
							isEditing={isEditing}
							onImageChange={handleImageChange}
							preview={avatarPreview}
						/>{' '}
						<ProfileFormFields
							profile={profile}
							isEditing={isEditing}
							formErrors={formErrors}
							onProfileChange={setProfile}
							onErrorClear={(field) =>
								setFormErrors({ ...formErrors, [field]: undefined })
							}
							nameReadOnly={false}
							emailReadOnly={false}
							descriptionLabel="Descripción Profesional"
							descriptionPlaceholder="Cuéntanos sobre tu experiencia y especialidades..."
						>
							<Input
								label="Tarifa por Hora"
								placeholder="25000"
								value={profile.hourlyRate}
								onValueChange={(value) =>
									setProfile({ ...profile, hourlyRate: value })
								}
								isReadOnly={!isEditing}
								variant={isEditing ? 'bordered' : 'flat'}
								startContent={
									<span className="text-default-400 text-sm">$</span>
								}
								endContent={
									<span className="text-default-400 text-sm">COP</span>
								}
							/>
						</ProfileFormFields>
					</div>

					{isEditing && (
						<div className="space-y-2">
							<span className="text-sm font-medium block">
								Materias que enseñas
							</span>
							<div className="flex flex-wrap gap-2">
								{profile.subjects.map((subject) => (
									<Chip
										key={subject}
										onClose={() =>
											setProfile({
												...profile,
												subjects: profile.subjects.filter((s) => s !== subject),
											})
										}
										variant="flat"
										color="primary"
									>
										{subject}
									</Chip>
								))}
								<Chip
									variant="bordered"
									className="cursor-pointer"
									onClick={() => {
										const newSubject = prompt('Ingresa una nueva materia:');
										if (newSubject) {
											setProfile({
												...profile,
												subjects: [...profile.subjects, newSubject],
											});
										}
									}}
								>
									+ Agregar
								</Chip>
							</div>
						</div>
					)}
				</CardBody>
			</Card>

			{/* Estadísticas */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Estadísticas</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Tutorías Completadas"
							value={-1}
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
							value="-1"
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
							value={-1}
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
							value={-1}
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
					<ProfileConfigurationSection
						emailNotifications={emailNotifications}
						onEmailNotificationsChange={setEmailNotifications}
						emailNotificationsDescription="Recibe notificaciones de nuevas solicitudes"
					>
						<>
							<Divider />

							<div className="flex justify-between items-center p-4 bg-default-50 rounded-lg hover:bg-default-100 transition-colors">
								<div className="flex-1">
									<p className="font-medium">Disponibilidad Semanal</p>
									<p className="text-sm text-default-500">
										Configura los días en que estás disponible
									</p>
									<div className="flex flex-wrap gap-2 mt-2">
										{daysOfWeek.map(
											({ key, label }) =>
												profile.availability[key] && (
													<Chip
														key={key}
														size="sm"
														color="success"
														variant="flat"
													>
														{label}
													</Chip>
												),
										)}
									</div>
								</div>
								<Button
									color="primary"
									variant="bordered"
									onPress={onAvailabilityModalOpen}
								>
									Configurar
								</Button>
							</div>
						</>
					</ProfileConfigurationSection>
				</CardBody>
			</Card>

			{/* Modal de Disponibilidad */}
			<Modal
				isOpen={isAvailabilityModalOpen}
				onClose={onAvailabilityModalClose}
				size="md"
			>
				<ModalContent>
					<ModalHeader>Configurar Disponibilidad</ModalHeader>
					<ModalBody>
						<div className="space-y-3">
							<p className="text-sm text-default-500">
								Selecciona los días en los que estás disponible para dar
								tutorías
							</p>
							{daysOfWeek.map(({ key, label }) => (
								<div
									key={key}
									className="flex justify-between items-center p-3 bg-default-50 rounded-lg"
								>
									<span className="font-medium">{label}</span>
									<Switch
										isSelected={profile.availability[key]}
										onValueChange={() => toggleDay(key)}
										color="success"
									/>
								</div>
							))}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onAvailabilityModalClose}>
							Cancelar
						</Button>
						<Button color="primary" onPress={onAvailabilityModalClose}>
							Guardar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}