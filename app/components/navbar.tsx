import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar as HeroNavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from '@heroui/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

interface NavbarProps {
	userRole?: 'student' | 'tutor' | 'admin';
	userName?: string;
	userAvatar?: string;
}

export function Navbar({ userRole, userName, userAvatar }: NavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	// Definir elementos del menú según el rol
	const getMenuItems = () => {
		const commonItems = [{ name: 'Inicio', path: '/dashboard' }];

		if (userRole === 'student') {
			return [
				{ name: 'Inicio', path: '/dashboard/student' },
				{ name: 'Tutorías', path: '/dashboard/student/tutoring' },
				{ name: 'Materiales', path: '/dashboard/student/materials' },
				{ name: 'Mi Progreso', path: '/dashboard/student/progress' },
				{ name: 'Comunidad', path: '/dashboard/student/community' },
			];
		}

		if (userRole === 'tutor') {
			return [
				{ name: 'Inicio', path: '/dashboard/tutor' },
				{ name: 'Programadas', path: '/dashboard/tutor/scheduled' },
				{ name: 'Solicitudes', path: '/dashboard/tutor/requests' },
				{ name: 'Materiales', path: '/dashboard/tutor/materials' },
				{ name: 'Reportes', path: '/dashboard/tutor/reports' },
				{ name: 'Comunidad', path: '/dashboard/tutor/community' },
			];
		}

		if (userRole === 'admin') {
			return [
				...commonItems,
				{ name: 'Usuarios', path: '/dashboard/users' },
				{ name: 'Tutorías', path: '/dashboard/tutoring-management' },
				{ name: 'Materiales', path: '/dashboard/materials-management' },
				{ name: 'Reportes', path: '/dashboard/reports' },
			];
		}

		return commonItems;
	};

	const menuItems = getMenuItems();

	return (
		<HeroNavbar
			maxWidth="xl"
			isBordered
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			classNames={{
				wrapper: 'px-4 sm:px-6',
			}}
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				/>
			</NavbarContent>

			<NavbarContent className="sm:hidden pr-3" justify="center">
				<NavbarBrand>
					<Link to="/dashboard" className="flex items-center gap-2">
						<svg
							className="w-8 h-8 text-primary"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-label="ECIWISE+ logo"
						>
							<title>ECIWISE+ logo</title>
							<path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
							<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
						</svg>
						<p className="font-bold text-xl text-primary">ECIWISE+</p>
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="start">
				<NavbarBrand>
					<Link to="/dashboard" className="flex items-center gap-2">
						<svg
							className="w-8 h-8 text-primary"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-label="ECIWISE+ logo"
						>
							<title>ECIWISE+ logo</title>
							<path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
							<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
						</svg>
						<p className="font-bold text-xl text-primary">ECIWISE+</p>
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{menuItems.map((item) => (
					<NavbarItem
						key={item.path}
						isActive={location.pathname === item.path}
					>
						<Link
							to={item.path}
							className={
								location.pathname === item.path
									? 'text-primary font-semibold'
									: 'text-foreground'
							}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar
								isBordered
								as="button"
								className="transition-transform"
								color="primary"
								name={userName || 'Usuario'}
								size="sm"
								src={userAvatar}
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label="Acciones de usuario" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Sesión iniciada como</p>
								<p className="font-semibold">{userName || 'Usuario'}</p>
							</DropdownItem>
							<DropdownItem key="settings">
								<Link
									to={
										userRole === 'tutor'
											? '/dashboard/tutor/profile'
											: userRole === 'admin'
												? '/dashboard/admin/profile'
												: '/dashboard/student/profile'
									}
								>
									Mi Perfil
								</Link>
							</DropdownItem>
							<DropdownItem key="help_and_feedback">
								<Link
									to={
										userRole === 'tutor'
											? '/dashboard/tutor/help'
											: userRole === 'admin'
												? '/dashboard/admin/help'
												: '/dashboard/student/help'
									}
								>
									Ayuda
								</Link>
							</DropdownItem>
							<DropdownItem key="logout" color="danger">
								Cerrar Sesión
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item.path}-${index}`}>
						<Link
							className={`w-full ${
								location.pathname === item.path
									? 'text-primary font-semibold'
									: 'text-foreground'
							}`}
							to={item.path}
							onClick={() => setIsMenuOpen(false)}
						>
							{item.name}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</HeroNavbar>
	);
}
