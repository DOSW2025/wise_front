import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('routes/home/home.tsx'),
    route('login', 'routes/login/login.tsx'),
    route('register', 'routes/register/register.tsx'),
] satisfies RouteConfig;
