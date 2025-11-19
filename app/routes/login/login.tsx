import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Link,
} from '@heroui/react';
import { GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { authService } from '../../lib/api/auth';

export function meta() {
	return [
		{ title: 'Iniciar Sesión - ECIWISE+' },
		{ name: 'description', content: 'Inicia sesión en ECIWISE+' },
	];
}

export default function Login() {
	const [searchParams] = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Verificar si hay un error en los parámetros de la URL
		const errorParam = searchParams.get('error');
		if (errorParam === 'auth_failed') {
			setError('Error al autenticar con Google. Por favor, intenta de nuevo.');
		}
	}, [searchParams]);

	const handleGoogleLogin = () => {
		authService.loginWithGoogle();
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-content1 to-content3 p-4">
			{/* Logo Card */}
			<Card className="w-full max-w-md container mx-auto bg-content2 shadow-lg">
				<CardHeader className="flex flex-col items-center pb-2 mt-5">
					<div className="p-4 rounded-full bg-primary/10 mb-4">
						<GraduationCap className="text-primary" size={48} />
					</div>
				</CardHeader>
				<CardBody className="flex flex-col items-center text-center px-8">
					<h1 className="text-3xl font-bold text-foreground mb-2 font-logo">
						ECIWISE+
					</h1>
					<p className="text-lg text-primary font-semibold mb-1">
						Aprender, conectar y compartir sin límites
					</p>
				</CardBody>
				<CardFooter className="flex justify-center mb-5">
					<p className="text-base text-default-600 font-medium text-center">
						Plataforma de Aprendizaje Colaborativo
					</p>
				</CardFooter>
			</Card>

			{/* Login Form Card */}
			<Card className="w-full max-w-md shadow-lg container mx-auto bg-content1 mt-6">
				<CardHeader className="flex flex-col items-center pb-2 mt-5">
					<h1 className="text-2xl font-bold text-foreground mb-2 font-heading">
						Inicia Sesión en Tu Cuenta
					</h1>
					<p className="text-base text-default-600 text-center">
						Usa tu cuenta de Google institucional para acceder
					</p>
				</CardHeader>

				<CardBody className="space-y-5 px-8 py-6">
					{/* Mostrar error si existe */}
					{error && (
						<div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					{/* Google OAuth Button */}
					<Button
						onClick={handleGoogleLogin}
						size="lg"
						className="w-full font-semibold font-nav bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
						startContent={
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								aria-label="Google logo"
								role="img"
							>
								<title>Google</title>
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
						}
					>
						Continuar con Google
					</Button>

					<Divider />

					{/* Información adicional */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-foreground text-center">
							Acceso seguro con Google
						</h3>
						<p className="text-xs text-default-500 text-center">
							Tu información está protegida mediante la autenticación de Google.
							No almacenamos tu contraseña.
						</p>
					</div>
				</CardBody>

				<CardFooter className="flex justify-center mb-5 px-6">
					<p className="text-base text-default-600 text-center">
						¿No tienes cuenta?{' '}
						<Link
							href="/register"
							className="text-primary font-semibold hover:text-primary-600"
						>
							Regístrate aquí
						</Link>
					</p>
				</CardFooter>
			</Card>

			{/* Back to Home Link */}
			<div className="mt-6">
				<Link
					href="/"
					className="text-default-600 hover:text-primary font-medium font-nav"
				>
					← Volver al inicio
				</Link>
			</div>
		</div>
	);
}
