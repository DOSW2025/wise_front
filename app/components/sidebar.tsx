import { Avatar, Button } from '@heroui/react';
import {
	BarChart3,
	BookMarked,
	BookOpen,
	Calendar,
	CheckSquare,
	FileText,
	GraduationCap,
	HelpCircle,
	Home,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	Settings,
	TrendingUp,
	UserCheck,
	Users,
	X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

interface SidebarProps {
	userRole?: 'student' | 'tutor' | 'admin';
	userName?: string;
	userEmail?: string;
	userAvatar?: string;
	onLogout?: () => void;
}

interface MenuItem {
	key: string;
	label: string;
	icon: ReactNode;
	path: string;
}

export function Sidebar({
	userRole = 'student',
	userName = 'Usuario',
	userEmail = 'usuario@eci.edu',
	userAvatar,
	onLogout,
}: SidebarProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const getMenuItems = (): MenuItem[] => {
		if (userRole === 'student') {
			return [
				{
					key: 'home',
					label: 'Inicio',
					icon: <Home className="w-5 h-5" />,
					path: '/dashboard/student',
				},
				{
					key: 'tutoring',
					label: 'Tutorías',
					icon: <GraduationCap className="w-5 h-5" />,
					path: '/dashboard/student/tutoring',
				},
				{
					key: 'materials',
					label: 'Materiales',
					icon: <BookOpen className="w-5 h-5" />,
					path: '/dashboard/student/materials',
				},
				{
					key: 'progress',
					label: 'Mi Progreso',
					icon: <TrendingUp className="w-5 h-5" />,
					path: '/dashboard/student/progress',
				},
				{
					key: 'statistics',
					label: 'Estadísticas',
					icon: <BarChart3 className="w-5 h-5" />,
					path: '/dashboard/student/statistics',
				},
				{
					key: 'community',
					label: 'Comunidad',
					icon: <Users className="w-5 h-5" />,
					path: '/dashboard/student/community',
				},
				{
					key: 'profile',
					label: 'Perfil',
					icon: <UserCheck className="w-5 h-5" />,
					path: '/dashboard/student/profile',
				},
			];
		}

		if (userRole === 'tutor') {
			return [
				{
					key: 'home',
					label: 'Inicio',
					icon: <Home className="w-5 h-5" />,
					path: '/dashboard/tutor',
				},
				{
					key: 'scheduled',
					label: 'Sesiones Programadas',
					icon: <Calendar className="w-5 h-5" />,
					path: '/dashboard/tutor/scheduled',
				},
				{
					key: 'requests',
					label: 'Solicitudes Pendientes',
					icon: <CheckSquare className="w-5 h-5" />,
					path: '/dashboard/tutor/requests',
				},
				{
					key: 'materials',
					label: 'Banco de Materiales',
					icon: <BookOpen className="w-5 h-5" />,
					path: '/dashboard/tutor/materials',
				},
				{
					key: 'performance',
					label: 'Mi Desempeño',
					icon: <BarChart3 className="w-5 h-5" />,
					path: '/dashboard/tutor/performance',
				},
				{
					key: 'reports',
					label: 'Reportes y Métricas',
					icon: <TrendingUp className="w-5 h-5" />,
					path: '/dashboard/tutor/reports',
				},
				{
					key: 'community',
					label: 'Comunidad',
					icon: <MessageSquare className="w-5 h-5" />,
					path: '/dashboard/tutor/community',
				},
				{
					key: 'help',
					label: 'Centro de Ayuda',
					icon: <HelpCircle className="w-5 h-5" />,
					path: '/dashboard/tutor/help',
				},
				{
					key: 'profile',
					label: 'Perfil',
					icon: <UserCheck className="w-5 h-5" />,
					path: '/dashboard/tutor/profile',
				},
			];
		}

		if (userRole === 'admin') {
			return [
				{
					key: 'home',
					label: 'Panel General',
					icon: <LayoutDashboard className="w-5 h-5" />,
					path: '/dashboard/admin',
				},
				{
					key: 'users',
					label: 'Gestión de Usuarios',
					icon: <Users className="w-5 h-5" />,
					path: '/dashboard/admin/users',
				},
				{
					key: 'materials',
					label: 'Gestor de Materiales',
					icon: <FileText className="w-5 h-5" />,
					path: '/dashboard/admin/materials',
				},
				{
					key: 'materias',
					label: 'Gestión de Materias',
					icon: <BookMarked className="w-5 h-5" />,
					path: '/dashboard/admin/gamification',
				},
				{
					key: 'reports',
					label: 'Reportes y Métricas',
					icon: <TrendingUp className="w-5 h-5" />,
					path: '/dashboard/admin/reports',
				},
				{
					key: 'settings',
					label: 'Configuración',
					icon: <Settings className="w-5 h-5" />,
					path: '/dashboard/admin/settings',
				},
				{
					key: 'help',
					label: 'Centro de Ayuda',
					icon: <HelpCircle className="w-5 h-5" />,
					path: '/dashboard/admin/help',
				},
				{
					key: 'profile',
					label: 'Perfil',
					icon: <UserCheck className="w-5 h-5" />,
					path: '/dashboard/admin/profile',
				},
			];
		}

		return [];
	};

	const menuItems = getMenuItems();

	const getRoleLabel = () => {
		switch (userRole) {
			case 'student':
				return 'Panel de Estudiante';
			case 'tutor':
				return 'Panel de Tutor';
			case 'admin':
				return 'Panel de Administrador';
			default:
				return 'Panel';
		}
	};

	const handleLogout = () => {
		if (onLogout) {
			onLogout();
		}
		navigate('/login');
	};

	console.log('Sidebar props:', { userName, userEmail, userAvatar });
	console.log('Avatar URL:', userAvatar);
	console.log('Avatar exists:', !!userAvatar);

	return (
		<>
			{/* Mobile menu toggle button */}
			<Button
				isIconOnly
				variant="light"
				className="fixed top-4 left-4 z-50 lg:hidden"
				onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
			>
				{isMobileMenuOpen ? (
					<X className="w-6 h-6" />
				) : (
					<Menu className="w-6 h-6" />
				)}
			</Button>

			{/* Overlay for mobile */}
			{isMobileMenuOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/50 z-30 lg:hidden border-none cursor-default"
					onClick={() => setIsMobileMenuOpen(false)}
					onKeyDown={(e) => {
						if (e.key === 'Escape' || e.key === 'Enter')
							setIsMobileMenuOpen(false);
					}}
					aria-label="Close menu"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					w-64 h-screen bg-content1 border-r border-divider flex flex-col fixed left-0 top-0 shadow-medium z-40
					transition-transform duration-300 ease-in-out
					${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				`}
			>
				{/* Logo y título */}
				<div className="p-6 border-b border-divider bg-gradient-to-b from-primary-50 to-transparent">
					<Link
						to="/dashboard"
						className="flex items-center gap-2"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<img
							src="/logo/logo.png"
							onError={(e) => {
								e.currentTarget.src = '/logo/logo.png';
							}}
							alt="ECIWISE+ logo"
							className="w-11 h-11"
						/>
						<div className="flex flex-col items-start gap-1 pl-2">
							<h1 className="text-2xl font-bold text-primary">ECIWISE+</h1>
							<p className="text-sm text-default-600 font-medium">
								{getRoleLabel()}
							</p>
						</div>
					</Link>
				</div>

				{/* Información del usuario */}
				<div className="p-4 border-b border-divider bg-content2">
					<div className="flex items-center gap-3">
						<Avatar
							src={
								userAvatar
									? userAvatar.includes('googleusercontent.com')
										? `${userAvatar.split('=')[0]}=s200-c`
										: userAvatar
									: undefined
							}
							color="primary"
							isBordered
							size="md"
							showFallback
							name={userName}
							imgProps={{
								referrerPolicy: 'no-referrer',
								onError: (e) => {
									console.error('Sidebar: Error loading avatar:', userAvatar);
									e.currentTarget.style.display = 'none';
								},
								onLoad: () => {
									console.log(
										'Sidebar: Avatar loaded successfully:',
										userAvatar,
									);
								},
							}}
							classNames={{
								base: 'bg-primary',
								icon: 'text-primary',
								img: 'object-cover',
							}}
						/>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-sm text-foreground truncate">
								{userName}
							</p>
							<p className="text-xs text-default-500 truncate">{userEmail}</p>
						</div>
					</div>
				</div>

				{/* Menú de navegación */}
				<nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
					{menuItems.map((item) => {
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.key}
								to={item.path}
								onClick={() => setIsMobileMenuOpen(false)}
								className={`
									flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors font-nav
									${
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-default-700 hover:bg-default-100'
									}
								`}
							>
								{item.icon}
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* Botón de cerrar sesión */}
				<div className="p-4 border-t border-divider bg-content2">
					<Button
						fullWidth
						color="danger"
						variant="light"
						startContent={<LogOut className="w-4 h-4" />}
						onPress={handleLogout}
						className="justify-start font-medium hover:bg-danger-50"
					>
						Cerrar Sesión
					</Button>
				</div>
			</aside>
		</>
	);
}
