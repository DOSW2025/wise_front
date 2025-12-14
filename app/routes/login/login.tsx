import { Button, Card, CardBody, Divider, Link } from '@heroui/react';
import { GraduationCap, Shield, Users } from 'lucide-react';
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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-success-50 p-4">
			<div className="w-full max-w-6xl">
				<Card className="overflow-hidden shadow-2xl">
					<div className="grid md:grid-cols-2 gap-0">
						{/* Panel izquierdo - Imagen y descripción */}
						<div className="relative hidden md:block bg-gradient-to-br from-primary-600 to-secondary-600 p-12">
							{/* Imagen de fondo con overlay */}
							<div
								className="absolute inset-0 bg-cover bg-center opacity-20"
								style={{ backgroundImage: 'url(/photos/eci-image-1.jpg)' }}
							/>

							<div className="relative z-10 h-full flex flex-col justify-between text-white">
								{/* Logo y título */}
								<div>
									<div className="flex items-center gap-3 mb-6">
										<div>
											<img
												src="/logo/logo.png"
												alt="ECIWISE+ logo"
												className="w-16 h-16"
											/>
										</div>
										<div>
											<h1 className="text-3xl font-bold font-logo">ECIWISE+</h1>
											<p className="text-sm opacity-90">
												Escuela Colombiana de Ingeniería
											</p>
										</div>
									</div>

									<div className="mt-12">
										<h2 className="text-4xl font-bold mb-4 leading-tight font-heading">
											Bienvenido a tu plataforma de aprendizaje
										</h2>
										<p className="text-lg opacity-90 mb-8 font-sans">
											Conecta, aprende y colabora con la comunidad académica
										</p>
									</div>
								</div>

								{/* Features */}
								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
											<GraduationCap className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-semibold text-lg mb-1 font-heading">
												Recursos Académicos
											</h3>
											<p className="text-sm opacity-90 font-sans">
												Accede a materiales de estudio compartidos por la
												comunidad
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
											<Users className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-semibold text-lg mb-1 font-heading">
												Comunidad Colaborativa
											</h3>
											<p className="text-sm opacity-90 font-sans">
												Participa en foros y grupos de estudio
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
											<Shield className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-semibold text-lg mb-1 font-heading">
												Acceso Seguro
											</h3>
											<p className="text-sm opacity-90 font-sans">
												Protegido con autenticación institucional de Google
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Panel derecho - Formulario de login */}
						<CardBody className="p-12 flex flex-col justify-center bg-content1">
							{/* Logo móvil */}
							<div className="md:hidden flex flex-col items-center mb-8">
								<div className="mb-4">
									<img
										src="/logo/logo.png"
										alt="ECIWISE+ logo"
										className="w-20 h-20"
									/>
								</div>
								<h1 className="text-3xl font-bold text-foreground mb-2 font-logo">
									ECIWISE+
								</h1>
							</div>

							<div className="space-y-6">
								<div>
									<h2 className="text-3xl font-bold text-foreground mb-2 justify-center flex font-heading">
										Iniciar Sesión
									</h2>
									<p className="text-default-600 justify-center flex font-sans">
										Usa tu cuenta institucional de Google para acceder
									</p>
								</div>

								{/* Mostrar error si existe */}
								{error && (
									<div className="bg-danger-50 border-l-4 border-danger-500 text-danger-800 px-4 py-3 rounded-lg">
										<p className="font-semibold">Error de autenticación</p>
										<p className="text-sm">{error}</p>
									</div>
								)}

								{/* Google OAuth Button */}
								<Button
									onClick={handleGoogleLogin}
									size="lg"
									color="primary"
									className="w-full font-semibold text-base h-14 shadow-lg hover:shadow-xl transition-all font-nav"
									startContent={
										<svg
											className="w-6 h-6"
											viewBox="0 0 24 24"
											aria-label="Google logo"
											role="img"
										>
											<title>Google</title>
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
									}
								>
									Continuar con Google
								</Button>

								<Divider />

								{/* Info adicional */}
								<div className="space-y-3 p-4 bg-default-50 rounded-lg">
									<div className="flex items-start gap-3">
										<Shield className="w-5 h-5 text-primary mt-0.5" />
										<div>
											<h4 className="text-sm font-semibold text-foreground mb-1 font-heading">
												Inicio de sesión seguro
											</h4>
											<p className="text-xs text-default-600 font-sans">
												Tu información está protegida mediante OAuth 2.0. No
												almacenamos tu contraseña.
											</p>
										</div>
									</div>
								</div>

								{/* Footer links */}
								<div className="space-y-4 pt-4">
									<p className="text-center text-default-600 font-sans">
										¿No tienes cuenta?{' '}
										<Link
											href="/register"
											className="text-primary font-semibold hover:text-primary-600 font-nav"
										>
											Regístrate aquí
										</Link>
									</p>

									<div className="text-center">
										<Link
											href="/"
											className="text-default-500 hover:text-primary text-sm font-nav"
										>
											← Volver al inicio
										</Link>
									</div>
								</div>
							</div>
						</CardBody>
					</div>
				</Card>
			</div>
		</div>
	);
}
