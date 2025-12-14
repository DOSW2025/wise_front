import {
	Button,
	Card,
	CardBody,
	Chip,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
	useDisclosure,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertMessage, ProfileAvatar } from '~/components';
import {
	ProfileConfigurationSection,
	ProfileEditButtons,
	ProfileFormFields,
	ProfileHeader,
} from '~/components/profile';
import { DeleteAccount } from '~/components/profile/DeleteAccount';
import { InterestsChips } from '~/components/profile/InterestsChips';
import { useAuth } from '~/contexts/auth-context';
import { deleteMyAccount } from '~/lib/services/user.service';
import { useProfileForm } from './hooks/useProfileForm';
import { useProfileSave } from './hooks/useProfileSave';

export default function TutorProfile() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [emailNotifications, setEmailNotifications] = useState(true);
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

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
	});

	const { isSaving, error, success, setError, saveProfile } = useProfileSave();

	const { isOpen: isAvailabilityModalOpen, onClose: onAvailabilityModalClose } =
		useDisclosure();

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

	const handleDeleteAccount = async () => {
		try {
			await deleteMyAccount();
			onDeleteClose();
			// Redirigir al login después de eliminar
			navigate('/login');
		} catch (error) {
			console.error('Error al eliminar cuenta:', error);
			setError('Error al eliminar la cuenta. Por favor intenta nuevamente.');
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
							nameReadOnly={true}
							emailReadOnly={true}
							descriptionLabel="Descripción Profesional"
							descriptionPlaceholder="Cuéntanos sobre tu experiencia y especialidades..."
						/>
					</div>

					{isEditing && (
						<InterestsChips
							title="Materias que enseñas"
							items={profile.subjects}
							isEditing={isEditing}
							onRemove={(value) =>
								setProfile({
									...profile,
									subjects: profile.subjects.filter((s) => s !== value),
								})
							}
							onAdd={(value) =>
								setProfile({
									...profile,
									subjects: [...profile.subjects, value],
								})
							}
							emptyText="No has agregado materias"
							addLabel="+ Agregar"
						/>
					)}
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
								onPress={() =>
									navigate('/dashboard/tutor/scheduled?tab=availability')
								}
							>
								Configurar
							</Button>
						</div>
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

			<DeleteAccount onDelete={handleDeleteAccount} />
		</div>
	);
}
