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
	Select,
	SelectItem,
} from '@heroui/react';
import { GraduationCap, Lock, Mail, Phone, User } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function meta() {
	return [
		{ title: 'Registrarse - ECIWISE+' },
		{ name: 'description', content: 'Crea tu cuenta en ECIWISE+' },
	];
}

export default function Register() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
		role: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validations
		if (!acceptTerms) {
			alert('Debes aceptar los términos y condiciones');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}

		if (formData.password.length < 8) {
			alert('La contraseña debe tener al menos 8 caracteres');
			return;
		}

		if (!formData.email.endsWith('@escuelaing.edu.co')) {
			alert('Debes usar un correo institucional (@escuelaing.edu.co)');
			return;
		}

		setIsLoading(true);

		// Simulate registration process
		setTimeout(() => {
			console.log('Register attempt:', formData);
			alert('¡Cuenta creada exitosamente! Redirigiendo al login...');
			window.location.href = '/login';
			setIsLoading(false);
		}, 2000);
	};

	const roles = [
		{ key: 'estudiante', label: 'Estudiante' },
		{ key: 'profesor', label: 'Docente/Tutor' },
	];

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
						{/* Nombres y Apellidos */}
						<div className="grid grid-cols-2 gap-4 w-full">
							<Input
								type="text"
								label="Nombres"
								placeholder="Ingresa tus nombres"
								value={formData.firstName}
								onChange={(e) => handleChange('firstName', e.target.value)}
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
								value={formData.lastName}
								onChange={(e) => handleChange('lastName', e.target.value)}
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
								value={formData.phone}
								onChange={(e) => handleChange('phone', e.target.value)}
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								startContent={<Phone className="text-default-400" size={20} />}
							/>
						</div>

						{/* Rol */}
						<Select
							label="Selecciona tu Rol"
							placeholder="¿Cómo te identificas?"
							selectedKeys={formData.role ? [formData.role] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								handleChange('role', selected);
							}}
							isRequired
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
						>
							{roles.map((role) => (
								<SelectItem key={role.key}>{role.label}</SelectItem>
							))}
						</Select>

						{/* Contraseñas */}
						<div className="grid grid-cols-2 gap-4 w-full">
							<Input
								type="password"
								label="Contraseña"
								placeholder="Mínimo 8 caracteres"
								value={formData.password}
								onChange={(e) => handleChange('password', e.target.value)}
								isRequired
								size="lg"
								color="primary"
								variant="bordered"
								className="w-full"
								description="Mínimo 8 caracteres"
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
