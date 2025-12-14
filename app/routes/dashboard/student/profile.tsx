import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertMessage, ProfileAvatar, StatsCard } from '~/components';
import {
	ProfileConfigurationSection,
	ProfileEditButtons,
	ProfileFormFields,
	ProfileHeader,
} from '~/components/profile';
import { useAuth } from '~/contexts/auth-context';
import { deleteAccount, getProfile } from '~/lib/services/student.service';
import { useProfileForm } from './hooks/useProfileForm';
import { useProfileSave } from './hooks/useProfileSave';

export default function StudentProfile() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);
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
		validateForm,
		resetForm,
	} = useProfileForm({
		name: user?.name || '',
		email: user?.email || '',
		phone: '',
		role: user?.role || '',
		description: '',
		avatar: user?.avatarUrl,
		interests: [],
		semester: '',
	});

	const { isSaving, error, success, setError, saveProfile } = useProfileSave();

	// Cargar el perfil completo cuando el componente se monta
	useEffect(() => {
		const loadProfile = async () => {
			if (!user) return;

			try {
				setIsLoadingProfile(true);
				const profileData = await getProfile();

				// Actualizar el estado del perfil con los datos cargados del backend
				setProfile((prev) => ({
					...prev,
					name: user.name,
					email: user.email,
					avatar: user.avatarUrl,
					phone: profileData.phone || '',
					description: profileData.description || '',
					role: profileData.role || user.role || '',
					semester: profileData.semester || '',
				}));
			} catch (err) {
				console.error('Error cargando perfil:', err);
				const errorMessage =
					err instanceof Error ? err.message : 'Error al cargar tu perfil';
				setError(errorMessage);
			} finally {
				setIsLoadingProfile(false);
			}
		};

		loadProfile();
	}, [user, setProfile, setError]);

	// Actualizar datos básicos del usuario desde el contexto
	useEffect(() => {
		if (user) {
			setProfile((prev) => ({
				...prev,
				name: user.name,
				email: user.email,
				avatar: user.avatarUrl,
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
			role: profile.role,
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
			await deleteAccount();
			onDeleteClose();
			// Redirigir al login después de eliminar
			navigate('/login');
		} catch (error) {
			console.error('Error al eliminar cuenta:', error);
			const message =
				error instanceof Error
					? error.message
					: 'No se pudo eliminar la cuenta.';
			setError(message);
		}
	};

	// Mostrar loading mientras carga el perfil
	if (isLoadingProfile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-lg">Cargando perfil...</p>
				</div>
			</div>
		);
	}

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
						<ProfileAvatar src={profile.avatar} name={profile.name} />
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
							descriptionLabel="Sobre Mí"
							descriptionPlaceholder="Cuéntanos sobre tus intereses y objetivos..."
						>
							<Input
								label="Semestre"
								placeholder="7"
								value={profile.semester}
								isReadOnly={true}
								variant="flat"
								description="No se puede modificar"
							/>

							<Input
								label="Rol"
								placeholder="Estudiante"
								value={profile.role}
								isReadOnly={true}
								variant="flat"
								description="No se puede modificar"
							/>
						</ProfileFormFields>
					</div>

					<div className="space-y-2">
						<span className="text-sm font-medium block">Áreas de Interés</span>
						<div className="flex flex-wrap gap-2">
							{profile.interests && profile.interests.length > 0 ? (
								profile.interests.map((interest) => (
									<Chip
										key={interest}
										onClose={
											isEditing
												? () =>
														setProfile({
															...profile,
															interests:
																profile.interests?.filter(
																	(i) => i !== interest,
																) || [],
														})
												: undefined
										}
										variant="flat"
										color="primary"
									>
										{interest}
									</Chip>
								))
							) : (
								<p className="text-sm text-default-500">
									No has agregado áreas de interés
								</p>
							)}
							{isEditing && (
								<Chip
									variant="bordered"
									className="cursor-pointer"
									onClick={() => {
										const newInterest = prompt('Ingresa un área de interés:');
										if (newInterest) {
											setProfile({
												...profile,
												interests: [...(profile.interests || []), newInterest],
											});
										}
									}}
								>
									+ Agregar
								</Chip>
							)}
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
							value={0}
							description="Total"
							color="primary"
						/>
						<StatsCard
							title="Horas de Estudio"
							value={0}
							description="Este mes"
							color="success"
						/>
						<StatsCard
							title="Materias Cursando"
							value={0}
							description="Activas"
							color="warning"
						/>
						<StatsCard
							title="Progreso General"
							value="0%"
							description="Avance"
							color="default"
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
						emailNotificationsDescription="Recibe notificaciones de nuevas tutorías y materiales"
					/>
				</CardBody>
			</Card>

			{/* Eliminar Cuenta */}
			<Card>
				<CardBody className="gap-4">
					<div className="flex justify-end">
						<Button
							color="primary"
							variant="flat"
							startContent={<Trash2 className="w-4 h-4" />}
							onPress={onDeleteOpen}
						>
							Eliminar mi Cuenta
						</Button>
					</div>
				</CardBody>
			</Card>

			{/* Modal de Confirmación */}
			<Modal isOpen={isDeleteOpen} onClose={onDeleteClose} backdrop="opaque">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<span>Eliminar Cuenta</span>
					</ModalHeader>
					<ModalBody>
						<p className="text-default-600">
							¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es
							irreversible.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onDeleteClose}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleDeleteAccount}
							startContent={<Trash2 className="w-4 h-4" />}
						>
							Eliminar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
