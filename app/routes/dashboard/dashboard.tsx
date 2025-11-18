import { useNavigate } from 'react-router';
import { DashboardLayout } from '~/components/dashboard-layout';
// import { useAuth } from '~/contexts/auth-context';

// Este componente sirve como layout para todos los dashboards
// Por ahora usamos un rol por defecto, pero en producción esto vendrá del contexto de autenticación
export default function Dashboard() {
	const navigate = useNavigate();

	// TODO: Obtener el rol del usuario desde el contexto de autenticación
	// const { user, logout } = useAuth();

	// Datos de prueba - reemplazar con datos del contexto de autenticación
	const userRole = 'student' as 'student' | 'tutor' | 'admin';
	const userName = 'Estudiante Demo';
	const userEmail = 'estudiante@eci.edu';
	const userAvatar = undefined;

	const handleLogout = () => {
		// TODO: Llamar a la función logout del contexto
		// logout();
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
