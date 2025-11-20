import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';
import { useAuth } from '~/contexts/auth-context';

export default function AdminDashboard() {
	const navigate = useNavigate();
	const { user, logout, isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/login', { replace: true });
			return;
		}

		// Verificar que el usuario tenga el rol correcto
		if (!isLoading && user && user.role !== 'admin') {
			// Redirigir al dashboard correcto según el rol
			const dashboardPath = `/dashboard/${user.role}`;
			navigate(dashboardPath, { replace: true });
		}
	}, [isLoading, isAuthenticated, user, navigate]);

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

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

	if (!user) {
		return null;
	}

	return (
		<DashboardLayout
			userRole={user.role}
			userName={user.name}
			userEmail={user.email}
			userAvatar={user.avatar}
			onLogout={handleLogout}
		/>
	);
}
