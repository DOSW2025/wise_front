import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';

export default function StudentDashboard() {
	const navigate = useNavigate();

	const userRole = 'student' as const;
	const userName = 'Estudiante Demo';
	const userEmail = 'estudiante@eci.edu';
	const userAvatar = undefined;

	const handleLogout = () => {
		navigate('/login');
	};

	return (
		<DashboardLayout
			userRole={userRole}
			userName={userName}
			userEmail={userEmail}
			userAvatar={userAvatar}
			onLogout={handleLogout}
		/>
	);
}
