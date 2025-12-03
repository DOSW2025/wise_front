import { index, type RouteConfig, route } from '@react-router/dev/routes';

// Helper function to create dashboard routes
function createDashboardRoutes(role: string, pages: string[]) {
	return route(`dashboard/${role}`, `routes/dashboard/${role}/dashboard.tsx`, [
		index(`routes/dashboard/${role}/index.tsx`),
		...pages.map((page) => route(page, `routes/dashboard/${role}/${page}.tsx`)),
	]);
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
		'statistics',
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
		'validation',
		'reports',
		'settings',
		'help',
		'profile',
	]),
] satisfies RouteConfig;
