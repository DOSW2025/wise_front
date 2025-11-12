import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	index('routes/home/home.tsx'),
	route('login', 'routes/login/login.tsx'),
	route('register', 'routes/register/register.tsx'),

	// Dashboard routes with layout
	route('dashboard', 'routes/dashboard/dashboard.tsx', [
		index('routes/dashboard/student/index.tsx'),
		route('tutor', 'routes/dashboard/tutor/index.tsx'),
		route('admin', 'routes/dashboard/admin/index.tsx'),
	]),
] satisfies RouteConfig;
