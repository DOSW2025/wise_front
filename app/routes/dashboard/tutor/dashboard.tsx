import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';

export default function TutorDashboard() {
	const navigate = useNavigate();

	const userRole = 'tutor' as const;
	const userName = 'Tutor Demo';
	const userEmail = 'tutor@eci.edu';
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
