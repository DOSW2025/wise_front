import { Card, CardBody } from '@heroui/react';
import { useEffect, useState } from 'react';
import { AlertMessage, ProfileAvatar, StatsCard } from '~/components';
import {
	ProfileConfigurationSection,
	ProfileEditButtons,
	ProfileFormFields,
	ProfileHeader,
} from '~/components/profile';
import { useAuth } from '~/contexts/auth-context';
import { getAdminProfile } from '~/lib/services/admin.service';
import { useAdminProfileForm } from './hooks/useAdminProfileForm';
import { useAdminProfileSave } from './hooks/useProfileSave';

export default function AdminProfile() {
	const { user } = useAuth();
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);

	// Custom hooks para manejar el estado complejo del perfil
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
	} = useAdminProfileForm({
		name: user?.name || '',
		email: user?.email || '',
		phone: '',
		role: user?.role || 'administrador',
		description: '',
		avatarUrl: user?.avatarUrl,
	});

	const { isSaving, error, success, setError, saveProfile } =
		useAdminProfileSave();

	// Cargar el perfil completo cuando el componente se monta
	useEffect(() => {
		const loadProfile = async () => {
			if (!user) return;

			try {
				setIsLoadingProfile(true);
				const profileData = await getAdminProfile();

				// Actualizar el estado del perfil con los datos cargados
				setProfile({
					...profileData,
					avatarUrl: user.avatarUrl, // Mantener el avatar del contexto
					name: user.name, // Mantener nombre del contexto
					email: user.email,
					role: profileData.role || user.role || 'administrador',
				});
			} catch (err) {
				console.error('Error cargando perfil:', err);
				setError('Error al cargar tu perfil');
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
			role: profile.role,
			description: profile.description,
		});

		if (saved) {
			setIsEditing(false);
			setAvatarPreview(null);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const result = handleImageUpload(event);
		if (result?.error) {
			setError(result.error);
		}
	};

	const handleCancel = () => {
		if (user) {
			resetForm(user);
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
				title="Mi Perfil de Administrador"
				description="Gestiona tu información personal y configuración de administrador"
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
							src={profile.avatarUrl}
							name={profile.name}
							isEditing={isEditing}
							onImageChange={handleImageChange}
							preview={avatarPreview}
						/>
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
							showRoleField={true}
							roleReadOnly={true}
							roleDescription="No se puede modificar"
							descriptionLabel="Biografía"
							descriptionPlaceholder="Describe tu rol y responsabilidades como administrador..."
						/>
					</div>
				</CardBody>
			</Card>

			{/* Estadísticas del Sistema */}
			<Card>
				<CardBody className="gap-4">
					<h2 className="text-xl font-semibold">Estadísticas del Sistema</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard
							title="Usuarios Activos"
							value={0}
							description="Total"
							color="primary"
						/>
						<StatsCard
							title="Tutorías Realizadas"
							value={0}
							description="Este mes"
							color="success"
						/>
						<StatsCard
							title="Materiales Publicados"
							value={0}
							description="Total"
							color="warning"
						/>
						<StatsCard
							title="Tasa de Aprobación"
							value="0%"
							description="General"
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
						emailNotificationsDescription="Recibe notificaciones importantes del sistema"
					/>
				</CardBody>
			</Card>
		</div>
	);
}
