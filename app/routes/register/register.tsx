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
import type { AxiosError } from 'axios';
import { GraduationCap, Lock, Mail, Phone, User } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { authService } from '../../lib/api/auth';

export function meta() {
	return [
		{ title: 'Registrarse - ECIWISE+' },
		{ name: 'description', content: 'Crea tu cuenta en ECIWISE+' },
	];
}

export default function Register() {
	const [formData, setFormData] = useState({
		nombre: '',
		apellido: '',
		email: '',
		telefono: '',
		contraseña: '',
		confirmPassword: '',
		semestre: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validations
		if (!acceptTerms) {
			setError('Debes aceptar los términos y condiciones');
			return;
		}

		if (formData.contraseña !== formData.confirmPassword) {
			setError('Las contraseñas no coinciden');
			return;
		}

		if (formData.contraseña.length < 6) {
			setError('La contraseña debe tener al menos 6 caracteres');
			return;
		}

		// Validar formato de contraseña
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
		if (!passwordRegex.test(formData.contraseña)) {
			setError(
				'La contraseña debe contener al menos una letra minúscula, una mayúscula y un carácter especial',
			);
			return;
		}

		if (!formData.email.endsWith('@escuelaing.edu.co')) {
			setError('Debes usar un correo institucional (@escuelaing.edu.co)');
			return;
		}

		setIsLoading(true);

		try {
			// Preparar datos para enviar al backend
			const registroData = {
				nombre: formData.nombre,
				apellido: formData.apellido,
				email: formData.email,
				contraseña: formData.contraseña,
				...(formData.telefono && { telefono: formData.telefono }),
				...(formData.semestre && { semestre: Number(formData.semestre) }),
			};

			// Llamar al servicio de registro
			const response = await authService.registro(registroData);

			// Guardar tokens y usuario en localStorage
			localStorage.setItem('token', response.access_token);
			localStorage.setItem('refreshToken', response.refresh_token);
			localStorage.setItem('user', JSON.stringify(response.user));

			// Redirigir al login o dashboard
			window.location.href = '/login';
		} catch (err) {
			const axiosError = err as AxiosError<{
				message?: string;
				error?: string;
			}>;
			const errorMessage =
				axiosError.response?.data?.message ||
				axiosError.response?.data?.error ||
				'Error al crear la cuenta. Por favor, intenta de nuevo.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-content1 to-content3 p-4 py-12">
			<div className="w-full max-w-2xl container mx-auto text-center mb-6">
				<div className="flex items-center justify-center gap-2 mb-2">
					<GraduationCap className="text-primary" size={32} />
					<h1 className="text-2xl font-bold text-foreground font-logo">
						ECIWISE+
					</h1>
				</div>
				<p className="text-sm text-primary font-semibold">
					Aprender, conectar y compartir sin limites
				</p>
			</div>

			{/* Register Form Card */}
			<Card className="w-full max-w-2xl shadow-lg container mx-auto bg-content1">
				<CardHeader className="flex flex-col items-center pb-2 pt-4">
					<h1 className="text-xl font-bold text-foreground font-heading">
						Crea Tu Cuenta
					</h1>
				</CardHeader>

				<CardBody className="space-y-4 px-6 py-4">
					<Form onSubmit={handleRegister} className="space-y-4">
						{/* Mensaje de error */}
						{error && (
							<div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						{/* Nombres y Apellidos */}
						<div className="grid grid-cols-2 gap-4 w-full">
							<Input
								type="text"
								label="Nombres"
								placeholder="Ingresa tus nombres"
								value={formData.nombre}
								onChange={(e) => handleChange('nombre', e.target.value)}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								startContent={<User className="text-default-400" size={20} />}
							/>
							<Input
								type="text"
								label="Apellidos"
								placeholder="Ingresa tus apellidos"
								value={formData.apellido}
								onChange={(e) => handleChange('apellido', e.target.value)}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								startContent={<User className="text-default-400" size={20} />}
							/>
						</div>

						{/* Email y Teléfono */}
						<div className="grid grid-cols-2 gap-4 w-full">
							<Input
								type="email"
								label="Correo Institucional"
								placeholder="tu.nombre@escuelaing.edu.co"
								value={formData.email}
								onChange={(e) => handleChange('email', e.target.value)}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								description="Debe ser un correo @escuelaing.edu.co"
								startContent={<Mail className="text-default-400" size={20} />}
							/>
							<Input
								type="tel"
								label="Teléfono"
								placeholder="3001234567"
								value={formData.telefono}
								onChange={(e) => handleChange('telefono', e.target.value)}
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								description="Opcional"
								startContent={<Phone className="text-default-400" size={20} />}
							/>
						</div>

						{/* Semestre */}
						<Input
							type="number"
							label="Semestre"
							placeholder="¿En qué semestre estás?"
							value={formData.semestre}
							onChange={(e) => handleChange('semestre', e.target.value)}
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
							description="Opcional - Solo para estudiantes"
							min="1"
							max="12"
						/>

						{/* Contraseñas */}
						<div className="grid grid-cols-2 gap-4 w-full">
							<Input
								type="password"
								label="Contraseña"
								placeholder="Mínimo 6 caracteres"
								value={formData.contraseña}
								onChange={(e) => handleChange('contraseña', e.target.value)}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								description="Debe incluir mayúscula, minúscula y carácter especial"
								startContent={<Lock className="text-default-400" size={20} />}
							/>
							<Input
								type="password"
								label="Confirmar Contraseña"
								placeholder="Repite tu contraseña"
								value={formData.confirmPassword}
								onChange={(e) =>
									handleChange('confirmPassword', e.target.value)
								}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								startContent={<Lock className="text-default-400" size={20} />}
							/>
						</div>

						{/* Términos y Condiciones */}
						<div className="flex items-start gap-2">
							<Checkbox
								size="sm"
								isSelected={acceptTerms}
								onValueChange={setAcceptTerms}
								className="mt-1"
							>
								<span className="text-sm text-default-600">
									Acepto los{' '}
									<Link href="#" className="text-primary" size="sm">
										términos y condiciones
									</Link>{' '}
									y la{' '}
									<Link href="#" className="text-primary" size="sm">
										política de privacidad
									</Link>
								</span>
							</Checkbox>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							color="primary"
							size="lg"
							className="w-full font-semibold font-nav mt-6"
							isLoading={isLoading}
							isDisabled={isLoading || !acceptTerms}
						>
							{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
						</Button>
					</Form>
				</CardBody>

				<CardFooter className="flex justify-center py-3 px-6">
					<p className="text-sm text-default-600 text-center">
						¿Ya tienes cuenta?{' '}
						<Link
							href="/login"
							className="text-primary font-semibold hover:text-primary-600"
						>
							Inicia sesión aquí
						</Link>
					</p>
				</CardFooter>
			</Card>

			{/* Back to Home Link */}
			<div className="mt-3">
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
