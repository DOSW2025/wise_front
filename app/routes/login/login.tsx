import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Form,
	Input,
	Link,
} from '@heroui/react';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { AuthService } from '../../lib/services/auth.service';

export function meta() {
	return [
		{ title: 'Iniciar Sesion - ECIWISE+' },
		{ name: 'description', content: 'Inicia sesion en ECIWISE+' },
	];
}

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState('');

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			// Llamar al servicio de autenticación
			const response = await AuthService.login({
				email,
				contraseña: password,
			});

			console.log('Login exitoso:', response);

			// Redirigir según el rol del usuario
			if (response.user.role === 'admin') {
				window.location.href = '/admin';
			} else {
				window.location.href = '/dashboard';
			}
		} catch (err: any) {
			console.error('Error en login:', err);
			setError(
				err.message || 'Error al iniciar sesión. Verifica tus credenciales.',
			);
		} finally {
			setIsLoading(false);
		}
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
						Aprender, conectar y compartir sin limites
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
						Inicia Sesion en Tu Cuenta
					</h1>
					<p className="text-base text-default-600 text-center">
						Ingresa tus credenciales institucionales para acceder
					</p>
				</CardHeader>

				<CardBody className="space-y-5 px-6">
					{/* Mostrar errores */}
					{error && (
						<div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg">
							<p className="text-sm font-medium">{error}</p>
						</div>
					)}

					<Form onSubmit={handleEmailLogin} className="space-y-4">
						<Input
							type="email"
							label="Correo Institucional"
							placeholder="tu.nombre@escuelaing.edu.co"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							isRequired
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
							startContent={<Mail className="text-default-400" size={20} />}
						/>

						<Input
							type="password"
							label="Contraseña"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							isRequired
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
							startContent={<Lock className="text-default-400" size={20} />}
						/>

						<div className="flex justify-between items-center text-small w-full">
							<Checkbox
								size="sm"
								isSelected={rememberMe}
								onValueChange={setRememberMe}
							>
								Recordarme
							</Checkbox>
							<Link
								href="#"
								className="text-primary hover:text-primary-600"
								size="sm"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</div>

						<Button
							type="submit"
							color="primary"
							size="lg"
							className="w-full font-semibold font-nav"
							isLoading={isLoading}
							isDisabled={isLoading}
						>
							{isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
						</Button>
					</Form>

					{/* Google OAuth - TODO: Implementar en futuras versiones */}
					{/* 
                    <div className="flex items-center gap-3">
                        <Divider className="flex-1" />
                        <span className="text-sm text-default-500 font-medium">
                            O continua con
                        </span>
                        <Divider className="flex-1" />
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        variant="bordered"
                        size="lg"
                        className="w-full font-semibold font-nav"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        startContent={
                            !isLoading && (
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
                            )
                        }
                    >
                        {isLoading ? 'Conectando...' : 'Continuar con Google'}
                    </Button>
                    */}
				</CardBody>

				<CardFooter className="flex justify-center mb-5 px-6">
					<p className="text-base text-default-600 text-center">
						¿No tienes cuenta?{' '}
						<Link
							href="/register"
							className="text-primary font-semibold hover:text-primary-600"
						>
							Registrate aqui
						</Link>
					</p>
				</CardFooter>
			</Card>

			{/* Demo Credentials - TODO: Solo visible durante desarrollo, ocultar en producción */}
			{/* 
            <Card className="w-full max-w-md container mx-auto bg-content2 mt-6 shadow-md">
                <CardHeader className="flex flex-col items-start pb-2">
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                        Credenciales de Demostración
                    </h3>
                </CardHeader>
                <CardBody className="space-y-3 text-sm">
                    <div className="bg-content3 p-3 rounded-lg">
                        <p className="font-semibold text-foreground mb-1">
                            Estudiante:
                        </p>
                        <p className="text-default-600">
                            Email: estudiante@escuelaing.edu.co
                        </p>
                        <p className="text-default-600">Contraseña: 123456789</p>
                    </div>
                    <div className="bg-content3 p-3 rounded-lg">
                        <p className="font-semibold text-foreground mb-1">Tutor:</p>
                        <p className="text-default-600">
                            Email: tutor@escuelaing.edu.co
                        </p>
                        <p className="text-default-600">Contraseña: 123456789</p>
                    </div>
                    <div className="bg-content3 p-3 rounded-lg">
                        <p className="font-semibold text-foreground mb-1">
                            Administrador:
                        </p>
                        <p className="text-default-600">
                            Email: admin@escuelaing.edu.co
                        </p>
                        <p className="text-default-600">Contraseña: 123456789</p>
                    </div>
                </CardBody>
            </Card>
            */}

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
