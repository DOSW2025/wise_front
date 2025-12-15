import { Card, CardBody, Input } from '@heroui/react';
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
import { getProfile } from '~/lib/services/student.service';
import { deleteMyAccount } from '~/lib/services/user.service';
import { useProfileForm } from './hooks/useProfileForm';
import { useProfileSave } from './hooks/useProfileSave';

export default function StudentProfile() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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
		avatarUrl: user?.avatarUrl,
		interests: [],
		semester: '',
	});

	const { isSaving, error, success, saveProfile } = useProfileSave();

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
					avatarUrl: user.avatarUrl,
					phone: profileData.phone || '',
					description: profileData.description || '',
					role: profileData.role || user.role || '',
					semester: profileData.semester || '',
					interests: profileData.interests || prev.interests || [],
				}));
			} catch (err) {
				console.error('Error cargando perfil:', err);
			} finally {
				setIsLoadingProfile(false);
			}
		};

		loadProfile();
	}, [user, setProfile]);

	// Actualizar datos básicos del usuario desde el contexto
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
			return;
		}

		const saved = await saveProfile({
			name: profile.name,
			email: profile.email,
			phone: profile.phone,
			role: profile.role || '',
			description: profile.description,
			interests: profile.interests || [],
			semester: profile.semester || '',
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
			navigate('/login');
		} catch (error) {
			console.error('Error al eliminar cuenta:', error);
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

			{error && <AlertMessage message={error} type="error" />}
			{success && <AlertMessage message={success} type="success" />}

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
						<ProfileAvatar src={profile.avatarUrl} name={profile.name} />
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
				</CardBody>
			</Card>

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

			<DeleteAccount onDelete={handleDeleteAccount} />
		</div>
	);
}
