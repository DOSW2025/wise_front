// app/lib/hooks/useProfile.ts
import { useState } from 'react';
import { useProfileManager } from './useProfileManager';

interface ProfileConfig<T> {
	role: 'admin' | 'student' | 'tutor';
	getProfileFn: () => Promise<T>;
	useFormHook: (initial: T) => any;
	useSaveHook: () => any;
	initialProfile: T;
}

const ROLE_CONFIGS = {
	admin: {
		title: 'Mi Perfil de Administrador',
		description:
			'Gestiona tu información personal y configuración de administrador',
		descriptionLabel: 'Biografía',
		descriptionPlaceholder:
			'Describe tu rol y responsabilidades como administrador...',
		statsTitle: 'Estadísticas del Sistema',
		stats: [
			{
				title: 'Usuarios Activos',
				value: 0,
				description: 'Total',
				color: 'primary' as const,
			},
			{
				title: 'Tutorías Realizadas',
				value: 0,
				description: 'Este mes',
				color: 'success' as const,
			},
			{
				title: 'Materiales Publicados',
				value: 0,
				description: 'Total',
				color: 'warning' as const,
			},
			{
				title: 'Tasa de Aprobación',
				value: '0%',
				description: 'General',
				color: 'default' as const,
			},
		],
	},
	student: {
		title: 'Mi Perfil',
		description: 'Gestiona tu información personal y configuración',
		descriptionLabel: 'Sobre Mí',
		descriptionPlaceholder: 'Cuéntanos sobre tus intereses y objetivos...',
		statsTitle: 'Mis Estadísticas',
		stats: [
			{
				title: 'Tutorías Tomadas',
				value: 0,
				description: 'Total',
				color: 'primary' as const,
			},
			{
				title: 'Horas de Estudio',
				value: 0,
				description: 'Este mes',
				color: 'success' as const,
			},
			{
				title: 'Materias Cursando',
				value: 0,
				description: 'Activas',
				color: 'warning' as const,
			},
			{
				title: 'Progreso General',
				value: '0%',
				description: 'Avance',
				color: 'default' as const,
			},
		],
	},
	tutor: {
		title: 'Mi Perfil de Tutor',
		description: 'Gestiona tu información personal y configuración de tutor',
		descriptionLabel: 'Biografía Profesional',
		descriptionPlaceholder: 'Describe tu experiencia y especialidades...',
		statsTitle: 'Mis Estadísticas',
		stats: [
			{
				title: 'Tutorías Dadas',
				value: 0,
				description: 'Total',
				color: 'primary' as const,
			},
			{
				title: 'Estudiantes',
				value: 0,
				description: 'Activos',
				color: 'success' as const,
			},
			{
				title: 'Horas Impartidas',
				value: 0,
				description: 'Este mes',
				color: 'warning' as const,
			},
			{
				title: 'Calificación',
				value: '0.0',
				description: 'Promedio',
				color: 'default' as const,
			},
		],
	},
};

export function useProfile<T extends Record<string, any>>({
	role,
	getProfileFn,
	useFormHook,
	useSaveHook,
	initialProfile,
}: ProfileConfig<T>) {
	const [emailNotifications, setEmailNotifications] = useState(true);

	const {
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		isSaving,
		error,
		success,
		isLoadingProfile,
		handleSave,
		handleImageChange,
		handleCancel,
	} = useProfileManager({
		initialProfile,
		getProfileFn,
		saveProfileFn: async (data) => data,
		useFormHook,
		useSaveHook,
	});

	return {
		// Estado del perfil
		profile,
		setProfile,
		formErrors,
		setFormErrors,
		isEditing,
		setIsEditing,
		avatarPreview,
		isSaving,
		error,
		success,
		isLoadingProfile,

		// Handlers - con los nombres que espera ProfilePage
		onEdit: () => setIsEditing(true),
		onSave: handleSave,
		onCancel: handleCancel,
		onImageChange: handleImageChange,

		// Notificaciones
		emailNotifications,
		onEmailNotificationsChange: setEmailNotifications,

		// Configuración por rol
		config: ROLE_CONFIGS[role],
	};
}
