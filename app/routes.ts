import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	index('routes/home/home.tsx'),
	route('login', 'routes/login/login.tsx'),
	route('register', 'routes/register/register.tsx'),

	// Dashboard routes with layout
	route('dashboard', 'routes/dashboard/dashboard.tsx', [
		index('routes/dashboard/student/index.tsx'),
		route('tutor', 'routes/dashboard/tutor/index.tsx', [
			route('scheduled', 'routes/dashboard/tutor/scheduled.tsx'),
			route('requests', 'routes/dashboard/tutor/requests.tsx'),
			route('materials', 'routes/dashboard/tutor/materials.tsx'),
			route('reports', 'routes/dashboard/tutor/reports.tsx'),
			route('community', 'routes/dashboard/tutor/community.tsx'),
			route('help', 'routes/dashboard/tutor/help.tsx'),
			route('profile', 'routes/dashboard/tutor/profile.tsx'),
		]),
		route('admin', 'routes/dashboard/admin/index.tsx'),
	]),
] satisfies RouteConfig;
