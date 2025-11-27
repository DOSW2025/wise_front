import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';

interface RoleDashboardProps {
	allowedRole: 'admin' | 'student' | 'tutor';
}

export function RoleDashboard({ allowedRole }: RoleDashboardProps) {
	const navigate = useNavigate();

	// TEMPORAL: Usuario mock para desarrollo
	const mockUser = {
		id: 'dev-tutor-1',
		name: 'Tutor Desarrollo',
		email: 'tutor@dev.com',
		role: allowedRole,
		avatarUrl: undefined,
	};

	const handleLogout = () => {
		navigate('/login');
	};

	return (
		<DashboardLayout
			userRole={mockUser.role}
			userName={mockUser.name}
			userEmail={mockUser.email}
			userAvatar={mockUser.avatarUrl}
			onLogout={handleLogout}
		/>
	);
}
