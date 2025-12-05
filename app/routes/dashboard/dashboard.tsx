import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';
import { useAuth } from '~/contexts/auth-context';

// Este componente sirve como layout para todos los dashboards
export default function Dashboard() {
	const navigate = useNavigate();
	const { user, logout, isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/login', { replace: true });
			return;
		}

		// Redirigir al dashboard específico según el rol
		if (!isLoading && user) {
			const rolePath = {
				student: '/dashboard/student',
				tutor: '/dashboard/tutor',
				admin: '/dashboard/admin',
			}[user.role];

			if (rolePath) {
				navigate(rolePath, { replace: true });
			}
		}
	}, [isLoading, isAuthenticated, user, navigate]);

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	// Mostrar loading mientras se carga el usuario
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
					<p className="mt-4 text-default-600">Cargando...</p>
				</div>
			</div>
		);
	}

	// Si no hay usuario, no renderizar nada (el useEffect redirigirá)
	if (!user) {
		return null;
	}

	return (
		<DashboardLayout
			userRole={user.role}
			userName={user.name}
			userEmail={user.email}
			userAvatar={user.avatarUrl}
			onLogout={handleLogout}
		/>
	);
}
