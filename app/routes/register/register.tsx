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
import { authService } from '../../lib/api/auth';

export function meta() {
	return [
		{ title: 'Registrarse - ECIWISE+' },
		{ name: 'description', content: 'Crea tu cuenta en ECIWISE+' },
	];
}

export default function Register() {
	const handleGoogleSignup = () => {
		authService.loginWithGoogle();
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-content1 to-content3 p-4 py-12">
			<div className="w-full max-w-md container mx-auto text-center mb-6">
				<div className="flex items-center justify-center gap-2 mb-2">
					<GraduationCap className="text-primary" size={32} />
					<h1 className="text-2xl font-bold text-foreground font-logo">
						ECIWISE+
					</h1>
				</div>
				<p className="text-sm text-primary font-semibold">
					Aprender, conectar y compartir sin límites
				</p>
			</div>

			{/* Register Card */}
			<Card className="w-full max-w-md shadow-lg container mx-auto bg-content1">
				<CardHeader className="flex flex-col items-center pb-2 pt-6">
					<h1 className="text-2xl font-bold text-foreground font-heading mb-2">
						Crea Tu Cuenta
					</h1>
					<p className="text-base text-default-600 text-center font-sans">
						Usa tu cuenta institucional de Google
					</p>
				</CardHeader>

				<CardBody className="space-y-6 px-8 py-6">
					{/* Google Sign Up Button */}
					<Button
						onClick={handleGoogleSignup}
						size="lg"
						variant="bordered"
						className="w-full font-semibold font-nav"
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

					{/* Beneficios */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-foreground text-center font-heading">
							Al registrarte tendrás acceso a:
						</h3>
						<ul className="space-y-2 text-sm text-default-600 font-sans">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">✓</span>
								<span>Foros de discusión y resolución de dudas</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">✓</span>
								<span>Conexión con tutores y compañeros</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">✓</span>
								<span>Recursos educativos compartidos</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">✓</span>
								<span>Sistema de seguimiento académico</span>
							</li>
						</ul>
					</div>

					{/* Términos */}
					<p className="text-xs text-default-500 text-center font-sans">
						Al continuar, aceptas nuestros{' '}
						<Link href="#" className="text-primary font-nav" size="sm">
							términos y condiciones
						</Link>{' '}
						y{' '}
						<Link href="#" className="text-primary font-nav" size="sm">
							política de privacidad
						</Link>
					</p>
				</CardBody>

				<CardFooter className="flex justify-center py-4 px-6">
					<p className="text-sm text-default-600 text-center font-sans">
						¿Ya tienes cuenta?{' '}
						<Link
							href="/login"
							className="text-primary font-semibold hover:text-primary-600 font-nav"
						>
							Inicia sesión aquí
						</Link>
					</p>
				</CardFooter>
			</Card>

			{/* Back to Home Link */}
			<div className="mt-4">
				<Link
					href="/"
					className="text-default-600 hover:text-primary font-medium font-nav text-sm"
				>
					← Volver al inicio
				</Link>
			</div>
		</div>
	);
}
