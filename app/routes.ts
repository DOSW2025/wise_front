import { index, type RouteConfig, route } from '@react-router/dev/routes';

// Helper function to create dashboard routes
function createDashboardRoutes(role: string, pages: string[]) {
	const _baseRoute = route(
		`dashboard/${role}`,
		`routes/dashboard/${role}/dashboard.tsx`,
	);
	const adminPages =
		role === 'admin'
			? [
					index(`routes/dashboard/${role}/index.tsx`),
					route('users', `routes/dashboard/${role}/users.tsx`),
					route('users/:userId', `routes/dashboard/${role}/users.$userId.tsx`),
					...pages
						.filter((p) => p !== 'users')
						.map((page) => route(page, `routes/dashboard/${role}/${page}.tsx`)),
				]
			: [
					index(`routes/dashboard/${role}/index.tsx`),
					...pages.map((page) =>
						route(page, `routes/dashboard/${role}/${page}.tsx`),
					),
				];

	return route(
		`dashboard/${role}`,
		`routes/dashboard/${role}/dashboard.tsx`,
		adminPages,
	);
}

export default [
	index('routes/home/home.tsx'),
	route('login', 'routes/login/login.tsx'),
	route('register', 'routes/register/register.tsx'),
	route('auth/callback', 'routes/auth/callback.tsx'),

	// Dashboard routes with layout
	route('dashboard', 'routes/dashboard/dashboard.tsx'),

	// Student dashboard
	createDashboardRoutes('student', [
		'tutoring',
		'materials',
		'progress',
		'community',
		'profile',
	]),

	// Tutor dashboard
	createDashboardRoutes('tutor', [
		'scheduled',
		'requests',
		'materials',
		'performance',
		'reports',
		'community',
		'help',
		'profile',
	]),

	// Admin dashboard
	createDashboardRoutes('admin', [
		'users',
		'materials',
		'materias',
		'reports',
		'settings',
		'help',
		'profile',
	]),
] satisfies RouteConfig;
